"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faClipboardList,
  faUserGroup,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons";
import UploadImage from "../../components/UploadImage";
import FollowButton from "../../components/FollowButton";
import FollowListModal from "../../components/FollowListModal";
import Post from "../../components/Post";
import styles from "./[memberId].module.css";
import axiosClient from "../../others/network/axiosClient";

const Index = () => {
  const router = useRouter();
  const { memberId } = router.query;

  const [userData, setUserData] = useState(null);
  const [tempUserData, setTempUserData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [errors, setErrors] = useState({});
  const [activeTab, setActiveTab] = useState("myPosts");
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 5;
  const [totalPages, setTotalPages] = useState(0);

  const currentPosts = posts.slice(
    (currentPage - 1) * cardsPerPage,
    currentPage * cardsPerPage
  );

  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [showFollowingModal, setShowFollowingModal] = useState(false);
  const [followersList, setFollowersList] = useState([]);
  const [followingList, setFollowingList] = useState([]);

  const handleShowFollowersModal = () => {
    setFollowersList(userData.followersMembers || []);
    setShowFollowersModal(true);
  };

  const handleShowFollowingModal = () => {
    setFollowingList(userData.followingMembers || []);
    setShowFollowingModal(true);
  };

  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  useEffect(() => {
    if (userData && (userData.posts || userData.likedPosts)) {
      const newPosts =
        activeTab === "myPosts" ? userData.posts : userData.likedPosts;
      setPosts(newPosts);
      setTotalPages(Math.ceil(newPosts.length / cardsPerPage));
      setCurrentPage(1);
    }
  }, [userData, activeTab]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userResponse = await axiosClient.get("/members/my-profile", {
          headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` },
        });
        setCurrentUser(userResponse.data);

        const profileResponse = await axiosClient.get(
          `/members/profile/${memberId}`,
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` },
          }
        );
        setUserData(profileResponse.data);
        setTempUserData(profileResponse.data);

        if (userResponse.data.username === profileResponse.data.username) {
          setIsOwnProfile(true);
        } else {
          setIsOwnProfile(false);
        }

        setPosts(profileResponse.data.posts || []);
        setTotalPages(
          Math.ceil((profileResponse.data.posts || []).length / cardsPerPage)
        );
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [memberId]);

  const handleUploadSuccess = (imageUrl) => {
    setTempUserData((prevData) => ({
      ...prevData,
      profilePictureURL: imageUrl,
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTempUserData((prevData) => ({ ...prevData, [name]: value }));
  };

  const updateProfile = async (updatedData) => {
    const dataToSend = {
      ...updatedData,
      authorities: undefined,
    };
    try {
      const response = await axiosClient.put(
        "/members/update-profile",
        dataToSend,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          },
        }
      );
      setUserData(response.data);

      return response.data;
    } catch (error) {
      console.error("Error updating user profile:", error);
    }
  };

  const handleSaveChanges = async () => {
    let newErrors = {};
    let hasErrors = false;

    if (!/^\S+@\S+\.\S+$/.test(tempUserData.email)) {
      newErrors.email = "Please enter a valid email address.";
      hasErrors = true;
    }

    if (!tempUserData.name.trim()) {
      newErrors.name = "Name cannot be empty.";
      hasErrors = true;
    }

    setErrors(newErrors);

    if (!hasErrors) {
      try {
        await updateProfile(tempUserData);
        setUserData({ ...tempUserData });
        setEditMode(false);
        setErrors({});
      } catch (error) {
        console.error("Error updating user data:", error);
      }
    } else {
      setErrors(newErrors);
    }
  };

  const handleCancel = () => {
    setTempUserData({ ...userData });
    setEditMode(false);
  };

  return (
    <div className="container my-5">
      <div className="row">
        <div className="col-md-6">
          {editMode ? (
            <div>
              <strong>Name:</strong>
              <input
                type="text"
                id="name"
                value={tempUserData.name}
                onChange={handleInputChange}
                name="name"
                className={`form-control ${errors.name ? "is-invalid" : ""}`}
                placeholder="Enter name"
              />
              {errors.name && (
                <div className="alert alert-danger mt-2" role="alert">
                  {errors.name}
                </div>
              )}
            </div>
          ) : (
            userData && (
              <h1>
                {userData.name}{" "}
                {userData && !isOwnProfile ? (
                  <FollowButton
                    targetMemberId={memberId}
                    followingMembers={currentUser.followingMembers}
                  />
                ) : (
                  ""
                )}
              </h1>
            )
          )}

          <p className={styles.usernameText}>
            {userData && <strong>@{userData.username}</strong>}
          </p>
          <br />
          <p>
            <strong>Email address: </strong>
            {editMode ? (
              <div>
                <input
                  type="email"
                  value={tempUserData.email}
                  onChange={handleInputChange}
                  name="email"
                  className={`form-control ${errors.email ? "is-invalid" : ""}`}
                  placeholder="Enter email"
                />
                {errors.email && (
                  <div className="alert alert-danger mt-2" role="alert">
                    {errors.email}
                  </div>
                )}
              </div>
            ) : (
              userData && <p>{userData.email}</p>
            )}
          </p>
          <h3>About Me:</h3>
          {editMode ? (
            <textarea
              className={styles.textAreaField}
              value={tempUserData.aboutMe}
              onChange={handleInputChange}
              name="aboutMe"
            />
          ) : (
            userData && <p>{userData.aboutMe}</p>
          )}

          {editMode ? (
            <div className={styles.buttonGroup}>
              <button
                onClick={handleSaveChanges}
                className={`${styles.button} ${styles.buttonPrimary}`}
                type="button"
              >
                Save Changes
              </button>
              <button
                onClick={handleCancel}
                className={`${styles.button} ${styles.buttonSecondary}`}
                type="button"
              >
                Cancel
              </button>
            </div>
          ) : isOwnProfile ? (
            <button
              onClick={() => setEditMode(true)}
              className={`${styles.button} ${styles.buttonPrimary} mt-3`}
            >
              Edit Profile
            </button>
          ) : (
            ""
          )}

          <div className="mt-4">
            {userData && (
              <div className="row text-center">
                <div
                  className="col"
                  onClick={handleShowFollowersModal}
                  style={{ cursor: "pointer" }}
                >
                  <FontAwesomeIcon icon={faUserGroup} />
                  <h4 className="mt-2">Followers</h4>
                  <p>
                    {userData.followersMembers
                      ? userData.followersMembers.length
                      : 0}
                  </p>
                </div>
                <div
                  className="col"
                  onClick={handleShowFollowingModal}
                  style={{ cursor: "pointer" }}
                >
                  <FontAwesomeIcon icon={faUserPlus} />
                  <h4 className="mt-2">Following</h4>
                  <p>
                    {userData.followingMembers
                      ? userData.followingMembers.length
                      : 0}
                  </p>
                </div>

                <FollowListModal
                  show={showFollowersModal}
                  onHide={() => setShowFollowersModal(false)}
                  type="followers"
                  currentUserId={currentUser.memberId}
                  listData={followersList}
                />

                <FollowListModal
                  show={showFollowingModal}
                  onHide={() => setShowFollowingModal(false)}
                  type="following"
                  currentUserId={currentUser.memberId}
                  listData={followingList}
                />

                <div className="col">
                  <FontAwesomeIcon icon={faClipboardList} />
                  <h4 className="mt-2">Posts</h4>
                  <p>{userData.posts ? userData.posts.length : 0}</p>
                </div>
                <div className="col">
                  <FontAwesomeIcon icon={faHeart} />
                  <h4 className="mt-2">Likes Received</h4>
                  <p>{userData.likesReceived ? userData.likesReceived : 0}</p>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="col-md-6 d-flex flex-column align-items-center">
          {userData && (
            <img
              src={userData.profilePictureURL || "/defaultImg.png"}
              alt="Profile"
              className={styles.profileImage}
            />
          )}
          {editMode && <UploadImage onUploadSuccess={handleUploadSuccess} />}
        </div>
      </div>
      <div className={styles.buttonContainer}>
        <button
          className={`${styles.toggleButton} ${
            activeTab === "myPosts" ? styles.active : ""
          }`}
          onClick={() => handleTabChange("myPosts")}
        >
          <div className={styles.iconContainer}>
            <FontAwesomeIcon icon={faClipboardList} size="lg" />
          </div>
          Posts
        </button>
        <button
          className={`${styles.toggleButton} ${
            activeTab === "likedPosts" ? styles.active : ""
          }`}
          onClick={() => handleTabChange("likedPosts")}
        >
          <div className={styles.iconContainer}>
            <FontAwesomeIcon icon={faHeart} size="lg" />
          </div>
          Liked Posts
        </button>
      </div>
      <div className="mt-5">
        <div className="row">
          {currentPosts.map((post, index) => (
            <div key={index} className="col-12 mb-4">
              <Post postDetails={{ ...post, creator: userData }} />
            </div>
          ))}
        </div>

        <nav aria-label="Page navigation">
          <ul className="pagination justify-content-center">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
              (number) => (
                <li
                  key={number}
                  className={`page-item ${
                    currentPage === number ? "active" : ""
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(number)}
                  >
                    {number}
                  </button>
                </li>
              )
            )}
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
    </div>
  );
};

export default Index;
