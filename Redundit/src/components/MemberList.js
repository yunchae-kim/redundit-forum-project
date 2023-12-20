import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import groupIcon from "../test_data/groupIcon.jpg";
import { getAllUsersInGroup } from "../utility/axiosUser";
import "../style/components/MemberList.css";

const MemberList = ({ groupId }) => {
  const [members, setMembers] = useState([]);
  const [fetched, setfetched] = useState(false);

  useEffect(() => {
    setfetched(true);
    getAllUsersInGroup(groupId).then((membersFetched) => {
      setMembers(membersFetched.filter((m) => m.pending === 0));
    });
  }, [fetched]);

  const foldedMembers = members.slice(0, 8).map((m) => (
    <div key={m.iduser}>
      <div className="ML-entry">
        <img className="ML-userIcon" src={groupIcon} alt="" />
        <Link to={{ pathname: `/user/${m.iduser}`, state: { userId: m.iduser } }} className="ML-entry-name" key={m.iduser}><span>{m.username}</span></Link>
        {m.admin === 1 && <span className="ML-entry-admin">Administrator</span>}
      </div>
      <hr className="ML-hr" />
    </div>
  ));

  const expandedMembers = members.map((m) => (
    <div key={m.iduser}>
      <div className="ML-entry">
        <img className="ML-userIcon" src={groupIcon} alt="" />
        <Link to={{ pathname: `/user/${m.iduser}`, state: { userId: m.iduser } }} className="ML-entry-name" key={m.iduser}><span>{m.username}</span></Link>
        {m.admin === 1 && <span className="ML-entry-admin">Administrator</span>}
      </div>
      <hr className="ML-hr" />
    </div>
  ));

  const [isFolded, setIsFolded] = useState(true);
  const unfold = () => {
    setIsFolded(false);
  };

  return (
    <div className={isFolded ? "MemberList" : "MemberList-expand"}>
      <div className="ML-header">
        <div className="ML-title">Group Members</div>
      </div>
      <hr className="ML-hr" />
      {isFolded ? foldedMembers : expandedMembers}
      {isFolded && members.length > 8 && <div className="ML-btn-entry"><button type="submit" onClick={unfold} className="ML-btn">View More </button></div>}
    </div>
  );
};

export default MemberList;
