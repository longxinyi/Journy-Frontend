import React, { useState, useEffect } from "react";

const UploadImage = ({ onUploadSuccess }) => {
  const [profileImageUrl, setProfileImageUrl] = useState("");
  const [widget, setWidget] = useState(null);

  useEffect(() => {
    const loadScriptAndInitializeWidget = () => {
      if (!window.cloudinary) {
        const script = document.createElement("script");
        script.src = "https://widget.cloudinary.com/v2.0/global/all.js";
        script.async = true;
        script.onload = () => initializeWidget();
        document.body.appendChild(script);
      } else {
        initializeWidget();
      }
    };

    const initializeWidget = () => {
      const myWidget = window.cloudinary.createUploadWidget(
        {
          cloudName: "dfvagzrna",
          uploadPreset: "mrvy5y2r",
          cropping: true,
          croppingAspectRatio: 1,
          clientAllowedFormats: ["png", "jpeg", "jpg"],
          theme: "white",
        },
        (error, result) => {
          if (result.event === "success") {
            onUploadSuccess(result.info.secure_url);
          }
        }
      );
      setWidget(myWidget);
    };

    loadScriptAndInitializeWidget();
  }, []);

  const handleUploadClick = () => {
    if (widget) {
      widget.open();
    } else {
      console.error("The Cloudinary widget is not initialized yet.");
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      {profileImageUrl && (
        <img
          src={profileImageUrl}
          alt="Profile"
          style={{
            width: "350px",
            height: "350px",
            borderRadius: "50%",
            objectFit: "cover",
            marginBottom: "10px",
          }}
        />
      )}
      <button
        onClick={handleUploadClick}
        style={{
          backgroundColor: "#007bff",
          color: "white",
          padding: "10px 15px",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          marginTop: "10px",
        }}
      >
        Upload Image
      </button>
    </div>
  );
};

export default UploadImage;
