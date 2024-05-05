import React, { useState, useEffect } from "react";
import { axiosExternalClient } from "../../others/network/axiosClient";
import * as tj from "@mapbox/togeojson";
import rewind from "@mapbox/geojson-rewind";
import tokml from "tokml";
import ReusableKMLViewer from "./KMLViewer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faChevronCircleDown,
  faLocation,
} from "@fortawesome/free-solid-svg-icons";
import axiosClient from "../../others/network/axiosClient";

const KMLEditor = ({ onChangeKML, initialPostId = null }) => {
  useEffect(() => {
    if (initialPostId) {
      getCurrentKMLFile(initialPostId);
    }
  }, []);

  const getCurrentKMLFile = async (postId) => {
    try {
      await axiosClient.get(`/posts/${postId}/kml-file`).then((res) => {
        parseKMLtoGeoJSON(res.data);
      });
    } catch (e) {
      console.error(e);
    }
  };
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const debounce = (func, timeout = 300) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        func.apply(this, args);
      }, timeout);
    };
  };

  const onSearch = (e) => {
    setSearch(e.target.value);
    debouncedSearch();
  };

  const onFindPlaces = async () => {
    if (search != "") {
      try {
        await axiosExternalClient
          .get(
            `https://api.geoapify.com/v1/geocode/autocomplete?text=${search}&format=json&apiKey=ed24fe3439e946d5a60cda3a1b687587`
          )
          .then((response) => setSearchResults(response.data.results));
      } catch (error) {
        console.error(error);
      }
    }
  };

  const debouncedSearch = debounce(onFindPlaces);

  //displaying current locations
  const [layer, setLayer] = useState(null);
  const [center, setCenter] = useState([1.294385, 103.7727545]);
  const [currentLocations, setCurrentLocations] = useState([]);
  //const myAPIKey = "ed24fe3439e946d5a60cda3a1b687587";

  useEffect(() => {
    const layer = convertToGeoJSON();
    setLayer(layer);
  }, [currentLocations]);

  //api call to parse coords into location
  const parseCoordsToLocation = async (lat, long) => {
    try {
      const response = await axiosExternalClient.get(
        `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${long}&format=json&apiKey=ed24fe3439e946d5a60cda3a1b687587`
      );
      return response;
    } catch (error) {
      console.error(error);
    }
  };

  const convertCoordsToLocations = async (layer) => {
    if (layer != null) {
      const coords = layer.features.map((feature) => {
        const coord = feature.geometry.coordinates;
        return [coord[1], coord[0]];
      });

      try {
        const promises = coords.map(async (coord) => {
          const lat = coord[0].toString();
          const long = coord[1].toString();
          return await parseCoordsToLocation(lat, long);
        });

        const locations = await Promise.all(promises);
        setCurrentLocations(locations);
      } catch (error) {
        console.error(error);
        // Handle error if needed
        return []; // Return an empty array or handle it appropriately
      }
    }
  };

  const parseKMLtoGeoJSON = (text) => {
    const dom = new DOMParser().parseFromString(text, "text/xml"); // create xml dom object
    const converted = tj.kml(dom); // convert xml dom to geojson
    rewind(converted, false); // correct right hand rule

    //handling of coordinates
    converted.features.forEach((feature) => {
      const newCoords = [
        feature.geometry.coordinates[1],
        feature.geometry.coordinates[0],
      ];

      return {
        ...feature,
        geometry: { type: "Point", coordinates: newCoords },
      };
    });
    setLayer(converted); // save converted geojson to hook state
    setCenter([
      converted.features[0].geometry.coordinates[1],
      converted.features[0].geometry.coordinates[0],
    ]);
    convertCoordsToLocations(converted);
  };

  const onAddItinerary = (e) => {
    const value = e.target.value.split(" ");
    parseCoordsToLocation(value[0], value[1]).then((response) => {
      const newListOfLocations = [...currentLocations, response];
      setCurrentLocations(newListOfLocations);
    });
  };

  const onDeleteLocation = (e) => {
    const value = e.target.value.split(" ");
    const newListOfLocations = currentLocations.filter(
      (location) =>
        location.data.query.lat != value[0] &&
        location.data.query.lon != value[1]
    );
    setCurrentLocations(newListOfLocations);
  };

  //getting directions between locations
  const [mode, setMode] = useState("drive");
  const [directions, setDirections] = useState([]);
  const [geometry, setGeometry] = useState([]);
  const getDirectionsBtwLocations = async () => {
    if (currentLocations.length > 1) {
      let formattedWaypoints = "";
      currentLocations.forEach(
        (location) =>
          (formattedWaypoints +=
            location.data.query.lat + "," + location.data.query.lon + "|")
      );
      formattedWaypoints = formattedWaypoints.substring(
        0,
        formattedWaypoints.length - 1
      );
      try {
        await axiosExternalClient
          .get(
            `https://api.geoapify.com/v1/routing?waypoints=${formattedWaypoints}&mode=${mode}&apiKey=ed24fe3439e946d5a60cda3a1b687587`
          )
          .then((response) => {
            setDirections(response.data.features[0].properties.legs);
            setGeometry(response.data.features[0].geometry.coordinates);
          });
      } catch (error) {
        console.error(error);
      }
    }
  };

  useEffect(() => {
    getDirectionsBtwLocations();
  }, [currentLocations, mode]);

  //converting and exporting as kml

  const convertToGeoJSON = () => {
    if (currentLocations.length > 0) {
      const features = currentLocations.map((location) => {
        const lat = location.data.query.lat;
        const lon = location.data.query.lon;
        const name = location.data.results[0].address_line1;
        return {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [lon, lat],
          },
          properties: {
            name: name,
          },
        };
      });

      const geoJSON = {
        type: "FeatureCollection",
        features: features,
      };

      return geoJSON;
    }
  };

  const saveKMLMap = () => {
    const geoJSON = convertToGeoJSON();

    // Convert GeoJSON to KML
    const convertedData = tokml(geoJSON);

    // Create a Blob from the KML data
    const blob = new Blob([convertedData], {
      type: "kml",
    });

    onChangeKML(blob);

    // Save the Blob as a file
    // saveAs(blob, "3106testerKML.kml");
  };

  const onDragStart = (event, index) => {
    event.dataTransfer.setData("index", index.toString());
  };

  const onDragOver = (event) => {
    event.preventDefault();
  };

  const onDrop = (event, index) => {
    const dragIndex = parseInt(event.dataTransfer.getData("index"));
    const dropIndex = index;

    if (dragIndex !== dropIndex) {
      const updatedLocations = [...currentLocations];
      const [dragItem] = updatedLocations.splice(dragIndex, 1);
      updatedLocations.splice(dropIndex, 0, dragItem);
      setCurrentLocations(updatedLocations);
    }
  };

  const [activeCollapses, setActiveCollapses] = useState([]);

  const toggleCollapse = (index) => {
    const updatedCollapses = [...activeCollapses];
    if (updatedCollapses.includes(index)) {
      updatedCollapses.splice(updatedCollapses.indexOf(index), 1);
    } else {
      updatedCollapses.push(index);
    }
    setActiveCollapses(updatedCollapses);
  };

  return (
    <div className="tw-flex tw-flex-row tw-w-full tw-justify-evenly tw-p-10 tw-h-full tw-text-white tw-gap-5">
      <div className="tw-bg-beige tw-text-blue tw-p-5 tw-rounded tw-gap-5 tw-flex tw-flex-col  tw-w-1/2">
        <h5 className="tw-font-bold">Selected Locations</h5>
        {currentLocations.length > 0 ? (
          <div className="tw-flex tw-flex-col tw-justify-between tw-h-full">
            <div>
              <div className="tw-border-2 tw-gap-3 tw-flex">
                <b>Mode of Transport:</b>
                <select onChange={(e) => setMode(e.target.value)}>
                  <option value="drive">Car</option>
                  <option value="walk">Walking</option>
                  <option value="cycle">Cycling</option>
                </select>
              </div>
              <ol>
                {currentLocations.map((location, index) => (
                  <li
                    style={{ marginBottom: "20px" }}
                    key={index}
                    draggable="true"
                    onDragStart={(event) => onDragStart(event, index)}
                    onDragOver={onDragOver}
                    onDrop={(event) => onDrop(event, index)}
                  >
                    <div className="tw-flex tw-flex-col tw-mb-10 tw-gap-3">
                      <div className="tw-flex tw-flex-row tw-gap-2 tw-items-center tw-justify-between">
                        <div className="tw-cursor-pointer">
                          <div>{location.data.results[0].address_line1}</div>
                          <div>{location.data.results[0].address_line2}</div>
                        </div>
                        <button
                          type="button"
                          className="tw-text-beige rounded tw-w-fit tw-h-fit tw-bg-red tw-border-0 tw-flex tw-flex-row tw-gap-2 tw-items-center"
                          onClick={onDeleteLocation}
                          value={`${location.data.query.lat} ${location.data.query.lon}`}
                        >
                          Remove
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </div>

                      {index < directions.length && (
                        <div className="tw-ml-5">
                          <button
                            className="tw-bg-transparent tw-text-green tw-border-0 tw-font-bold tw-w-fit tw-h-fit tw-flex-row tw-gap-2 tw-flex tw-items-centers"
                            onClick={() => toggleCollapse(index)}
                            aria-expanded={
                              activeCollapses.includes(index) ? "true" : "false"
                            }
                            aria-controls={`collapseExample${index}`}
                          >
                            <FontAwesomeIcon icon={faChevronCircleDown} />
                            Directions
                          </button>
                          {directions[index].steps.map((step) => (
                            <dd
                              className={`collapse ${
                                activeCollapses.includes(index) ? "show" : ""
                              }`}
                              id={`collapseExample${index}`}
                            >
                              {step.instruction.text}
                            </dd>
                          ))}
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ol>
            </div>
            <button
              type="button"
              className="tw-bg-green tw-text-beige tw-rounded tw-font-bold"
              onClick={saveKMLMap}
            >
              Save Map Changes
            </button>
          </div>
        ) : (
          <b>
            <FontAwesomeIcon icon={faLocation} /> No Locations to display yet...
          </b>
        )}
      </div>

      <div className="tw-flex tw-flex-col tw-gap-10 tw-w-1/2">
        <ReusableKMLViewer layer={layer} center={center} geometry={geometry} />
        <div className="tw-bg-beige tw-text-blue tw-p-5 tw-rounded tw-gap-5 tw-flex tw-flex-col tw-h-72 tw-w-full">
          <h5 className="tw-font-bold">Where Next?</h5>
          <input
            onChange={onSearch}
            value={search}
            placeholder="Search for any location"
          />

          {searchResults.length > 0 && (
            <div className="tw-overflow-y-auto tw-flex tw-flex-col tw-gap-3 tw-p-3">
              {searchResults.map((result) => (
                <li className="tw-p-3 tw-flex tw-flex-row tw-justify-between tw-gap-2">
                  <div>
                    {result.address_line1},{result.address_line2}
                  </div>
                  <div value={result.lon}></div>
                  <div value={result.lat}></div>
                  <button
                    onClick={onAddItinerary}
                    className="tw-bg-transparent tw-text-green tw-border-0 tw-font-bold"
                    value={`${result.lat} ${result.lon}`}
                  >
                    +
                  </button>
                </li>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default KMLEditor;
