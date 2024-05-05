import dynamic from "next/dynamic";
import axiosClient from "../../others/network/axiosClient";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

const KMLEditor = dynamic(
  () => import("../../components/KMLHandlers/KMLEditor"),
  { ssr: false }
);

const CreateNewPost = () => {
  const router = useRouter();
  const { id } = router.query;
  const [currentKML, setCurrentKML] = useState();
  const [showError, setShowError] = useState(false);

  const onChangeFields = (field) => (e) => {
    if (field === "budget") {
      setFormDetails({
        ...formDetails,
        [field]: Number(e.target.value),
      });
    } else {
      setFormDetails({
        ...formDetails,
        [field]: e.target.value,
      });
    }
  };

  const [formDetails, setFormDetails] = useState({
    postPictureURL: "",
    title: "",
    description: "",
    budget: 0,
    locations: [],
  });
  const [file, setFile] = useState();

  const handlePublishPost = async () => {
    if (!file) {
      setShowError(true);
      return;
    }
    try {
      await axiosClient.post("/posts", formDetails).then((res) => {
        handlePostKMLFile(res.data.postId);
      });
      router.push("/Discover");
    } catch (e) {
      console.error(e);
    }
  };

  const handlePostKMLFile = async (postId) => {
    const token = localStorage.getItem("jwt");
    try {
      await axiosClient.post(
        `/posts/${postId}/kml-file`,
        { file: file },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      router.push("/Discover");
    } catch (e) {
      console.error(e);
    }
  };

  const onChangeKML = (kmlfile) => {
    setFile(kmlfile);
  };

  return (
    <div className="tw-flex tw-flex-col tw-gap-3 tw-p-10 tw-w-full tw-h-full tw-bg-blue tw-text-white">
      <KMLEditor onChangeKML={onChangeKML} initialPostId={id} />
      <div>
        <div className="form-container">
          <b className="tw-text-black">Give Your Post a Title</b>
          <input
            type="text"
            aria-label="Title"
            placeholder="Title"
            className="form-control mb-3"
            onChange={onChangeFields("title")}
            value={formDetails.title}
          />
          <b className="tw-text-black">Tell us more about your itinerary</b>
          <textarea
            className="form-control mb-3"
            aria-label="Description"
            placeholder="Description"
            onChange={onChangeFields("description")}
            value={formDetails.description}
          />

          <b className="tw-text-black">Give an approx. budget</b>
          <input
            type="number"
            min={1}
            className="form-control mb-3"
            onChange={onChangeFields("budget")}
            value={formDetails.budget}
          />

          {showError && (
            <b className="alert-danger mb-3" role="alert">
              Save Map Before Proceeding!
            </b>
          )}
          <button
            className="btn-primary rounded-pill publish-button"
            onClick={handlePublishPost}
          >
            Publish Post
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateNewPost;
