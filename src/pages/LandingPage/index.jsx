"use client";

import React, { useState, useEffect } from "react";

import { motion } from "framer-motion";
import { useRouter } from "next/router";
import Card from "../../components/Card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMapMarkedAlt,
  faUsers,
  faCalendarAlt,
} from "@fortawesome/free-solid-svg-icons";

const Index = () => {
  const router = useRouter();
  const [initialCardCount, setInitialCardCount] = useState(0);
  const [additionalCardCount, setAdditionalCardCount] = useState(8);
  const [cards, setCards] = useState([]);

  useEffect(() => {
    // Simulating fetching initial cards from an API or data source
    const fetchedCards = Array.from({ length: 8 }, (_, index) => (
      <div key={index} className="col-md-3 mb-4">
        <Card />
      </div>
    ));
    setCards(fetchedCards);
    setInitialCardCount(8); // Set the initial card count
  }, []);

  const handleLoadMore = () => {
    // Simulating fetching additional cards
    const additionalCards = Array.from(
      { length: additionalCardCount },
      (_, index) => (
        <div key={initialCardCount + index} className="col-md-3 mb-4">
          <Card />
        </div>
      )
    );
    setCards((prevCards) => [...prevCards, ...additionalCards]); // Append additional cards
    setInitialCardCount((prevCount) => prevCount + additionalCardCount); // Update the initial card count
  };

  return (
    <div
      className="contain-landing"
      style={{ background: "linear-gradient(270deg, #196f5d, #f8f0ca)" }}
    >
      {/* Hero Section */}
      <div
        className="heroSection"
        style={{ background: "linear-gradient(270deg, #196f5d, #f8f0ca)" }}
      >
        <motion.div
          className="row align-items-center"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <div className="col-md-6">
            <div className="heroContent">
              <h1 className="heroTitle">
                Embark on Your Journey with <b>Journy</b>{" "}
              </h1>
              <div className="heroSubtitle">
                <p className="lead">Where Adventure Meets Collaboration</p>
                <p>Explore, Share, Create - Your Ultimate Travel Companion</p>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <motion.div
              className="image-container col-lg-6 col-md-8 col-sm-10 d-none d-md-block"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1, delay: 0.8 }}
            >
              <div className="heroImage">
                <img src="/widget8.png" alt="Adventure" className="img-fluid" />
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      <div className="container mt-5 featuresSection">
        <motion.div
          className="mb-5"
          whileInView={{ opacity: [0.2, 1] }}
          transition={{ duration: 0.2, delay: 0.5 }}
        >
          <h2 className="text-center mb-4 ">
            Explore the extraordinary with Journy
          </h2>
          <p className="lead text-center" style={{ color: "#141451" }}>
            Explore potential locations and magical journeys here
          </p>
        </motion.div>
      </div>

      <div
        className="featuresSection"
        style={{ background: "linear-gradient(270deg, #196f5d, #f8f0ca)" }}
      >
        <div className="row">
          <div className="col-md-4 mb-4">
            <div className="feature text-center p-4">
              <FontAwesomeIcon
                icon={faMapMarkedAlt}
                size="3x"
                className="featureIcon mb-3"
              />
              <h3>Discover</h3>
              <p className="text-muted">
                Explore new destinations and uncover hidden gems.
              </p>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <div className="feature text-center p-4">
              <FontAwesomeIcon
                icon={faUsers}
                size="3x"
                className="featureIcon mb-3"
              />
              <h3>Connect</h3>
              <p className="text-muted">
                Connect with like-minded travelers and share experiences.
              </p>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <div className="feature text-center p-4">
              <FontAwesomeIcon
                icon={faCalendarAlt}
                size="3x"
                className="featureIcon mb-3"
              />
              <h3>Plan</h3>
              <p className="text-muted">
                Create personalized itineraries and plan your adventures.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div
        className="testimonialsSection gradient-04"
        style={{ background: "linear-gradient(270deg, #196f5d, #f8f0ca)" }}
      >
        <div className="row">
          <div className="col-md-6">
            <motion.div
              className="testimonial"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1, delay: 0.8 }}
            >
              <p>
                "Journy helped me discover amazing places and connect with
                fellow travelers. It's my go-to app for planning adventures!"
              </p>
              <p className="author">- Emily, Adventure Enthusiast</p>
            </motion.div>
          </div>
          <div className="col-md-6">
            <motion.div
              className="testimonial"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1, delay: 0.8 }}
            >
              <p>
                "I love how easy it is to create and share itineraries with
                friends. Journy has made traveling so much more enjoyable for
                me."
              </p>
              <p className="author">- Michael, Backpacker</p>
            </motion.div>
          </div>
        </div>
      </div>

      <div
        className="ctaSection"
        style={{ background: "linear-gradient(270deg, #196f5d, #f8f0ca)" }}
      >
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <h2>Start Your Adventure Today</h2>
          <p className="lead">
            Join thousands of travelers worldwide and make every journey
            unforgettable with Journy.
          </p>
          <button
            className={`btn btn-warning btn-lg ctaButton`}
            onClick={() => router.push("/Login")}
          >
            Sign Up Now
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default Index;
