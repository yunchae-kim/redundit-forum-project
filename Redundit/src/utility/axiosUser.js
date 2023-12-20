const axios = require("axios");

// const domain = "http://localhost:5000";
const domain = "";

async function getAllUsersInGroup(groupId) {
  try {
    const response = await axios.get(`${domain}/api/group/${groupId}/users`);
    if (response.status !== 200) {
      throw new Error(response.statusText);
    }
    const { data } = await response;
    return data.data;
  } catch (error) {
    throw new Error("Error getting users of the group");
  }
}

async function getAllNonUsersInGroup(groupId) {
  try {
    const response = await axios.get(`${domain}/api/group/${groupId}/nonusers`);
    if (response.status !== 200) {
      throw new Error(response.statusText);
    }
    const { data } = await response;
    return data.data;
  } catch (error) {
    throw new Error(error.message);
  }
}

async function getUserById(userId) {
  try {
    const response = await axios.get(`${domain}/api/user/${userId}`);
    if (response.status !== 200) {
      throw new Error(response.statusText);
    }
    const { data } = await response;
    return data.data;
  } catch (error) {
    throw new Error("Error getting the user");
  }
}

async function getUserByName(userName) {
  try {
    const response = await axios.get(`${domain}/api/username/${userName}`);
    if (response.status === 204) {
      return null;
    }
    if (response.status !== 200) {
      throw new Error(response.statusText);
    }
    const { data } = await response;
    return data.data;
  } catch (error) {
    throw new Error("Error getting the user");
  }
}

async function putUserById(userId, userName, password, status, imageUrl, changePassword) {
  try {
    const updatedUser = {
      userid: userId,
      username: userName,
      email: "dummy@email.com",
      password,
      changePassword,
      status,
      image: imageUrl,
    };
    const response = await axios.put(`${domain}/api/user/${userId}`, updatedUser);
    if (response.status !== 200) {
      throw new Error(response.statusText);
    }
    const { data } = await response;
    return data.data;
  } catch (error) {
    throw new Error(error.message);
  }
}

export {
  getAllUsersInGroup, getAllNonUsersInGroup, getUserById, putUserById, getUserByName,
};
