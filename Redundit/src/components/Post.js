/* eslint-disable react/destructuring-assignment */
/* eslint-disable max-len */
import { Divider } from "@blueprintjs/core";
import { Link, useHistory } from "react-router-dom";
import { useEffect, useState } from "react";
import NavBar from "./NavBar";
import userIcon from "../resources/userIcon.png";
import { getPostById, deletePostById, flagPostById } from "../utility/axiosPost";
import LinkButton from "./LinkButton";
import { getHashtag } from "../utility/axiosHashtags";
import "../style/components/Post.css";
import CommentList from "./CommentList";
import httpClient from "../utility/auth.helper";
import { getMember } from "../utility/axiosMember";
import { addHide } from "../utility/axiosHide";
import { addNotification } from "../utility/axiosNotification";

const Post = ({ postId }) => {
  const [post, setPost] = useState({});
  const [fetched, setfetched] = useState(false);
  const [tags, setTags] = useState([]);
  const [userId, setUserId] = useState(0);
  const [member, setMember] = useState(null);
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
        });
      } else {
        history.push({ pathname: `/group/${post.idgroup}`, state: { groupId: post.idgroup } });
      }
    });
  };

  const editPost = () => {
    history.push({ pathname: `/editpost/post/${postId}`, state: { post, hashtags: tags } });
  };

  const flagPost = () => {
    flagPostById(postId, true);
  };

  const hidePost = () => {
    addHide(userId, postId, post.idgroup).then(() => {
      history.push({ pathname: `/group/${post.idgroup}`, state: { groupId: post.idgroup } });
      history.go();
    });
  };

  return (
    <div>
      <NavBar />
      <Link to={{ pathname: `/postanalytics/${postId}`, state: { postId } }}>Post Analytics</Link>
      <LinkButton url={`/group/${post.idgroup}`} text="Back to Group" groupId={post.idgroup} />
      <div className="PostPage">
        <div className="Post-header">
          <img className="Post-userIcon" src={userIcon} alt="" />
          <div className="Post-userName">
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
          <div className="Post-postDate">
            Posted:
            {" "}
            {post.date}
          </div>
        </div>
        <div className="Post-title">
          {post.title}
        </div>
        <div className="Post-hashtags">
          {hashTagsList}
        </div>
        <div className="Post-img-div">
          {post.image == null ? <></> : <img src={post.image} alt="" className="Post-img" />}
          {post.audio == null ? <></> : (
            <audio controls src={post.audio}>
              Your browser does not support the audio element.
              <track src="" kind="captions" srcLang="en" label="english_captions" />
            </audio>
          )}
          {post.video == null ? <></> : (
            <video controls src={post.video}>
              Your browser does not support the video element.
              <track src="" kind="captions" srcLang="en" label="english_captions" />
            </video>
          )}
        </div>
        <div className="Post-post">
          {post.content}
        </div>
        <hr />
        <div className="Post-fooder">
          {((userId !== 0 && userId !== post.iduser)) && <button type="submit" onClick={() => hidePost()}>Hide</button>}
          <Divider />
          {((member != null)) && <button type="submit" onClick={() => flagPost()}>Flag for Deletion</button>}
          <Divider />
          {((post.iduser === userId) || (member != null && member.admin === 1)) && <button type="submit" onClick={() => deletePost()}>Delete</button>}
          <Divider />
          {(post.iduser === userId) && <button type="submit" onClick={() => editPost()}>Edit</button>}
        </div>
      </div>
      <div className="PostPage-comments">
        <CommentList postId={postId} />
      </div>
    </div>
  );
};

export default Post;
