import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faCheck } from "@fortawesome/free-solid-svg-icons";
import styles from "./FollowButton.module.css";
import axiosClient from "../others/network/axiosClient";
import { useEffect } from "react";

const FollowButton = ({ targetMemberId, followingMembers }) => {
  const [isFollowing, setIsFollowing] = useState(false);
  useEffect(() => {
    if (followingMembers && followingMembers.length > 0) {
      const isAlreadyFollowing = followingMembers.some((member) => {
        return member.memberId.toString() === targetMemberId;
      });

      if (isAlreadyFollowing) {
        setIsFollowing(isAlreadyFollowing);
      } else {
        setIsFollowing(false);
      }
    }
  }, [followingMembers, targetMemberId]);

  const handleFollowClick = async () => {
    try {
      if (isFollowing) {
        await axiosClient.delete(
          `/members/unfollow/${targetMemberId}`,
          {},
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` },
          }
        );
        setIsFollowing(false);
        console.log(`Following member: ${targetMemberId}`);
        window.location.reload();
      } else {
        await axiosClient.post(
          `/members/follow/${targetMemberId}`,
          {},
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` },
          }
        );
        setIsFollowing(true);
        window.location.reload();
      }
    } catch (error) {
      console.error("Error following/unfollowing user:", error);
    }
  };

  return (
    <button
      className={`${styles.followBtn} ${isFollowing ? styles.followed : ""}`}
      onClick={handleFollowClick}
    >
      {isFollowing ? (
        <>
          Following <FontAwesomeIcon icon={faCheck} />
        </>
      ) : (
        <>
          Follow <FontAwesomeIcon icon={faPlus} />
        </>
      )}
    </button>
  );
};

export default FollowButton;
