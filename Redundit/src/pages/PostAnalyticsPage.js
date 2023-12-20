import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../style/pages/GroupPage.css";
import "../style/pages/Global.css";
import { getCommentByPost } from "../utility/axiosComment";
import NavBar from "../components/NavBar";
import { getPostById } from "../utility/axiosPost";
import { getHideCount } from "../utility/axiosHide";

const PostAnalyticsPage = (props) => {
  const { location: { state: { postId } } } = props;
  const [commentNum, setCommentNum] = useState(0);
  const [comment, setComment] = useState("");
  const [post, setPost] = useState("");
  const [hideCount, setHideCount] = useState(0);

  useEffect(() => {
    getPostById(postId).then((result) => {
      setPost(result);
    });
    getCommentByPost(postId).then((commentsFetched) => {
      setCommentNum(commentsFetched.length);
      if (commentsFetched.length !== 0) {
        setComment(commentsFetched.sort((a, b) => b.idcomment - a.idcomment)[0]);
      }
    });
    getHideCount(postId).then((result) => {
      setHideCount(result.length);
    });
  }, []);
  // <Link to={{ pathname: `/editgroup/${groupId}`, state: { group } }}><span>Edit</span></Link>
  return (
    <div className="GroupPage">
      <NavBar />
      <div className="global-container">
        <div className="GP-left global-left-panel">
          <div className="GP-intro">
            <Link to={{ pathname: `/post/${postId}`, state: { postId } }} className="PP-viewPostText">
              Back
            </Link>
          </div>
          <div className="GP-manage-members">
            <div>
              Comment number:
              {" "}
              {commentNum}
            </div>
            <div>
              Hiden by:
              {" "}
              {hideCount}
            </div>
            <div>
              Flagged:
              {" "}
              {post.flagged ? "Yes" : "No"}
            </div>
            <div>
              Last cmment time:
              {" "}
              {comment.date}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostAnalyticsPage;
