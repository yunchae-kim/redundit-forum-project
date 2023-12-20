import S3FileUpload from "react-s3";
import { useState } from "react";
import "../style/components/s3upload.css";

const UploadMedia = ({ setPopup, fileType, onClick }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileLocation, setFileLocation] = useState(null);
  const [, setMediaData] = useState({
    fileType: "", url: "",
  });
  // eslint-disable-next-line no-unused-vars
  const config = {
    bucketName: "redundit",
    region: "us-east-2",
    accessKeyId: "AKIA2ARK6DQQI4MO3MWM",
    secretAccessKey: "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",
  };
  const upload = () => {
    S3FileUpload.uploadFile(selectedFile, config)
      .then((data) => {
        setFileLocation(data.location);
        setMediaData(fileType, fileLocation);
      })
      .catch(() => {
        // eslint-disable-next-line no-alert
        alert("Error upload media");
      });
  };

  const updateToParent = () => {
    setPopup(false);
    onClick(fileType, fileLocation);
  };

  return (
    <div className="s3">
      <button className="s3-x" type="submit" onClick={updateToParent}>X</button>
      <div className="s3-form">
        <h3>upload your file</h3>
        <input
          type="file"
          onChange={(e) => setSelectedFile(e.target.files[0])}
          className="s3-input"
        />
        <button type="submit" onClick={upload}>submit</button>
      </div>
      <div className="s3-test">
        {
          (() => {
            if (fileType === "image") {
              return (<img src={fileLocation} alt="" className="s3-image" />);
            }
            if (fileType === "audio") {
              return (
                <audio controls src={fileLocation}>
                  Your browser does not support the audio element.
                  <track src="" kind="captions" srcLang="en" label="english_captions" />
                </audio>
              );
            }
            if (fileType === "video") {
              return (
                <video controls src={fileLocation}>
                  Your browser does not support the video element.
                  <track src="" kind="captions" srcLang="en" label="english_captions" />
                </video>
              );
            }
            return (<div />);
          })()
        }
      </div>
    </div>
  );
};

export default UploadMedia;
