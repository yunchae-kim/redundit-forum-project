/* eslint-disable no-param-reassign */
import { useState } from "react";
import "../style/components/EditComment.css";
import {
  Button, InputGroup,
} from "@blueprintjs/core";
import { useHistory } from "react-router-dom";
import { updateComment } from "../utility/axiosComment";
import { addHashtag, deleteHashtagByComment } from "../utility/axiosHashtags";

const EditComment = (props) => {
  const { location: { state: { comment, hashtags } } } = props;
  const [content, setContent] = useState(comment.content);
  const [tags, setTags] = useState(hashtags.map((item) => item.hashtag));
  const history = useHistory();

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

  const submitComment = () => {
    updateComment(comment.idcomment, content, true, false, "", "", "").then(() => {
      deleteHashtagByComment(comment.idcomment).then(() => {
        addHashtag(tags, comment.idcomment, "comment").then(() => {
          history.push(`/post/${comment.idpost}`, { postId: comment.idpost });
        });
      });
    });
  };

  return (
    <div className="Cmnt-">
      <div id="Cmnt-input">
        <InputGroup
          value={content}
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
            text="Confirm"
            onClick={() => submitComment()}
          />
        )}
      </div>
    </div>
  );
};

export default EditComment;
