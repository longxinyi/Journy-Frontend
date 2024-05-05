import React from "react";
import Modal from "react-bootstrap/Modal";
import { useRouter } from "next/router";

const FollowListModal = ({ show, onHide, type, currentUserId, listData }) => {
  const router = useRouter();
  const redirectToUserProfile = (memberId) => {
    onHide();
    router.push(`/Profile/${memberId}`);
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>
          {type === "followers" ? "Followers" : "Following"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {listData.map((member) => (
          <div
            key={member.memberId}
            className="d-flex justify-content-between align-items-center p-2"
          >
            <div
              style={{ cursor: "pointer" }}
              onClick={() => redirectToUserProfile(member.memberId)}
            >
              <img
                src={member.profilePictureURL || "/defaultImg.png"}
                alt="Profile Image"
                width={40}
                height={40}
                className="rounded-circle me-2"
              />
              <strong>{member.username}</strong>
            </div>
            {member.memberId === currentUserId && "Me"}
          </div>
        ))}
      </Modal.Body>
    </Modal>
  );
};

export default FollowListModal;
