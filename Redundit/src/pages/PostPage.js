import Post from "../components/Post";
import NavBar from "../components/NavBar";

const PostPage = (props) => {
  const { location: { state: { postId } } } = props;
  return (
    <div>
      <NavBar />
      <Post postId={postId} />
    </div>
  );
};

export default PostPage;
