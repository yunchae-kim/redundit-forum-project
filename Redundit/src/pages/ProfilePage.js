/* eslint-disable max-len */
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import httpClient from "../utility/auth.helper";
import ProfileView from "../components/ProfileView";
import EditProfile from "../components/EditProfile";
import GroupPanel from "../components/GroupPanel";
import NavBar from "../components/NavBar";
import { getGroupsByUser } from "../utility/axiosGroup";
import "../style/pages/ProfilePage.css";
import "../style/pages/Global.css";

const ProfilePage = (props) => {
  const { location: { state: { userId } } } = props;
  const [groups, setGroups] = useState([]);
  const [fetched, setfetched] = useState(false);
  const history = useHistory();
  const [id, setId] = useState(0);
  const [edit, setEdit] = useState(false);

  useEffect(() => {
    const userObj = httpClient.getCurrentUser();
    if (userObj) {
      const { iduser } = userObj;
      if (iduser) {
        setId(iduser);
      }
    } else {
      history.push("/");
    }
  }, [userId]);

  useEffect(() => {
    setfetched(true);
    getGroupsByUser(userId).then((groupFetched) => {
      setGroups(groupFetched);
    });
  }, [fetched]);

  const groupPanels = [];
  for (let i = 0; i < groups.length; i += 1) {
    groupPanels.push(
      <GroupPanel groupId={groups[i].idgroup} key={i} />,
    );
  }

  const editToggle = () => {
    setEdit(!edit);
  };

  return (
    <div className="ProfilePage">
      <NavBar />
      <div className="global-container">
        <div className="PFP-left global-left-panel">
          <div className="PFP-container">
            <div className="PFP-name global-header">User Profile</div>
            <div className="PFP-profile">
              {!edit ? <ProfileView userId={userId} onClick={editToggle} /> : <EditProfile userId={userId} onClick={editToggle} />}
            </div>
          </div>
          {id === userId
          && (
          <div className="PFP-container">
            <div className="PFP-mygroup">
              <div className="PFP-mygroup-title global-header">My Groups</div>
              <div className="PFP-mygroup-groups">
                {groupPanels}
              </div>
            </div>
          </div>
          ) }
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
