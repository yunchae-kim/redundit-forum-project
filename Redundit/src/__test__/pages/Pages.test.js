import { waitFor, act } from "@testing-library/react";
import renderer from "react-test-renderer";
import { BrowserRouter } from "react-router-dom";

// import ChatPage from "../../pages/ChatPage";
import CreateGroupPage from "../../pages/CreateGroupPage";
// import CreatePostPage from "../../pages/CreatePostPage";
// import EditGroup from "../../pages/EditGroup";
import FrontPage from "../../pages/FrontPage";
// import GroupAnalyticsPage from "../../pages/GroupAnalyticsPage";
// import GroupPage from "../../pages/GroupPage";
// import HashtagPage from "../../pages/HashtagPage";
// import LogInPage from "../../pages/LogInPage";
// import ManageGroupPage from "../../pages/ManageGroupPage";
// import PostAnalyticsPage from "../../pages/PostAnalyticsPage";
// import PostPage from "../../pages/PostPage";
// import PostUserManagePage from "../../pages/PostUserManagePage";
// import ProfilePage from "../../pages/ProfilePage";
// import SignUpPage from "../../pages/SignUpPage";

test("test should CreateGroupPage match snapshot", async () => {
  const tree = renderer.create(
    <BrowserRouter>
      <CreateGroupPage />
    </BrowserRouter>,
  ).toJSON();
  await waitFor(async () => {
    expect(tree).toMatchSnapshot();
  });
});

test("test should FrontPage match snapshot", async () => {
  const tree = renderer.create(
    <BrowserRouter>
      <FrontPage />
    </BrowserRouter>,
  ).toJSON();
  await waitFor(async () => {
    expect(tree).toMatchSnapshot();
  });
});
