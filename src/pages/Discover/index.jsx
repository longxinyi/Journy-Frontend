"use client";

import React, { useState, useEffect } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import axiosClient from "../../others/network/axiosClient";

import Post from "../../components/Post";
import SearchBar from "../../components/SearchBar";

const Index = () => {
  const [allPosts, setAllPosts] = useState([]);
  const totalCards = allPosts.length;
  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 5;
  const totalPages = Math.ceil(totalCards / cardsPerPage);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const getAllPosts = async () => {
    try {
      await axiosClient.get("/posts").then((res) => {
        setAllPosts(res.data);
      });
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    getAllPosts();
  }, []);

  return (
    <div className="container my-5">
      <SearchBar />

      <div className="row">
        {allPosts
          .slice((currentPage - 1) * cardsPerPage, currentPage * cardsPerPage)
          .map((post, index) => (
            <div key={index} className="col-12 mb-4">
              <Post postDetails={post} />
            </div>
          ))}
      </div>

      <nav aria-label="Page navigation">
        <ul className="pagination justify-content-center">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
            <li
              key={number}
              className={`page-item ${currentPage === number ? "active" : ""}`}
            >
              <button
                className="page-link"
                onClick={() => handlePageChange(number)}
              >
                {number}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {currentPage < totalPages && (
        <div className="text-center">
          <button
            className="btn btn-primary"
            onClick={() => handlePageChange(currentPage + 1)}
          >
            View More
          </button>
        </div>
      )}
    </div>
  );
};

export default Index;
