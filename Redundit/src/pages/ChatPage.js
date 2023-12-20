import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Button, InputGroup } from "@blueprintjs/core";
import ChatWindow from "../components/ChatWindow";
import ChatList from "../components/ChatList";
import NavBar from "../components/NavBar";
import httpClient from "../utility/auth.helper";
import "../style/pages/ChatPage.css";
import { addUserToChat, createChat } from "../utility/axiosChatMessage";

const ChatPage = () => {
  const history = useHistory();
  const [userId, setUserId] = useState(0);
  const [chatID, setChatID] = useState(0);
  const [chatName, setChatName] = useState("");

  const setActiveChat = (idChat) => {
    setChatID(idChat);
  };

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
  }, [userId, chatID]);

  const startChat = () => {
    createChat(userId, chatName, false).then((newChat) => {
      setChatName("");
      addUserToChat(newChat, userId);
      setChatID(newChat);
    });
  };

  return (
    <div className="ChatPage">
      <NavBar />
      <div>
        <InputGroup
          value={chatName}
          id="NP-titleInputGroup"
          placeholder="Chat group name"
          large="true"
          type="text"
          onChange={(e) => setChatName(e.target.value)}
        />
        <Button
          id="NP-postBtn"
          text="Start"
          onClick={() => startChat()}
        />
      </div>
      <div>
        <div className="CP-chatwindow">
          {chatID !== 0 && <ChatWindow userId={userId} chatID={chatID} />}
        </div>
      </div>
      <div>
        <ChatList userId={userId} setActiveChat={setActiveChat} />
      </div>
    </div>
  );
};

export default ChatPage;
