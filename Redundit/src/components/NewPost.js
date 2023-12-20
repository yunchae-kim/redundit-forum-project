/* eslint-disable no-param-reassign */
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import {
  Button, InputGroup, EditableText,
} from "@blueprintjs/core";
import playIcon from "../resources/playIcon.png";
import headphoneIcon from "../resources/headphoneIcon.png";
import imageIcon from "../resources/imageIcon.png";
import "../style/components/NewPost.css";
import UploadMedia from "./UploadMedia";
import { createPost } from "../utility/axiosPost";
import httpClient from "../utility/auth.helper";
import { addHashtag } from "../utility/axiosHashtags";

const NewPost = ({ groupId }) => {
  const history = useHistory();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState([]);
  const [popup, setPopup] = useState(false);
  const [fileType, setFileType] = useState("");
  const [imageUrl, setImageUrl] = useState();
  const [audioUrl, setAudioUrl] = useState();
  const [videoUrl, setVideoUrl] = useState();
  const [userId, setUserId] = useState(0);

  useEffect(() => {
    const userObj = httpClient.getCurrentUser();
    if (userObj) {
      const { iduser } = userObj;
      if (iduser) {
        setUserId(iduser);
      }
    } else {
      history.push("/");
    }
  }, [userId]);

  const addTags = (event) => {
    if (event.key === "Enter" && event.target.value !== "") {
      if (!tags.includes(event.target.value)) {
        setTags([...tags, event.target.value]);
      }
      event.target.value = "";
    }
  };

  const removeTag = (targetTag) => {
    setTags([...tags.filter((tag) => tag !== targetTag)]);
  };

  const uploadFiles = (typeOfFile, url) => {
    if (typeOfFile === "image") {
      setImageUrl(url);
    } else if (typeOfFile === "audio") {
      setAudioUrl(url);
    } else if (typeOfFile === "video") {
      setVideoUrl(url);
    }
  };

  const submitPost = () => {
    const postToBeSubmit = {
      iduser: userId,
      idgroup: groupId,
      title,
      content,
      status: false,
      flagged: false,
      image: imageUrl,
      audio: audioUrl,
      video: videoUrl,
    };
    createPost(postToBeSubmit).then((postId) => {
      addHashtag(tags, postId, "post").then(() => {
        history.push(`/post/${postId}`, { postId });
      });
    });
  };

  return (
    <div className="NewPost">
      {popup && <UploadMedia setPopup={setPopup} fileType={fileType} onClick={uploadFiles} />}
      <div id="NP-titleInput">
        <InputGroup
          id="NP-titleInputGroup"
          placeholder="Title"
          large="true"
          type="text"
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div id="NP-textInputDiv">
        <div className="NP-buttons">
          <button type="submit" className="NP-button" onClick={() => { setPopup(true); setFileType("image"); }}><img src={imageIcon} alt="Submit" className="NP-button-icon" /></button>
          <button type="submit" className="NP-button" onClick={() => { setPopup(true); setFileType("audio"); }}><img src={headphoneIcon} alt="Submit" className="NP-button-icon" /></button>
          <button type="submit" className="NP-button" onClick={() => { setPopup(true); setFileType("video"); }}><img src={playIcon} alt="Submit" className="NP-button-icon" /></button>
        </div>
        <EditableText
          id="NP-textInputBox"
          maxLines={12}
          minLines={12}
          multiline
          placeholder="Text (optional)"
          onChange={(val) => setContent(val)}
        />
      </div>
      <div id="NP-tagInput">
        <ul id="NP-tags">
          {tags.map((tag) => (
            <li key={tag} className="tag">
              <span className="NP-tagTitle">
                {" "}
                {tag}
                {" "}
              </span>
              <Button
                className="NP-tagCloseIcon"
                icon="cross"
                minimal
                onClick={() => removeTag(tag)}
              />
            </li>
          ))}
        </ul>
        <input
          type="text"
          onKeyUp={(event) => addTags(event)}
          placeholder="Enter to add hashtags"
        />
      </div>
      <div className="NP-postBtnDiv">
        {title === "" ? <></> : (
          <Button
            id="NP-postBtn"
            text="Post"
            onClick={() => submitPost()}
          />
        )}
      </div>
    </div>
  );
};
export default NewPost;
