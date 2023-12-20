import axios from "axios";
import jwtDecode from "jwt-decode";

const tokenName = "user";
// const domain = "http://localhost:5000";
const domain = "";

const httpClient = axios.create();

httpClient.login = async (username, password) => {
  try {
    const user = {
      username,
      password,
    };
    const response = await axios.post(`${domain}/api/session`, user);

    if (response.status !== 200) {
      throw new Error(response.statusText);
    }
    const { data } = response;
    if (data.token) {
      httpClient.setToken(data.token);
      return jwtDecode(data.token);
    }
    return false;
  } catch (err) {
    throw new Error("Error logging in");
  }
};

httpClient.signUp = async (username, password, email = "dummy@email.com", image = "dummyURL") => {
  try {
    const user = {
      username,
      password,
      email,
      image,
    };
    const response = await axios.post(`${domain}/api/user`, user);

    if (response.status !== 201) {
      throw new Error(response.statusText);
    }
    const { data } = response;
    return data;
  } catch (err) {
    throw new Error("Error adding new user");
  }
};

httpClient.getToken = () => (sessionStorage.getItem(tokenName));

httpClient.setToken = (token) => {
  sessionStorage.setItem(tokenName, token);
  return token;
};

httpClient.getCurrentUser = () => {
  const token = httpClient.getToken();
  if (token) return jwtDecode(token);
  return null;
};

httpClient.logOut = () => {
  sessionStorage.removeItem(tokenName);
  return true;
};

httpClient.getLockout = async (username) => {
  try {
    const response = await axios.get(`${domain}/api/lockout/${username}`);

    if (response.status !== 200) {
      throw new Error(response.statusText);
    }
    const { data } = response;
    return data;
  } catch (err) {
    throw new Error("Error with lockout");
  }
};

httpClient.addLockout = async (username) => {
  try {
    const user = {
      username,
    };
    const response = await axios.post(`${domain}/api/lockout`, user);

    if (response.status !== 201) {
      throw new Error(response.statusText);
    }
    const { data } = response;
    return data;
  } catch (err) {
    throw new Error("Error with lockout");
  }
};

httpClient.updateLockout = async (username) => {
  try {
    const user = {
      username,
    };
    const response = await axios.put(`${domain}/api/lockout`, user);

    if (response.status !== 200) {
      throw new Error(response.statusText);
    }
    const { data } = response;
    return data;
  } catch (err) {
    throw new Error("Error with lockout");
  }
};

httpClient.setLockout = async (username) => {
  try {
    const user = {
      username,
    };
    const response = await axios.put(`${domain}/api/lockout/lock`, user);

    if (response.status !== 200) {
      throw new Error(response.statusText);
    }
    const { data } = response;
    return data;
  } catch (err) {
    throw new Error("Error with lockout");
  }
};

httpClient.resetLockout = async (username) => {
  try {
    const user = {
      username,
    };
    const response = await axios.put(`${domain}/api/lockout/reset`, user);

    if (response.status !== 200) {
      throw new Error(response.statusText);
    }
    const { data } = response;
    return data;
  } catch (err) {
    throw new Error("Error with lockout");
  }
};

export default httpClient;
