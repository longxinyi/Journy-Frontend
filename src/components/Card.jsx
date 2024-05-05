import React from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

const adventures = [
  {
    title: "Title example",
    description: "Description example",
    imgUrl: "/loginpage.png",
    imgNewTab: "https://www.google.com/",
    rating: "3.8",
    reviewCount: "(24)",
    location: "Chiang Mai",
    price: "From $500 USD / person",
  },
];

const Card = () => {
  const openAdventureInNewTab = (url) => {
    window.open(url, "_blank");
  };

  return (
    <div className="app-profiles">
      {adventures.map((adventure, index) => (
        <motion.div
          whileInView={{ opacity: [0, 1] }}
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.5, type: "tween" }}
          className="app-profile-item"
          key={adventure.title + index}
          onClick={() => openAdventureInNewTab(adventure.imgNewTab)}
          style={{
            cursor: "pointer",
            maxWidth: "250px",
            margin: "auto",
          }}
        >
          <div
            style={{
              position: "relative",
              width: "100%",
              paddingBottom: "100%",
            }}
          >
            <img
              src={adventure.imgUrl}
              alt={adventure.title}
              style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: "10px 10px 0 0",
              }}
            />
          </div>
          <div style={{ padding: "20px", textAlign: "center" }}>
            <p className="p-text" style={{ fontSize: "0.9rem", color: "#888" }}>
              <FontAwesomeIcon icon={faStar} style={{ color: "#ffb83d" }} />{" "}
              {adventure.rating} {adventure.reviewCount} • {adventure.location}
            </p>
            <h2 className="bold-text" style={{ fontSize: "1.1rem" }}>
              {adventure.title}
            </h2>
            <p className="p-text" style={{ fontSize: "0.9rem", color: "#555" }}>
              {adventure.price}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default Card;
