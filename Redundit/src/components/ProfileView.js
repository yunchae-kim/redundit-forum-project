/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { Button, InputGroup } from "@blueprintjs/core";
import "../style/components/ProfileView.css";
import "../style/pages/Global.css";
import userIcon from "../test_data/userIcon.png";
import { getUserById } from "../utility/axiosUser";
import httpClient from "../utility/auth.helper";

const ProfileView = ({ userId, onClick }) => {
  const [user, setUser] = useState([]);
  const [id, setId] = useState(0);

  useState(() => {
    getUserById(userId).then((userFetched) => {
      setUser(userFetched);
    });
  }, []);

  useEffect(() => {
    const userObj = httpClient.getCurrentUser();
    if (userObj) {
      const { iduser } = userObj;
      if (iduser) {
        setId(iduser);
      }
    }
  }, [id]);

  return (
    <div className="ProfileView">
      {id === userId && <Button text="Edit" onClick={onClick} />}
      <div className="PV-photo">
        <div className="PV-firstCol">Profile Photo</div>
        <img className="PV-secondCol PV-userIcon" src={user.image === "dummyURL" ? userIcon : user.image} alt="" />
      </div>
      <div className="PV-email">
        <div className="PV-firstCol">Username</div>
        <div className="PV-secondCol PV-userEmail">{user.username}</div>
      </div>
      <div className="PV-joindate">
        <div className="PV-firstCol">Join Date</div>
        <div className="PV-secondCol PV-joindate">{user.joindate}</div>
      </div>
      <div className="PV-status">
        <div className="PV-firstCol">Status</div>
        <div className="PV-secondCol PV-status">{user.status ? "Active" : "Deactivated"}</div>
      </div>
    </div>
  );
};

export default ProfileView;
