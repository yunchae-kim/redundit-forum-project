/* eslint-disable react/button-has-type */
import { useState, useEffect } from "react";
import { Button, Navbar, Alignment } from "@blueprintjs/core";
import { Link, useHistory } from "react-router-dom";
import httpClient from "../utility/auth.helper";
import logo from "../resources/logo.svg";
import userIcon from "../resources/userIcon.png";
import messageIcon from "../resources/messageIcon.png";
import "../style/components/NavBar.css";

const NavBar = () => {
  const history = useHistory();
  const [userId, setUserId] = useState(0);

  async function handleLogout() {
    httpClient.logOut();
    setUserId(0);
    history.push("/");
    history.go();
  }

  useEffect(() => {
    const userObj = httpClient.getCurrentUser();
    if (userObj) {
      const { iduser } = userObj;
      if (iduser) {
        setUserId(iduser);
      }
    }
  }, [userId]);

  return (
    <Navbar className="bp3-navbar navbar" fixedToTop>
      <Navbar.Group align={Alignment.LEFT}>
        <Link to="/">
          <img className="navbar-logo" src={logo} alt="" />
        </Link>
      </Navbar.Group>
      <Navbar.Group align={Alignment.RIGHT}>
        {userId
          ? <Button className="navbar-button" text="Log Out" intent="primary" small onClick={() => handleLogout()} />
          : (
            <div>
              <Link to="/login">
                <Button className="navbar-button" text="Log In" intent="primary" small />
              </Link>
              <Link to="/signup">
                <Button className="navbar-button" text="Sign Up" intent="primary" small />
              </Link>
            </div>
          )}
        {userId
          ? (
            <div>
              <Link to={{ pathname: `/user/${userId}`, state: { userId } }}><img className="navbar-icon" alt="" src={userIcon} /></Link>
              <Link to="/chat"><img className="navbar-icon navbar-icon-message" alt="" src={messageIcon} /></Link>
            </div>
          )
          : <></>}
      </Navbar.Group>
    </Navbar>
  );
};

export default NavBar;
