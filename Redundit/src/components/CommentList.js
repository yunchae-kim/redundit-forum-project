/* eslint-disable no-param-reassign */
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import {
  Button, InputGroup,
} from "@blueprintjs/core";
import "../style/components/CommentList.css";
import { getCommentByPost, addComment, deleteComment } from "../utility/axiosComment";
import { addHashtag } from "../utility/axiosHashtags";
import httpClient from "../utility/auth.helper";
import Comment from "./Comment";

const CommentList = ({ postId }) => {
  const [content, setContent] = useState("");
  const [tags, setTags] = useState([]);
  const [comments, setComments] = useState([]);
  const [userId, setUserId] = useState(0);
  const history = useHistory();

  useEffect(() => {
    const userObj = httpClient.getCurrentUser();
    if (userObj) {
      const { iduser } = userObj;
      if (iduser) {
        setUserId(iduser);
      }
    }
  }, [userId]);

  const addTags = (event) => {
    if (event.key === "Enter" && event.target.value !== "") {
      if (!tags.includes(event.target.value)) {
        setTags([...tags, event.target.value]);
      }
      event.target.value = "";
    }
  };

  const removeTag = (targetTag) => {
    setTags([...tags.filter((tag) => tag !== targetTag)]);
  };

  useEffect(() => {
    getCommentByPost(postId).then((commentsFetched) => {
      setComments(commentsFetched);
    });
  }, []);

  const submitComment = () => {
    let status = false;
    if (tags.length !== 0) {
      status = true;
    }
    addComment(userId, postId, content, status).then((commentId) => {
      addHashtag(tags, commentId, "comment").then(() => {
        history.push(`/post/${postId}`, { postId });
        history.go();
      });
    });
  };

  const deleteCmt = (idcomment) => {
    deleteComment(idcomment).then(() => {
      history.push(`/post/${postId}`, { postId });
      history.go();
    });
  };

  const commentsList = comments.map((c) => (
    <Comment comment={c} userId={userId} deleteCmt={deleteCmt} key={c.idcomment} />
  ));

  return (
    <div className="Cmnt-container">
      <div className="Cmnt-">
        <div id="Cmnt-input">
          <InputGroup
            id="Cmnt-inputUser"
            placeholder="Input comment"
            large="true"
            type="text"
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
        <div id="NP-tagInput">
          <ul id="NP-tags">
            {tags.map((tag) => (
              <li key={tag} className="tag">
                <span className="NP-tagTitle">
                  {" "}
                  {tag}
                  {" "}
                </span>
                <Button
                  className="NP-tagCloseIcon"
                  icon="cross"
                  minimal
                  onClick={() => removeTag(tag)}
                />
              </li>
            ))}
          </ul>
          <input
            type="text"
            onKeyUp={(event) => addTags(event)}
            placeholder="Enter to add hashtags"
          />
        </div>
        <div className="NP-postBtnDiv">
          {content === "" ? <></> : (
            <Button
              id="NP-postBtn"
              text="Post"
              onClick={() => submitComment()}
            />
          )}
        </div>
      </div>
      <div>
        {commentsList}
      </div>
    </div>
  );
};

export default CommentList;
