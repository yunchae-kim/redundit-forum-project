/* eslint-disable no-nested-ternary */
/* eslint-disable max-len */
import { Divider, Tag } from "@blueprintjs/core";
import { Link, useHistory } from "react-router-dom";
import { useEffect, useState } from "react";
import { getMember, createMember, deleteMember } from "../utility/axiosMember";
import { getGroupById } from "../utility/axiosGroup";
import { getGrouptags } from "../utility/axiosGrouptag";
import { getAllUsersInGroup } from "../utility/axiosUser";
import { getAllPostsInGroup } from "../utility/axiosPost";
import groupIcon from "../test_data/groupIcon.jpg";
import "../style/components/GroupPanel.css";
import httpClient from "../utility/auth.helper";
import { addNotification } from "../utility/axiosNotification";

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
  const history = useHistory();

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
        history.push("/");
        history.go();
      });
    } else if (!isJoined) {
      createMember(groupId, userId, false, true).then(() => {
        setIsJoined(!isJoined);
        setIsPending(true);
        addNotification(group.creator, `Someone requested to join ${group.name}`).then(()=>{
          history.push({ pathname: `/group/${groupId}`, state: { groupId } });
          history.go();
        });
      });
    }
  };
  return (
    <div className="GroupPanel GroupPanel-small">
      <div className="GP-header">
        <img className="GP-groupIcon" src={groupIcon} alt="" />
        <Link to={{ pathname: `/group/${group.idgroup}`, state: { groupId } }} className="GP-title"><div className="GP-title">{group.name}</div></Link>
        {userId !== 0 && (
        <button type="submit" className={isJoined ? "GP-btn-joined" : "GP-btn-join"} intent="primary" onClick={unJoin}>
          {buttonText}
          {" "}
        </button>
        )}
      </div>
      <div className="GP-hashTags">
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
