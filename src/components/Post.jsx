import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faDollarSign } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/router";
import axiosClient from "../others/network/axiosClient";

const Post = ({ postDetails }) => {
  const router = useRouter();
  const {
    postId = "",
    title = "Title goes here",
    description = "Description goes here",
    budget = 99,
    locations = [],
    likeCount = 10,
    comments = [],
  } = postDetails;
  const [isLikedClicked, setIsLikedClicked] = useState(false);
  const [postLikeCount, setPostLikeCount] = useState(likeCount);

  const handleClick = async () => {
    try {
      const endpoint = isLikedClicked
        ? `/posts/${postId}/unlike`
        : `/posts/${postId}/like`;

      if (isLikedClicked) {
        await axiosClient.delete(endpoint);
        setPostLikeCount(postLikeCount - 1);
      } else {
        await axiosClient.post(endpoint);
        setPostLikeCount(postLikeCount + 1);
      }

      setIsLikedClicked(!isLikedClicked);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const [expandedComments, setExpandedComments] = useState(false);
  const [expandedCommentIndex, setExpandedCommentIndex] = useState(-1);
  const MAX_COMMENTS_SHOWN = 3;

  console.log(postDetails.creator);

  const redirectToCreatorProfile = () => {
    if (postDetails.creator && postDetails.creator.memberId) {
      router.push(`/Profile/${postDetails.creator.memberId}`);
    } else {
      console.error("Creator data is missing or incomplete");
    }
  };

  // Fake post details
  const postImageUrl = "/paris.jpg";

  const formattedComments = comments
    ? comments.map((comment) => ({
        username: comment.commenter.username,
        text: comment.commentDetails,
      }))
    : [];

  const toggleExpandComment = (index) => {
    setExpandedCommentIndex(index === expandedCommentIndex ? -1 : index);
  };

  return (
    <>
      <link
        rel="stylesheet"
        href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css"
        integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm"
        crossOrigin="anonymous"
      />
      <br />
      <br />
      <div
        className="card mx-auto shadow mw-90"
        style={{
          maxWidth: "720px",
          borderRadius: "15px",
          backgroundColor: "#f8f0ca",
          marginBottom: "20px",
          border: "none",
        }}
      >
        <div
          onClick={redirectToCreatorProfile}
          style={{ cursor: "pointer" }}
          className="card-header d-flex align-items-center mw-90"
        >
          <img
            src={
              postDetails &&
              postDetails.creator &&
              postDetails.creator.profilePictureURL
                ? postDetails.creator.profilePictureURL
                : "/defaultImg.png"
            }
            className="rounded-circle mr-2"
            alt="User"
            style={{ width: "40px", height: "40px", objectFit: "cover" }}
          />
          <div>
            <h6 className="mb-0" style={{ color: "#141451" }}>
              {postDetails && postDetails.creator
                ? postDetails.creator.username
                : ""}
            </h6>
            {locations.map((location) => {
              return <small className="text-muted">{location}, </small>;
            })}
          </div>
        </div>

        <div
          style={{
            width: "100%",
            height: "720px",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <img
            src={postImageUrl}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              objectPosition: "center",
              backgroundColor: "#196f5d",
              border: "2px dotted #94746c",
            }}
            alt={title}
          />
        </div>
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h5 className="card-title" style={{ color: "#141451" }}>
                {title}
              </h5>
              <p className="card-text">{description}</p>
            </div>
            <div className="heart-icon" onClick={handleClick}>
              <FontAwesomeIcon
                icon={faHeart}
                className={
                  isLikedClicked ? "text-danger mr-2" : "text-muted mr-2"
                }
              />
            </div>
          </div>
          <div>
            <FontAwesomeIcon icon={faDollarSign} className="mr-1" />
            <FontAwesomeIcon icon={faDollarSign} className="mr-1" />
            <span>Budget: {budget}</span>
          </div>
          <div>
            <FontAwesomeIcon icon={faHeart} className="mr-1" />
            {postLikeCount} likes
          </div>
        </div>
        <div className="card-footer">
          <div className="post-comments">
            {formattedComments
              .slice(0, MAX_COMMENTS_SHOWN)
              .map((comment, index) => (
                <div key={index} className="post-comment">
                  <strong>{comment.username}</strong>:{" "}
                  {expandedCommentIndex === index
                    ? comment.text
                    : comment.text.length > 50
                    ? `${comment.text.substring(0, 50)}...`
                    : comment.text}
                  {comment.text.length > 50 && (
                    <button
                      className="btn btn-link p-0"
                      onClick={() => toggleExpandComment(index)}
                    >
                      {expandedCommentIndex === index
                        ? "View Less"
                        : "View More"}
                    </button>
                  )}
                </div>
              ))}
            <div className="d-flex justify-content-center">
              <button
                className="btn btn-link"
                style={{ color: "#141451" }}
                onClick={() => router.push(`/Post/${postId}`)}
              >
                View Post Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Post;
