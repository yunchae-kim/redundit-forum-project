import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import userIcon from "../resources/userIcon.png";
import "../style/components/CommentList.css";
import { getHashtag } from "../utility/axiosHashtags";
import { getComment } from "../utility/axiosComment";

const CommentPiece = ({ commentId }) => {
  const [comment, setComment] = useState({});
  const [tags, setTags] = useState([]);

  useEffect(() => {
    getComment(commentId).then((commentFetched) => {
      setComment(commentFetched);
    });
    getHashtag(commentId, "comment").then((tagsFetched) => {
      setTags(tagsFetched);
    });
  }, []);

  const hashTagsList = tags.map((h) => (
    <Link to={{ pathname: `/hashtag/${h.hashtag}`, state: { hashtag: h.hashtag } }} key={h.hashtag}>
      #
      {h.hashtag}
      {" "}
    </Link>
  ));

  return (
    <div className="Post-comment">
      <Link to={{ pathname: `/post/${comment.idpost}`, state: { postId: comment.idpost } }}><span>Go to post</span></Link>
      <div className="Post-comment-name">
        <img src={userIcon} alt="" className="Post-comment-icon" />
        {comment.status === 1
          ? <Link to={{ pathname: `/user/${comment.iduser}`, state: { userId: comment.iduser } }}><span className="CW-chatentry-name">{comment.username}</span></Link>
          : (
            <span className="CW-chatentry-name">
              {comment.username}
              {" "}
              (deactivated)
            </span>
          )}
        <span className="Post-comment-time">{comment.date}</span>
      </div>
      <div className="Post-comment-content">{hashTagsList}</div>
      <div className="Post-comment-content">{comment.content}</div>
    </div>
  );
};

export default CommentPiece;
