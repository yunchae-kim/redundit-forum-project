/* eslint-disable max-len */
import { useEffect, useState } from "react";
import PostPanel from "../components/PostPanel";
import CommentPiece from "../components/CommentPiece";
import NavBar from "../components/NavBar";
import "../style/pages/GroupPage.css";
import httpClient from "../utility/auth.helper";
import { getPostAndCommentByTag } from "../utility/axiosHashtags";

const HashtagPage = (props) => {
  const { location: { state: { hashtag } } } = props;
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [userId, setUserId] = useState(0);

  useEffect(() => {
    const userObj = httpClient.getCurrentUser();
    if (userObj) {
      const { iduser } = userObj;
      if (iduser) {
        setUserId(iduser);
        getPostAndCommentByTag(hashtag).then((result) => {
          setPosts(result.filter((i) => i.idpost > 0));
          setComments(result.filter((i) => i.idcomment > 0));
        });
      }
    }
  }, [userId]);

  let postPanels = [];
  postPanels = posts.map((m) => (<PostPanel postId={m.idpost} userId={userId} key={m.idpost} />));
  let commentPieces = [];
  commentPieces = comments.map((m) => (<CommentPiece commentId={m.idcomment} key={m.idcomment} />));

  return (
    <div className="GroupPage">
      <NavBar />
      <div className="GP-left">
        <div className="GP-board">
          <div>Posts</div>
          <div className="FP-board-posts">
            {postPanels}
          </div>
          <div>Comments</div>
          <div className="FP-board-posts">
            {commentPieces}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HashtagPage;
