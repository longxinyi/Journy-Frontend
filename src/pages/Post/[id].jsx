import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import axiosClient from "../../others/network/axiosClient";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faComment,
  faCircleChevronRight,
} from "@fortawesome/free-solid-svg-icons";

const KMLDisplay = dynamic(
  () => import("../../components/KMLHandlers/KMLDisplay"),
  { ssr: false }
);

const PostDetails = () => {
  const router = useRouter();
  const { id } = router.query;
  const [currentKML, setCurrentKML] = useState();
  const [postDetails, setPostDetails] = useState();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [username, setUsername] = useState();

  useEffect(() => {
    getCurrentPost();
    getCurrentUser();
  }, []);

  const getCurrentPost = async () => {
    try {
      await axiosClient.get(`/posts/${id}`).then((res) => {
        setPostDetails(res.data);
        setComments(res.data.comments);
        getCurrentKMLFile(res.data.postId);
      });
    } catch (e) {
      console.error(e);
    }
  };

  const getCurrentUser = async () => {
    try {
      await axiosClient.get(`/members/my-profile`).then((res) => {
        setUsername(res.data.username);
      });
    } catch (e) {
      console.error(e);
    }
  };

  const getCurrentKMLFile = async (postId) => {
    try {
      await axiosClient.get(`/posts/${postId}/kml-file`).then((res) => {
        setCurrentKML(res.data);
      });
    } catch (e) {
      console.error(e);
    }
  };

  const onSendNewComment = async () => {
    const newCommentObject = {
      commentDetails: newComment,
      commenter: { username: username },
    };
    setNewComment("");
    setComments([...comments, newCommentObject]);
    try {
      await axiosClient.post(`/posts/${id}/comments`, {
        commentDetails: newComment,
      });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div>
      {postDetails ? (
        <div className="tw-flex tw-flex-col tw-gap-3 tw-p-10 tw-w-full tw-h-full tw-bg-blue tw-text-white">
          <div className="tw-flex tw-flex-row tw-justify-evenly tw-items-center tw-bg-beige tw-text-blue tw-rounded-xl tw-p-10">
            {currentKML && <KMLDisplay kmlFile={currentKML} />}
            <div className="tw-flex tw-flex-col">
              <img
                src={
                  postDetails?.creator?.profilePictureURL || "/defaultImg.png"
                }
                alt="Profile"
                className="profile-pic"
                style={{ width: "150px", height: "0px", objectFit: "cover" }}
              />
              <p>{postDetails.creator.username}</p>
              <p>{postDetails.creator.aboutMe}</p>
              <button
                className="tw-bg-green tw-text-beige tw-p-2 tw-rounded-xl tw-font-bold tw-border-0"
                onClick={() => router.push(`/Planning/${id}`)}
              >
                Fork this itinerary
              </button>
            </div>
          </div>
          <div>
            <h5
              className="card-title tw-font-bold"
              style={{ color: "#141451" }}
            >
              {postDetails.title}
            </h5>
            <p className="card-text tw-font-bold">{postDetails.description}</p>
            <div className="tw-border-beige tw-border-solid tw-border-2 tw-flex tw-flex-col tw-p-3 tw-min-h-fit tw-rounded-xl">
              <h6 className="tw-text-beige tw-flex tw-flex-row tw-gap-2 tw-items-center">
                <FontAwesomeIcon icon={faComment} className="mr-2" />
                Comments
              </h6>
              {comments.length > 0 ? (
                comments.map((comment, index) => (
                  <div key={index} className="tw-flex tw-flex-row mb-2 tw-pl-5">
                    <strong className="tw-mr-2">
                      {comment.commenter.username}:
                    </strong>
                    <p>{comment.commentDetails}</p>
                  </div>
                ))
              ) : (
                <b className="tw-text-beige tw-font-bold tw-ml-10 tw-pl-5">
                  No Comments Yet...
                </b>
              )}
              <div className="tw-flex tw-flex-row tw-gap-5 tw-mt-10">
                <input
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment!"
                  className="tw-w-3/4 tw-h-10 tw-rounded-xl tw-p-2"
                />
                {newComment && (
                  <button
                    onClick={onSendNewComment}
                    className="tw-flex tw-flex-row tw-gap-2 tw-items-center tw-text-beige tw-bg-green tw-font-bold tw-rounded-full tw-p-2"
                  >
                    Send
                    <FontAwesomeIcon icon={faCircleChevronRight} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default PostDetails;
