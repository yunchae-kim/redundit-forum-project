import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Button } from "@blueprintjs/core";
import "../style/components/LogInSignUp.css";
import httpClient from "../utility/auth.helper";

const LogIn = () => {
  const history = useHistory();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [disabled, setDisabled] = useState(true);
  const [lockoutPolicy, setLocked] = useState(false);
  const [lockoutMessage, setLockoutMessage] = useState(0);

  function handleNameChange(event) {
    setName(event.target.value);
  }

  function handlePasswordChange(event) {
    setPassword(event.target.value);
  }

  async function submitLogin() {
    try {
      const lockout = await httpClient.getLockout(name);

      if (Object.keys(lockout).length !== 0) {
        const { locked, timestamp } = lockout.data;
        if (locked) {
          const LOCKOUT_TIME = 300000; // 5 minutes in milliseconds
          const lockedDate = Date.parse(timestamp) - 18000000; // local time difference
          if (Date.now() >= lockedDate + LOCKOUT_TIME) {
            await httpClient.resetLockout(name);
          } else {
            setLocked(true);
            return;
          }
        }
      }
      const response = await httpClient.login(name, password);
      if (response) {
        if (Object.keys(lockout).length !== 0) {
          await httpClient.resetLockout(name);
        }
        history.push("/");
      }
    } catch (err) {
      const lockout = await httpClient.getLockout(name);
      if (Object.keys(lockout).length === 0) {
        await httpClient.addLockout(name);
        setLockoutMessage(1);
      } else {
        const { attempts } = lockout.data;
        if (attempts >= 5) {
          await httpClient.setLockout(name);
        } else {
          await httpClient.updateLockout(name);
          setLockoutMessage(attempts);
        }
      }
    }
  }

  async function handlePress(event) {
    if (event.key === "Enter" && !disabled) {
      submitLogin();
    }
  }

  useEffect(() => {
    if (name && password) {
      setLocked(false);
      setLockoutMessage(0);
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [name, password]);

  return (
    <div className="LI-container">
      <form onSubmit={submitLogin} className="LI-form">
        <div className="LI-title"> Log-In </div>
        <label htmlFor="userEmail" className="LI-entry">
          Username:
          <input
            className="LI-input"
            required
            type="text"
            name="username"
            placeholder="ex. user12345"
            onChange={handleNameChange}
            onKeyPress={handlePress}
          />
        </label>
        <label htmlFor="userPassword" className="LI-entry">
          Password:
          <input
            className="LI-input"
            required
            type="password"
            name="userPassword"
            placeholder="ex. mypassword"
            onChange={handlePasswordChange}
            onKeyPress={handlePress}
          />
        </label>
        <Button className="LI-submitBtn" text="Log In" onClick={() => submitLogin()} disabled={disabled} />
        {lockoutPolicy
          ? <p className="errorMessage">Reached the maximum number of failed attempts!</p>
          : <></>}
        {lockoutMessage > 0
          ? (
            <p className="errorMessage">
              {5 - lockoutMessage}
              &nbsp;attempt/s left before lockout!
            </p>
          )
          : <></> }
        <span className="LI-signUp">
          New? Sign Up
          {" "}
          <a href="signup">HERE</a>
        </span>
      </form>
    </div>
  );
};

export default LogIn;
