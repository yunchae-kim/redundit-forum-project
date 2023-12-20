const axios = require("axios");

// const domain = "http://localhost:5000";
const domain = "";

async function createGroup(name, isPrivate, editable, creator, description = "", icon = "dummy url") {
  try {
    const group = {
      name,
      icon,
      description,
      isPrivate,
      editable,
      creator,
    };
    const response = await axios.post(`${domain}/api/group`, group);
    if (response.status !== 201) {
      throw new Error(response.statusText);
    }
    const { data } = await response;
    return data.data;
  } catch (error) {
    throw new Error("Error creating a group");
  }
}

async function getPublicGroups() {
  try {
    const response = await axios.get(`${domain}/api/groups`);
    if (response.status !== 200) {
      throw new Error(response.statusText);
    }
    const { data } = await response;
    return data.data;
  } catch (error) {
    throw new Error("Error getting public groups");
  }
}

async function getGroupById(groupId) {
  try {
    const response = await axios.get(`${domain}/api/group/${groupId}`);
    if (response.status !== 200) {
      throw new Error(response.statusText);
    }
    const { data } = await response;
    return data.data;
  } catch (error) {
    throw new Error("Error getting a group");
  }
}

async function putGroupById(groupId, updatedGroup) {
  try {
    const response = await axios.put(`${domain}/api/group/${groupId}`, updatedGroup);
    if (response.status !== 200) {
      throw new Error(response.statusText);
    }
    const { data } = await response;
    return data.data;
  } catch (error) {
    throw new Error("Error updating a group");
  }
}

async function deleteGroupById(groupId) {
  try {
    const response = await axios.delete(`${domain}/api/group/${groupId}`);
    if (response.status !== 200) {
      throw new Error(response.statusText);
    }
    const { data } = await response;
    return data.data;
  } catch (error) {
    throw new Error("Error deleteing a group");
  }
}

async function getGroupsByUser(userId) {
  try {
    const response = await axios.get(`${domain}/api/user/${userId}/groups`);
    if (response.status !== 200) {
      throw new Error(response.statusText);
    }
    const { data } = await response;
    return data.data;
  } catch (error) {
    throw new Error("Error getting groups of the user");
  }
}

export {
  createGroup, getGroupById, getGroupsByUser, putGroupById, deleteGroupById, getPublicGroups,
};
