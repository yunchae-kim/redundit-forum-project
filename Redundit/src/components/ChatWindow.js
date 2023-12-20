import { useState, useEffect } from "react";
import { Button, InputGroup } from "@blueprintjs/core";
import { Link } from "react-router-dom";
import { getAllMessageInChat, addMessageToChat, addUserToChat } from "../utility/axiosChatMessage";
import sendIcon from "../resources/sendIcon.png";
import playIcon from "../resources/playIcon.png";
import headphoneIcon from "../resources/headphoneIcon.png";
import imageIcon from "../resources/imageIcon.png";
import UploadMedia from "./UploadMedia";

import "../style/components/ChatWindow.css";
import { getUserByName } from "../utility/axiosUser";
import { getGroupsByUser } from "../utility/axiosGroup";

const ChatWindow = ({ userId, chatID }) => {
  const [chatMessages, setMessage] = useState([]);
  const [content, setContent] = useState("");
  const [popup, setPopup] = useState(false);
  const [fileType, setFileType] = useState("");
  const [imageUrl, setImageUrl] = useState();
  const [audioUrl, setAudioUrl] = useState();
  const [videoUrl, setVideoUrl] = useState();
  const [userName, setUserName] = useState("");
  const [myGroupList, setMyGroupList] = useState([]);

  useEffect(async () => {
    const { data } = await getAllMessageInChat(chatID);
    setMessage(data);
  }, [chatID]);

  useEffect(() => {
    getGroupsByUser(userId).then((result) => {
      setMyGroupList(result.map((m) => (m.idgroup)));
    });
  }, []);

  const handleInputChange = (event) => {
    setContent(event.target.value);
  };

  const submitMessage = async () => {
    await addMessageToChat(chatID, userId, content, imageUrl, audioUrl, videoUrl);
    setContent("");
    setFileType("");
    setAudioUrl();
    setVideoUrl();
    setImageUrl();
    const { data } = await getAllMessageInChat(chatID);
    setMessage(data);
  };

  async function handlePress(event) {
    if (event.key === "Enter" && content) {
      submitMessage(chatID, userId, content);
      setContent("");
      const { data } = await getAllMessageInChat(chatID);
      setMessage(data);
    }
  }

  const uploadFiles = (typeOfFile, url) => {
    if (typeOfFile === "image") {
      setImageUrl(url);
    } else if (typeOfFile === "audio") {
      setAudioUrl(url);
    } else if (typeOfFile === "video") {
      setVideoUrl(url);
    }
  };

  const invite = () => {
    getUserByName(userName).then((result) => {
      if (result !== null) {
        getGroupsByUser(result.iduser).then((groupsOfThatUser) => {
          const intersect = groupsOfThatUser.filter((m) => myGroupList.includes(m.idgroup));
          if (intersect.length > 0) {
            addUserToChat(chatID, result.iduser).then(() => {
              setUserName("Successfull");
            });
          } else {
            setUserName("No Common Group!");
          }
        });
      } else {
        setUserName("User Not Found");
      }
    });
  };

  return (
    <>
      <div>
        <InputGroup
          value={userName}
          id="NP-titleInputGroup"
          placeholder="Invite user to join"
          large="true"
          type="text"
          onChange={(e) => setUserName(e.target.value)}
        />
        <Button
          id="NP-postBtn"
          text="Invite"
          onClick={() => invite()}
        />
      </div>
      <div className="ChatWindow">
        {popup && <UploadMedia setPopup={setPopup} fileType={fileType} onClick={uploadFiles} />}

        <div className="CW-content">
          <div className="CW-scrollbox">
            {chatMessages && chatMessages.length >= 0
            && chatMessages.map((message) => (
              <div className="CW-chatentry" key={message.timestamp}>
                <div className="CW-chatentry-header">
                  <Link to={`/user/${message.idsender}`}><span className="CW-chatentry-name">{message.username}</span></Link>
                  <span className="CW-chatentry-time">
                    {(message.timestamp).slice(0, 19).replace("T", " ")}
                  </span>
                </div>
                <div className="Post-img-div">
                  {message.image == null ? <></> : <img src={message.image} alt="" className="Post-img" />}
                  {message.audio == null ? <></> : (
                    <audio controls src={message.audio}>
                      Your browser does not support the audio element.
                      <track src="" kind="captions" srcLang="en" label="english_captions" />
                    </audio>
                  )}
                  {message.video == null ? <></> : (
                    <video controls src={message.video}>
                      Your browser does not support the video element.
                      <track src="" kind="captions" srcLang="en" label="english_captions" />
                    </video>
                  )}
                </div>
                <div className="CW-chatentry-content">{message.content}</div>
              </div>
            ))}
          </div>
          <div className="CW-buttons">
            <button type="submit" className="NP-button" onClick={() => { setPopup(true); setFileType("image"); }}><img src={imageIcon} alt="Submit" className="NP-button-icon" /></button>
            <button type="submit" className="NP-button" onClick={() => { setPopup(true); setFileType("audio"); }}><img src={headphoneIcon} alt="Submit" className="NP-button-icon" /></button>
            <button type="submit" className="NP-button" onClick={() => { setPopup(true); setFileType("video"); }}><img src={playIcon} alt="Submit" className="NP-button-icon" /></button>
          </div>
          <div className="CW-form">
            <input
              className="CW-input"
              required
              type="text"
              name="message"
              placeholder="Type a message"
              onChange={handleInputChange}
              value={content}
              onKeyPress={handlePress}
            />
            <button type="submit" className="CW-send" onClick={submitMessage}><img src={sendIcon} alt="Submit" className="CW-send-icon" /></button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatWindow;
