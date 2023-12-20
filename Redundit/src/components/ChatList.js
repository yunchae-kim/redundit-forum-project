import { useState, useEffect } from "react";
import { getAllChatgroups } from "../utility/axiosChatMessage";
import "../style/components/ChatList.css";
import "../style/pages/Global.css";

const ChatList = ({ userId, setActiveChat }) => {
  const [chatGroup, setChatGroup] = useState([]);

  const [isFolded] = useState(true);

  useEffect(async () => {
    const res = await getAllChatgroups(userId);
    setChatGroup(res.data);
  }, [userId]);

  const clickHandler = (event) => {
    const chatID = event.target.value;
    setActiveChat(chatID);
  };

  return (
    <div className={isFolded ? "global-right-list" : "global-right-list"}>
      <div className="CL-header">
        <div className="CL-title">ChatList</div>
      </div>
      <hr className="CL-hr" />
      {chatGroup && chatGroup.length > 0
        && chatGroup.map((group) => (
          <div key={group.idchat}>
            <div className="CL-entry">
              <button type="submit" className="CL-entry-name" value={group.idchat} onClick={clickHandler}>
                {group.name}
              </button>
            </div>
            <hr className="CL-hr" />
          </div>
        ))}
    </div>
  );
};

export default ChatList;
