import { Link, useHistory } from "react-router-dom";
import { useEffect, useState } from "react";
import { Divider } from "@blueprintjs/core";
import userIcon from "../resources/userIcon.png";
import "../style/components/CommentList.css";
import { getHashtag } from "../utility/axiosHashtags";

const Comment = ({ comment, userId, deleteCmt }) => {
  const history = useHistory();
  const [tags, setTags] = useState([]);

  const editComment = () => {
    history.push({ pathname: `/editcomment/${comment.idcomment}`, state: { comment, hashtags: tags } });
  };

  useEffect(() => {
    getHashtag(comment.idcomment, "comment").then((tagsFetched) => {
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
      { comment.iduser === userId && (
      <div className="Post-comment-modify">
        <button type="submit" onClick={() => editComment()}>Edit Comment</button>
        <Divider />
        <button type="submit" onClick={() => deleteCmt(comment.idcomment)}>Delete Comment</button>
      </div>
      ) }
    </div>
  );
};

export default Comment;
