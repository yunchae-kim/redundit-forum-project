/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { getGroupById } from "../utility/axiosGroup";
import { getAllPostsInGroup } from "../utility/axiosPost";
import { getMember } from "../utility/axiosMember";
import PostPanel from "../components/PostPanel";
import MemberList from "../components/MemberList";
import NavBar from "../components/NavBar";
import "../style/pages/GroupPage.css";
import GroupPanelLarge from "../components/GroupPanelLarge";
import LinkButton from "../components/LinkButton";
import httpClient from "../utility/auth.helper";
import PrivateGroupInviteList from "../components/PrivateGroupInviteList";
import { getHide } from "../utility/axiosHide";

const GroupPage = (props) => {
  const { location: { state: { groupId } } } = props;
  const [posts, setPosts] = useState([]);
  const [userId, setUserId] = useState(0);
  const [member, setMember] = useState(null);
  const [group, setGroup] = useState([]);
  const [hiddenPost, setHiddenPost] = useState([]);

  useEffect(() => {
    const userObj = httpClient.getCurrentUser();
    if (userObj) {
      const { iduser } = userObj;
      if (iduser) {
        setUserId(iduser);
        getHide(iduser, groupId).then((result) => {
          setHiddenPost(result.map((r) => (r.idpost)));
        });
        getMember(groupId, userId).then((memberFetched) => {
          setMember(memberFetched);
        });
      }
    }
  }, [userId]);

  useEffect(() => {
    getAllPostsInGroup(groupId).then((postsFetched) => {
      setPosts(postsFetched);
    });
    getGroupById(groupId).then((groupFetched) => {
      setGroup(groupFetched);
    });
  }, []);

  let postPanels = [];
  postPanels = posts.filter((i) => !hiddenPost.includes(i.idpost)).map((m) => (<PostPanel postId={m.idpost} userId={userId} key={m.idpost} />));

  return (
    <div className="GroupPage">
      <NavBar />
      <div className="GP-left">
        <div className="GP-intro">
          <LinkButton url={`/groupanalytics/${groupId}`} text="Analytics" groupId={groupId} />
          <GroupPanelLarge groupId={groupId} />
        </div>
        <div className="GP-board">
          <div className="FP-board-title">Board</div>
          <div className="FP-board-posts">
            {postPanels}
          </div>
        </div>
      </div>
      <div className="GP-right">
        {member != null && member.admin === 1 && <LinkButton url={`/managegroup/${groupId}`} text="Manage Group" groupId={groupId} />}
        {member != null && member.pending !== 1 && <LinkButton url={`/createpost/${groupId}`} text="Create Post" groupId={groupId} />}
        <MemberList groupId={groupId} />
        {member != null && member.pending !== 1 && group.private === 1 && <PrivateGroupInviteList groupId={groupId} groupName={group.name} />}
      </div>
    </div>
  );
};

export default GroupPage;
