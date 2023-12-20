/* eslint-disable no-nested-ternary */
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import groupIcon from "../test_data/groupIcon.jpg";
import { getAllUsersInGroup, getAllNonUsersInGroup } from "../utility/axiosUser";
import { createMember, deleteMember, putMember } from "../utility/axiosMember";
import "../style/components/MemberList.css";

const ManageMemberList = ({ groupId, creatorid }) => {
  const [members, setMembers] = useState([]);
  const [nonMembers, setNonMembers] = useState([]);

  useEffect(() => {
    getAllUsersInGroup(groupId).then((membersFetched) => {
      setMembers(membersFetched.filter((m) => m.pending === 0));
    });
    getAllNonUsersInGroup(groupId).then((nonMembersFetched) => {
      setNonMembers(nonMembersFetched);
    });
  }, [members]);

  const invite = (userId) => {
    createMember(groupId, userId, false, false).then(() => {
      setMembers([]);
    });
  };

  const removeFromGroup = (userId) => {
    deleteMember(groupId, userId).then(() => {
      setMembers([]);
    });
  };

  const removeFromAdmin = (userId) => {
    putMember(userId, groupId, false, false).then(() => {
      setMembers([]);
    });
  };

  const upgradeToAdmin = (userId) => {
    putMember(userId, groupId, false, true).then(() => {
      setMembers([]);
    });
  };

  const foldedMembers = members.slice(0, 8).map((m) => (
    <div key={m.iduser}>
      <div className="ML-entry">
        <img className="ML-userIcon" src={groupIcon} alt="" />
        <Link to={{ pathname: `/user/${m.iduser}`, state: { userId: m.iduser } }} className="ML-entry-name" key={m.iduser}><span>{m.username}</span></Link>
        {(m.iduser === creatorid) ? (<span className="ML-entry-admin">Creator</span>) : (m.admin === 1 ? (
          <>
            <span className="ML-entry-admin">Administrator</span>
            <button type="button" onClick={() => removeFromAdmin(m.iduser)}>Remove from admin</button>
          </>
        ) : (
          <>
            <button type="button" onClick={() => upgradeToAdmin(m.iduser)}>Upgrade to admin</button>
            <button type="button" onClick={() => removeFromGroup(m.iduser)}>Remove from group</button>
          </>
        ))}
      </div>
      <hr className="ML-hr" />
    </div>
  ));

  const expandedMembers = members.map((m) => (
    <div key={m.iduser}>
      <div className="ML-entry">
        <img className="ML-userIcon" src={groupIcon} alt="" />
        <Link to={{ pathname: `/user/${m.iduser}`, state: { userId: m.iduser } }} className="ML-entry-name" key={m.iduser}><span>{m.username}</span></Link>
        {m.admin === 1 ? (
          <>
            <span className="ML-entry-admin">Administrator</span>
            <button type="button" onClick={() => removeFromAdmin(m.iduser)}>Remove from admin</button>
          </>
        ) : (
          <>
            <button type="button" onClick={() => upgradeToAdmin(m.iduser)}>Upgrade to admin</button>
            <button type="button" onClick={() => removeFromGroup(m.iduser)}>Remove from group</button>
          </>
        )}
      </div>
      <hr className="ML-hr" />
    </div>
  ));

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

  const [isFolded, setIsFolded] = useState(true);
  const unfold = () => {
    setIsFolded(false);
  };
  const [isFoldedNonMem, setIsFoldedNonMem] = useState(true);
  const unfoldNonMem = () => {
    setIsFoldedNonMem(false);
  };

  return (
    <div className="ML-manage">
      <div className={isFolded ? "MemberList" : "MemberList-expand"}>
        <div className="ML-header">
          <div className="ML-title">Group Members</div>
        </div>
        <hr className="ML-hr" />
        {isFolded ? foldedMembers : expandedMembers}
        {isFolded && members.length > 8 && <div className="ML-btn-entry"><button type="submit" onClick={unfold} className="ML-btn">View More </button></div>}
      </div>
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

export default ManageMemberList;
