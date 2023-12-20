import { useState } from "react";
import { Button, InputGroup } from "@blueprintjs/core";
import "../style/components/ProfileView.css";
import "../style/pages/Global.css";
import userIcon from "../test_data/userIcon.png";
import { getUserById, putUserById } from "../utility/axiosUser";
import UploadMedia from "./UploadMedia";

const ProfileView = ({ userId, onClick }) => {
  const [user, setUser] = useState({});
  const [popup, setPopup] = useState(false);
  const [username, setUserame] = useState("");
  const [password, setPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [status, setStatus] = useState(true);
  const [imageUrl, setImageUrl] = useState("");

  useState(() => {
    getUserById(userId).then((userFetched) => {
      setUser(userFetched);
      setUserame(userFetched.username);
      setStatus(userFetched.status);
      setImageUrl(userFetched.image);
      setOldPassword(userFetched.password);
    });
  }, []);

  const submitUser = () => {
    const newPassword = password === "" ? oldPassword : password;
    putUserById(userId, username, newPassword, status, imageUrl, true).then(() => {
      onClick();
    });
  };

  const uploadFiles = (typeOfFile, url) => {
    setImageUrl(url);
  };

  return (
    <div className="ProfileView">
      {popup && <UploadMedia setPopup={setPopup} fileType="image" onClick={uploadFiles} />}
      <Button text="back" onClick={onClick} />
      <div className="PV-photo">
        <div className="PV-firstCol">Profile Photo</div>
        <img className="PV-secondCol PV-userIcon" src={user.image === "dummyURL" ? userIcon : user.image} alt="" />
        <Button text="Change Pic" onClick={() => setPopup(true)} />
      </div>
      <div className="PV-email">
        <div className="PV-firstCol">Username</div>
        <div className="PV-secondCol PV-userEmail">{user.username}</div>
      </div>
      <div className="PV-password">
        <div className="PV-firstCol">Password</div>
        <InputGroup
          value={password}
          id="NP-titleInputGroup"
          placeholder="New Password"
          large="true"
          type="text"
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div className="PV-status">
        <div className="PV-firstCol">Status</div>
        <div className="PV-secondCol PV-status">{status ? "Active" : "Deactivated"}</div>
        <Button text={status ? "Deactivate" : "Activate"} onClick={() => setStatus(!status)} />
      </div>
      <Button
        id="NP-postBtn"
        text="Confirm"
        onClick={() => submitUser()}
      />
    </div>
  );
};

export default ProfileView;
