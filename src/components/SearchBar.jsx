import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [countryFilter, setCountryFilter] = useState("");
  const [rating, setRating] = useState("");
  const [budget, setBudget] = useState({ min: 0, max: 1000 });
  const [selectedTag, setSelectedTag] = useState("");
  const [availableTags] = useState([
    "Tag 1",
    "Tag 2",
    "Tag 3",
    "Tag 4",
    "Tag 5",
  ]);

  const handleSearch = (event) => {
    event.preventDefault();
  };

  const handleBudgetChange = (name, value) => {
    setBudget((prevBudget) => ({ ...prevBudget, [name]: value }));
  };

  return (
    <div className={`container searchBarContainer`}>
      <div className="searchBar">
        <form onSubmit={handleSearch} className="searchForm">
          <div className="searchInput">
            <input
              type="text"
              className={`form-control rounded-pill input`}
              placeholder="Search Keywords"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit" className={`btn btn-warning searchBtn`}>
              <FontAwesomeIcon icon={faSearch} />
            </button>
          </div>
          <div className="filters">
            <div className="dropdowns">
              <select
                className="form-control rounded-pill select"
                value={countryFilter}
                onChange={(e) => setCountryFilter(e.target.value)}
              >
                <option value="">Select Country</option>
                <option value="Thailand">Thailand</option>
                <option value="Singapore">Singapore</option>
                <option value="USA">USA</option>
              </select>
              <select
                className="form-control rounded-pill select"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
              >
                <option value="">Rating</option>
                {[5, 4, 3, 2, 1].map((star) => (
                  <option
                    key={star}
                    value={star}
                  >{`${star} stars & up`}</option>
                ))}
              </select>
              <select
                className={`form-control rounded-pill select`}
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
              >
                <option value="">Select Tag</option>
                {availableTags.map((tag) => (
                  <option key={tag} value={tag}>
                    {tag}
                  </option>
                ))}
              </select>
            </div>
            <div className="priceRange">
              <div className="input-group">
                <div className="input-group-color">
                  <span className="input-group-text">$</span>
                </div>
                <input
                  type="number"
                  className={`form-control rounded-pill priceInput"`}
                  placeholder="Min price"
                  value={budget.min}
                  onChange={(e) => handleBudgetChange("min", e.target.value)}
                />
                <div className="input-group-color">
                  <span className="input-group-text">to</span>
                </div>
                <input
                  type="number"
                  className={`form-control rounded-pill priceInput"`}
                  placeholder="Max price"
                  value={budget.max}
                  onChange={(e) => handleBudgetChange("max", e.target.value)}
                />
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SearchBar;
