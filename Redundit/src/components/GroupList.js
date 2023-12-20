import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import groupIcon from "../test_data/groupIcon.jpg";
import { getGroupsByUser } from "../utility/axiosGroup";
import "../style/components/GroupList.css";

const GroupList = ({ userId }) => {
  const [groups, setGroups] = useState([]);
  const [fetched, setfetched] = useState(false);

  useEffect(() => {
    setfetched(true);
    getGroupsByUser(userId).then((groupFetched) => {
      setGroups(groupFetched);
    });
  }, [fetched]);

  const foldedMembers = groups.slice(0, 8).map((m) => (
    <div key={m.idgroup}>
      <div className="GL-entry">
        <img className="GL-userIcon" src={groupIcon} alt="" />
        <Link to={{ pathname: `/group/${m.idgroup}`, state: { groupId: m.idgroup } }} className="GL-entry-name">
          <span>
            {m.name}
            {m.private === 0 && " (Private)"}
          </span>
        </Link>
      </div>
      <hr className="GL-hr" />
    </div>
  ));

  const expandedMembers = groups.map((m) => (
    <div key={m.idgroup}>
      <div className="GL-entry">
        <img className="GL-userIcon" src={groupIcon} alt="" />
        <Link to={{ pathname: `/group/${m.idgroup}`, state: { groupId: m.idgroup } }} className="GL-entry-name"><span>{m.name}</span></Link>
      </div>
      <hr className="GL-hr" />
    </div>
  ));

  const [isFolded, setIsFolded] = useState(true);
  const unfold = () => {
    setIsFolded(false);
  };

  return (
    <div className="global-right-list">
      <div className="GL-header">
        <div className="GL-title">My Groups</div>
      </div>
      <hr className="GL-hr" />
      {isFolded ? foldedMembers : expandedMembers}
      {isFolded && groups.length > 8 && <div className="GL-btn-entry"><button type="submit" onClick={unfold} className="GL-btn">View More </button></div>}
    </div>
  );
};

export default GroupList;
