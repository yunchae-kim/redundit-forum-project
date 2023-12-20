import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Button } from "@blueprintjs/core";
import "../style/components/LogInSignUp.css";
import httpClient from "../utility/auth.helper";

const SignUp = () => {
  const history = useHistory();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirm] = useState("");
  const [disabled, setDisabled] = useState(true);
  const [error, setError] = useState(false);

  function handleNameChange(event) {
    setName(event.target.value);
  }

  function handlePasswordChange(event) {
    setPassword(event.target.value);
  }

  function handleConfirmChange(event) {
    setConfirm(event.target.value);
  }

  async function submitNewUser() {
    try {
      const response = await httpClient.signUp(name, password);
      if (response) {
        history.push("/login");
      }
    } catch (err) {
      // eslint-disable-next-line no-alert
      alert("error submitting new user");
    }
  }

  async function handlePress(event) {
    if (event.key === "Enter" && !disabled) {
      submitNewUser();
    }
  }

  useEffect(() => {
    if (name && password && confirmPass && (password === confirmPass)) {
      setError(false);
      setDisabled(false);
    } else if (name && password && confirmPass) {
      setError(true);
      setDisabled(true);
    } else {
      setDisabled(true);
    }
  }, [name, password, confirmPass]);

  return (
    <div className="SU-container">
      <form onSubmit={submitNewUser} className="SU-form">
        <div className="SU-title"> Sign-Up </div>
        <label htmlFor="userEmail" className="SU-entry">
          Username:
          <input
            className="SU-input"
            required
            type="text"
            name="Username"
            placeholder="ex. user12345"
            onChange={handleNameChange}
            onKeyPress={handlePress}
          />
        </label>
        <label htmlFor="userPassword" className="SU-entry">
          Password:
          <input
            className="SU-input"
            required
            type="password"
            name="userPassword"
            placeholder="ex. mypassword"
            onChange={handlePasswordChange}
            onKeyPress={handlePress}
          />
        </label>
        <label htmlFor="userPassword" className="SU-entry">
          Confirm Password:
          <input
            className="SU-input"
            required
            type="password"
            name="userPassword"
            placeholder="confirm password"
            onChange={handleConfirmChange}
            onKeyPress={handlePress}
          />
        </label>
        {error
          ? <p className="errorMessage">Passwords don&lsquo;t match</p>
          : <></>}
        <Button className="SU-submitBtn" text="Sign Up" onClick={() => submitNewUser()} disabled={disabled} />
        <span className="SU-logIn">
          Already have an account? Login
          {" "}
          <a href="login">HERE</a>
          !
        </span>
      </form>
    </div>
  );
};

export default SignUp;
