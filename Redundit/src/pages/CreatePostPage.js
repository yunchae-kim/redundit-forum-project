import NewPost from "../components/NewPost";
import NavBar from "../components/NavBar";

const CreatePostPage = (props) => {
  const { location: { state: { groupId } } } = props;
  return (
    <div>
      <NavBar />
      <NewPost groupId={groupId} />
    </div>
  );
};

export default CreatePostPage;
