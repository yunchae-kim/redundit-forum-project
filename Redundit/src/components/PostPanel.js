/* eslint-disable max-len */
import { Divider } from "@blueprintjs/core";
import { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import userIcon from "../resources/userIcon.png";
import { getPostById, deletePostById, flagPostById } from "../utility/axiosPost";
import { addHide } from "../utility/axiosHide";
import { getMember } from "../utility/axiosMember";
import { getHashtag } from "../utility/axiosHashtags";
import "../style/components/PostPanel.css";
import { addNotification } from "../utility/axiosNotification";

const PostPanel = ({ postId, userId }) => {
  const [post, setPost] = useState([]);
  const [fetched, setfetched] = useState(false);
  const [member, setMember] = useState(null);
  const [tags, setTags] = useState([]);
  const history = useHistory();

  useEffect(() => {
    setfetched(true);
    getPostById(postId).then((postFetched) => {
      setPost(postFetched);
      getMember(postFetched.idgroup, userId).then((memberFetched) => {
        setMember(memberFetched);
      });
    });
  }, [fetched]);

  useEffect(() => {
    getHashtag(postId, "post").then((tagsFetched) => {
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

  const deletePost = () => {
    deletePostById(postId).then(() => {
      if (member !== null && member.admin === 1) {
        addNotification(post.iduser, `Your post ${post.title} is deleted by admin.`).then(() => {
          history.push({ pathname: `/group/${post.idgroup}`, state: { groupId: post.idgroup } });
          history.go();
        });
      } else {
        history.push({ pathname: `/group/${post.idgroup}`, state: { groupId: post.idgroup } });
        history.go();
      }
    });
  };

  const editPost = () => {
    history.push({ pathname: `/editpost/post/${postId}`, state: { post, hashtags: tags } });
  };

  const hidePost = () => {
    addHide(userId, postId, post.idgroup).then(() => {
      history.push({ pathname: `/group/${post.idgroup}`, state: { groupId: post.idgroup } });
      history.go();
    });
  };

  const flagPost = () => {
    flagPostById(postId, true);
  };

  return (
    <div className="PostPanel">
      <div className="PP-header">
        <img className="PP-userIcon" src={userIcon} alt="" />
        <div className="PP-userName">
          {post.status === 1
            ? <Link to={{ pathname: `/user/${post.iduser}`, state: { userId: post.iduser } }}><span className="CW-chatentry-name">{post.username}</span></Link>
            : (
              <span className="CW-chatentry-name">
                {post.username}
                {" "}
                (deactivated)
              </span>
            )}
        </div>
        <div className="PP-postDate">
          Posted:
          {" "}
          {post.date}
        </div>
      </div>
      <div className="PP-title">
        {post.title}
      </div>
      <div className="PP-hashtags">
        {hashTagsList}
      </div>
      <div className="PP-post">
        {post.content}
      </div>
      <div className="PP-viewPost">
        <Link to={{ pathname: `/post/${postId}`, state: { postId } }} className="PP-viewPostText">
          View More
        </Link>
      </div>
      <hr />
      <div className="PP-fooder">
        {((userId !== 0 && userId !== post.iduser)) && <button type="submit" onClick={() => hidePost()}>Hide</button>}
        <Divider />
        {((member != null)) && <button type="submit" onClick={() => flagPost()}>Flag for Deletion</button>}
        <Divider />
        {((post.iduser === userId) || (member != null && member.admin === 1)) && <button type="submit" onClick={() => deletePost()}>Delete</button>}
        <Divider />
        {(post.iduser === userId) && <button type="submit" onClick={() => editPost()}>Edit</button>}
      </div>
    </div>
  );
};

export default PostPanel;
