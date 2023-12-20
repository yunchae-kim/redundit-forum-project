import { useEffect, useState } from "react";
import { getAllPostsInGroup } from "../utility/axiosPost";
import NavBar from "../components/NavBar";
import "../style/pages/GroupPage.css";
import "../style/pages/Global.css";
import LinkButton from "../components/LinkButton";
import { getAllUsersInGroup } from "../utility/axiosUser";

const GroupAnalyticsPage = (props) => {
  const { location: { state: { groupId } } } = props;
  const [postNum, setPostNum] = useState(0);
  const [memberNum, setMemberNum] = useState(0);
  const [pendingNum, setPendingNum] = useState(0);
  const [adminNum, setAdminNum] = useState(0);
  const [post, setPost] = useState("");

  useEffect(() => {
    getAllPostsInGroup(groupId).then((postsFetched) => {
      setPostNum(postsFetched.length);
      if (postsFetched.length !== 0) {
        setPost(postsFetched.sort((a, b) => b.idpost - a.idpost)[0]);
      }
    });

    getAllUsersInGroup(groupId).then((usersInGroup) => {
      setMemberNum(usersInGroup.filter((m) => m.pending === 0).length);
      setPendingNum(usersInGroup.filter((m) => m.pending === 1).length);
      setAdminNum(usersInGroup.filter((m) => m.admin === 1).length);
    });
  }, []);
  // <Link to={{ pathname: `/editgroup/${groupId}`, state: { group } }}><span>Edit</span></Link>
  return (
    <div className="GroupPage">
      <NavBar />
      <div className="global-container">
        <div className="GP-left global-left-panel">
          <div className="GP-intro">
            <LinkButton url={`/group/${groupId}`} text="Back" groupId={groupId} />
          </div>
          <div className="GP-manage-members">
            <div>
              Post number:
              {" "}
              {postNum}
            </div>
            <div>
              Member number:
              {" "}
              {memberNum}
            </div>
            <div>
              Pending member number:
              {" "}
              {pendingNum}
            </div>
            <div>
              Admin number:
              {" "}
              {adminNum}
            </div>
            <div>
              Last post time:
              {" "}
              {post.date}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupAnalyticsPage;
