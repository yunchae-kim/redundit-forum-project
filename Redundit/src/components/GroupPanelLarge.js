/* eslint-disable max-len */
import { Divider, Tag } from "@blueprintjs/core";
import { useEffect, useState } from "react";
import { getGroupById } from "../utility/axiosGroup";
import { getGrouptags } from "../utility/axiosGrouptag";
import { getAllUsersInGroup } from "../utility/axiosUser";
import { getAllPostsInGroup } from "../utility/axiosPost";
import groupIcon from "../test_data/groupIcon.jpg";
import "../style/pages/Global.css";
import "../style/components/GroupPanel.css";
import httpClient from "../utility/auth.helper";
import { getMember, createMember, deleteMember } from "../utility/axiosMember";

const GroupPanel = ({ groupId }) => {
  const [group, setGroup] = useState({});
  const [fetched, setfetched] = useState(false);
  const [grouptags, setGrouptags] = useState([]);
  const [userNum, setUserNum] = useState(0);
  const [postNum, setPostNum] = useState(0);
  const [userId, setUserId] = useState(0);
  const [isJoined, setIsJoined] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [buttonText, setButtonText] = useState("");

  useState(() => {
    setfetched(true);
    getGroupById(groupId).then((groupFetched) => {
      setGroup(groupFetched);
    });
    getGrouptags(groupId).then((grouptagsFetched) => {
      setGrouptags(grouptagsFetched);
    });
    getAllUsersInGroup(groupId).then((usersInGroup) => {
      setUserNum(usersInGroup.length);
    });
    getAllPostsInGroup(groupId).then((postsInGroup) => {
      setPostNum(postsInGroup.length);
    });
  }, [fetched]);

  useEffect(() => {
    const userObj = httpClient.getCurrentUser();
    if (userObj) {
      const { iduser } = userObj;
      if (iduser) {
        setUserId(iduser);
        // member logic
        getMember(groupId, userId).then((memberFetched) => {
          if (memberFetched != null) {
            setIsJoined(true);
            if (memberFetched.pending === 1) {
              setIsPending(true);
            }
            if (memberFetched.admin === 1) {
              setIsAdmin(true);
            }
          }
        });
      }
    }
  }, [userId]);

  useEffect(() => {
    if (isJoined) {
      if (isAdmin) {
        setButtonText("Admin");
      } else if (isPending) {
        setButtonText("Pending");
      } else {
        setButtonText("Joined");
      }
    } else {
      setButtonText("Join");
    }
  }, [isJoined, isAdmin, isPending]);

  const hashTagsList = grouptags.map((h) => <Tag className="GP-tag" key={h.tag}>{h.tag}</Tag>);

  const unJoin = () => {
    if (isJoined && !isAdmin) {
      deleteMember(groupId, userId).then(() => {
        setIsJoined(!isJoined);
        setIsPending(false);
      });
    } else if (!isJoined) {
      createMember(groupId, userId, false, true).then(() => {
        setIsJoined(!isJoined);
        setIsPending(true);
      });
    }
  };
  // ERASE THIS
  return (
    <div className="GroupPanel-large">
      <div className="GP-header">
        <img className="GP-groupIcon" src={groupIcon} alt="" />
        <div className="GP-title">{group.name}</div>
        {userId !== 0 && (
        <button type="submit" className={isJoined ? "GP-btn-joined" : "GP-btn-join"} intent="primary" onClick={unJoin}>
          {buttonText}
          {" "}
        </button>
        )}
      </div>
      <div className="GP-hashTags-large">
        {hashTagsList}
      </div>
      <div className="GP-description">
        {group.description}
      </div>
      <hr className="GP-horizontal-divider" />
      <div className="GP-footer">
        <span>
          {userNum}
          {" "}
          Members
        </span>
        <Divider />
        <span>
          {postNum}
          {" "}
          Posts
        </span>
      </div>
    </div>
  );
};

export default GroupPanel;
