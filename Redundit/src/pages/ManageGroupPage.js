import { useEffect, useState } from "react";
import { getGroupById } from "../utility/axiosGroup";
import { getAllPostsInGroup } from "../utility/axiosPost";
import PostPanel from "../components/PostPanel";
import ManageMemberList from "../components/ManageMemberList";
import NavBar from "../components/NavBar";
import "../style/pages/GroupPage.css";
import "../style/pages/Global.css";
import GroupPanelLarge from "../components/GroupPanelLarge";
import LinkButton from "../components/LinkButton";

const GroupPage = (props) => {
  const { location: { state: { groupId } } } = props;
  const [group, setGroup] = useState({});
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    getAllPostsInGroup(groupId).then((postsFetched) => {
      setPosts(postsFetched);
    });
    getGroupById(groupId).then((groupFetched) => {
      setGroup(groupFetched);
    });
  }, []);

  const postPanels = [];
  for (let i = 0; i < posts.length; i += 1) {
    postPanels.push(
      <PostPanel postId={posts[i].idpost} key={i} />,
    );
  }

  // <Link to={{ pathname: `/editgroup/${groupId}`, state: { group } }}><span>Edit</span></Link>
  return (
    <div className="GroupPage">
      <NavBar />
      <div className="global-container">
        <div className="GP-left global-left-panel">
          <div className="GP-intro">
            <LinkButton url={`/postusermanage/${groupId}`} text="User Approve/Flagged Post" groupId={groupId} />
            <LinkButton url={`/group/${groupId}`} text="Back" groupId={groupId} />
            <GroupPanelLarge groupId={groupId} />
          </div>
          <div className="GP-manage-members">
            <div className="GP-member-list">
              <ManageMemberList groupId={groupId} creatorid={group.creator} className="temp-width-600px" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupPage;
