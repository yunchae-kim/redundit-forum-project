import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import groupIcon from "../test_data/groupIcon.jpg";
import { getAllUsersInGroup } from "../utility/axiosUser";
import { deleteMember, putMember } from "../utility/axiosMember";
import { getGroupById } from "../utility/axiosGroup";
import { addNotification } from "../utility/axiosNotification";

const InvitationList = ({ groupId }) => {
  const [members, setMembers] = useState([]);
  const [group, setGroup] = useState({});
  useEffect(() => {
    getGroupById(groupId).then((groupFetched) => {
      setGroup(groupFetched);
    });
  }, []);

  useEffect(() => {
    getAllUsersInGroup(groupId).then((membersFetched) => {
      setMembers(membersFetched.filter((m) => m.pending === 1));
    });
  }, [members]);

  const deleteInvite = (iduser) => {
    deleteMember(groupId, iduser).then(() => {
      addNotification(iduser, `You are denied to join ${group.name}`).then(() => {
        setMembers([]);
      });
    });
  };

  const approveInvite = (iduser) => {
    putMember(iduser, groupId, false, false).then(() => {
      addNotification(iduser, `You are approved to join ${group.name}`).then(() => {
        setMembers([]);
      });
    });
  };

  const invitedMembers = members.map((m) => (
    <div key={m.iduser}>
      <div className="ML-entry">
        <img className="ML-userIcon" src={groupIcon} alt="" />
        <Link to={{ pathname: `/user/${m.iduser}`, state: { userId: m.iduser } }} className="ML-entry-name" key={m.iduser}><span>{m.username}</span></Link>
        <button type="button" onClick={() => deleteInvite(m.iduser)}>Delete</button>
        <button type="button" onClick={() => approveInvite(m.iduser)}>Approve</button>
      </div>
      <hr className="ML-hr" />
    </div>
  ));

  return (
    <div>
      <div>
        {invitedMembers}
      </div>
    </div>
  );
};

export default InvitationList;
