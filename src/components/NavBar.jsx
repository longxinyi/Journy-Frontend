"use client";

import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axiosClient from "../others/network/axiosClient";

const NavBar = () => {
  const router = useRouter();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (token) {
      console.log("JWT token found in local storage");
      // Fetch the user data from the server or set a placeholder
      setUserData({
        /* placeholder user data */
      });
    } else {
      setUserData(null);
      console.log("JWT not found");
    }
  }, []);

  const handleProfileClick = async () => {
    const token = localStorage.getItem("jwt");
    if (!token) {
      router.push("/Signup");
      return;
    }

    try {
      const response = await axiosClient.get("/members/my-profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data) {
        setUserData(response.data);
        router.push(`/Profile/${response.data.memberId}`);
      } else {
        router.push("/Signup");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      router.push("/Signup");
    }
  };

  const handlePlanningClick = () => {
    if (!userData) {
      router.push("/Signup");
    } else {
      router.push("/Planning");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("jwt");
    localStorage.removeItem("currentUser");
    setUserData(null);
    router.push("/Login");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -180 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        ease: [0.6, 0.01, 0.05, 0.95],
        duration: 1.2,
        delay: 0.8,
      }}
    >
      <nav id="Home" className="navbar navbar-expand-lg navbar-light navbar">
        <div className="container">
          <a
            className="navbar-brand navwwwwwbarBrand"
            target="_blank"
            rel="noreferrer"
          >
            <img
              src="journy.png"
              width="30"
              height="30"
              className="d-inline-block"
            />
            Journy
          </a>
          <button
            className="navbar-toggler justify-content-end "
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNavAltMarkup"
            aria-controls="navbarNavAltMarkup"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div
            className="collapse navbar-collapse justify-content-end "
            id="navbarNavAltMarkup"
          >
            <div className="navbar-nav">
              <button
                className="nav-link"
                onClick={() => router.push("/LandingPage")}
              >
                Home
              </button>
              <button
                className="nav-link"
                onClick={() => router.push("/Discover")}
              >
                Discover
              </button>
              {userData && (
                <>
                  <button className="nav-link" onClick={handlePlanningClick}>
                    Planning
                  </button>
                  <button
                    className="nav-link"
                    type="button"
                    onClick={handleProfileClick}
                  >
                    Profile
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-warning"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </>
              )}
              {!userData && (
                <button
                  type="button"
                  className="btn btn-primary rounded-4"
                  style={{
                    width: "100%",
                    fontSize: "0.9rem",
                  }}
                  onClick={() => router.push("/Login")}
                >
                  Let's Explore!
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>
    </motion.div>
  );
};

export default NavBar;
