/* eslint-disable no-unused-vars */
/* eslint-disable no-param-reassign */
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import {
  Button, InputGroup, EditableText, Checkbox,
} from "@blueprintjs/core";
import "../style/components/NewPost.css";
import { createGroup } from "../utility/axiosGroup";
import httpClient from "../utility/auth.helper";
import { createMember } from "../utility/axiosMember";
import { createGrouptags } from "../utility/axiosGrouptag";
import LinkButton from "../components/LinkButton";

const CreateGroupPage = () => {
  const [groupData, setGroupData] = useState({
    groupName: "", description: "", tags: [], isPrivate: false,
  });
  const [groupName, setGroupName] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState([]);
  const [isPrivate, setPrivate] = useState(false);
  const [userId, setUserId] = useState(0);
  const history = useHistory();
  const addTags = (event) => {
    if (event.key === "Enter" && event.target.value !== "") {
      if (!tags.includes(event.target.value)) {
        setTags([...tags, event.target.value]);
      }
      event.target.value = "";
    }
  };

  useEffect(() => {
    const userObj = httpClient.getCurrentUser();
    if (userObj) {
      const { iduser } = userObj;
      if (iduser) {
        setUserId(iduser);
      }
    } else {
      history.push("/");
    }
  }, [userId]);

  const removeTag = (targetTag) => {
    setTags([...tags.filter((tag) => tag !== targetTag)]);
  };

  const submitGroup = () => {
    createGroup(groupName, isPrivate, true, userId, description).then((groupId) => {
      createMember(groupId, userId, true, false).then(() => {
        createGrouptags(tags, groupId).then(() => {
          history.push(`/group/${groupId}`, { groupId });
        });
      });
    });
  };

  return (
    <>
      <LinkButton url="/" text="Back" />
      <div className="NewPost">
        <div id="NP-titleInput">
          <InputGroup
            id="NP-titleInputGroup"
            placeholder="Group Name"
            large="true"
            type="text"
            onChange={(e) => setGroupName(e.target.value)}
          />
        </div>
        <div id="NP-textInputDiv">
          <EditableText
            id="NP-textInputBox"
            maxLines={12}
            minLines={12}
            multiline
            placeholder="Group description"
            onChange={(val) => setDescription(val)}
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
            placeholder="Enter to add group tags"
          />
        </div>
        <div>
          <Checkbox label="Private Group" onChange={() => setPrivate(!isPrivate)} />
        </div>
        <div className="NP-postBtnDiv">
          {groupName === "" ? <></> : (
            <Button
              id="NP-postBtn"
              text="Create"
              onClick={() => submitGroup()}
            />
          )}
        </div>
      </div>

    </>
  );
};
export default CreateGroupPage;
