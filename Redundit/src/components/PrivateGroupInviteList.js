/* eslint-disable no-nested-ternary */
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import groupIcon from "../test_data/groupIcon.jpg";
import { getAllNonUsersInGroup } from "../utility/axiosUser";
import { createMember } from "../utility/axiosMember";
import "../style/components/MemberList.css";
import { addNotification } from "../utility/axiosNotification";

const PrivateGroupInviteList = ({ groupId, groupName }) => {
  const [nonMembers, setNonMembers] = useState([]);

  useEffect(() => {
    getAllNonUsersInGroup(groupId).then((nonMembersFetched) => {
      setNonMembers(nonMembersFetched);
    });
  }, [nonMembers]);

  const invite = (userId) => {
    createMember(groupId, userId, false, true).then(() => {
      addNotification(userId, `You are invited to join ${groupName}`);
      setNonMembers([]);
    });
  };

  const foldedNonMembers = nonMembers.slice(0, 8).map((m) => (
    <div key={m.iduser}>
      <div className="ML-entry">
        <img className="ML-userIcon" src={groupIcon} alt="" />
        <Link to={{ pathname: `/user/${m.iduser}`, state: { userId: m.iduser } }} className="ML-entry-name" key={m.iduser}><span>{m.username}</span></Link>
        <button type="button" onClick={() => invite(m.iduser)}>Invite</button>
      </div>
      <hr className="ML-hr" />
    </div>
  ));

  const expandedNonMembers = nonMembers.map((m) => (
    <div key={m.iduser}>
      <div className="ML-entry">
        <img className="ML-userIcon" src={groupIcon} alt="" />
        <Link to={{ pathname: `/user/${m.iduser}`, state: { userId: m.iduser } }} className="ML-entry-name" key={m.iduser}><span>{m.username}</span></Link>
        <button type="button" onClick={() => invite(m.iduser)}>Invite</button>
      </div>
      <hr className="ML-hr" />
    </div>
  ));

  const [isFoldedNonMem, setIsFoldedNonMem] = useState(true);
  const unfoldNonMem = () => {
    setIsFoldedNonMem(false);
  };

  return (
    <div className="ML-manage">
      <div className={isFoldedNonMem ? "MemberList" : "MemberList-expand"}>
        <div className="ML-header">
          <div className="ML-title">Invite Users</div>
        </div>
        <hr className="ML-hr" />
        {isFoldedNonMem ? foldedNonMembers : expandedNonMembers}
        {isFoldedNonMem && nonMembers.length > 8 && <div className="ML-btn-entry"><button type="submit" onClick={unfoldNonMem} className="ML-btn">View More </button></div>}
      </div>

    </div>
  );
};

export default PrivateGroupInviteList;
