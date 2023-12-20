import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@blueprintjs/core";
import { deletePostById, getFlaggedPostsInGroup, flagPostById } from "../utility/axiosPost";
import { addNotification } from "../utility/axiosNotification";

const FlaggedList = ({ groupId }) => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    getFlaggedPostsInGroup(groupId).then((postsFetched) => {
      setPosts(postsFetched);
    });
  }, [posts]);

  const deletePost = (postId, userId, postTitle) => {
    deletePostById(postId).then(() => {
      addNotification(userId, `Your post ${postTitle} is deleted by admin`);
      setPosts([]);
    });
  };

  const unflag = (postId) => {
    flagPostById(postId, 0).then(() => {
      setPosts([]);
    });
  };

  const postsList = posts.map((c) => (
    <div className="Post-comment" key={c.idpost}>
      <div className="Post-comment-name">
        <Button text="delete" onClick={() => deletePost(c.idpost, c.iduser, c.title)} />
        <Button text="unflag" onClick={() => unflag(c.idpost)} />
        <div>
          {c.status === 1
            ? (
              <Link to={`/user/${c.iduser}`}>
                author:
                {" "}
                {c.username}
              </Link>
            ) : (
              <span>
                author:
                {" "}
                {c.username}
                {" "}
                (deactivated)
              </span>
            )}
        </div>
        <div className="Post-comment-content">
          Post:
          {" "}
          {c.title}
        </div>
      </div>
    </div>
  ));

  return (
    <div>
      <div>
        {postsList}
      </div>
    </div>
  );
};

export default FlaggedList;
