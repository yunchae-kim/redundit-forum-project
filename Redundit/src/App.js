import {
  BrowserRouter,
  Route,
  Switch,
} from "react-router-dom";
import "./App.css";
import FrontPage from "./pages/FrontPage";
import LogInPage from "./pages/LogInPage";
import SignUpPage from "./pages/SignUpPage";
import PostPage from "./pages/PostPage";
import CreatePostPage from "./pages/CreatePostPage";
import ChatPage from "./pages/ChatPage";
import ProfilePage from "./pages/ProfilePage";
import "@blueprintjs/core/lib/css/blueprint.css";
import GroupPage from "./pages/GroupPage";
import CreateGroupPage from "./pages/CreateGroupPage";
import ManageGroupPage from "./pages/ManageGroupPage";
import PostUserManage from "./pages/PostUserManagePage";
import EditPost from "./components/EditPost";
import EditComment from "./components/EditComment";
import HashtagPage from "./pages/HashtagPage";
import GroupAnalyticsPage from "./pages/GroupAnalyticsPage";
import PostAnalyticsPage from "./pages/PostAnalyticsPage";

function MyApp() {
  return (
    <div className="MyApp">
      <header className="MyApp-header">
        <BrowserRouter>
          <Switch>
            <Route
              exact
              path="/"
              component={FrontPage}
            />
            <Route
              path="/login"
              component={LogInPage}
            />
            <Route
              path="/signup"
              component={SignUpPage}
            />
            <Route
              path="/post"
              component={PostPage}
            />
            <Route
              path="/group"
              component={GroupPage}
            />
            <Route
              path="/user"
              component={ProfilePage}
            />
            <Route
              path="/chat"
              component={ChatPage}
            />
            <Route
              path="/createpost"
              component={CreatePostPage}
            />
            <Route
              path="/creategroup"
              component={CreateGroupPage}
            />
            <Route
              path="/editpost"
              component={EditPost}
            />
            <Route
              path="/managegroup"
              component={ManageGroupPage}
            />
            <Route
              path="/editcomment"
              component={EditComment}
            />
            <Route
              path="/postusermanage"
              component={PostUserManage}
            />
            <Route
              path="/hashtag"
              component={HashtagPage}
            />
            <Route
              path="/groupanalytics"
              component={GroupAnalyticsPage}
            />
            <Route
              path="/postanalytics"
              component={PostAnalyticsPage}
            />
          </Switch>
        </BrowserRouter>
      </header>
    </div>
  );
}

export default MyApp;
