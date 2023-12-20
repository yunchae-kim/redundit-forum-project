const axios = require("axios");

// const domain = "http://localhost:5000";
const domain = "";

async function addNotification(userid, notification) {
  try {
    const notif = {
      userid,
      notification,
    };
    const response = await axios.post(`${domain}/api/notification`, notif);
    if (response.status !== 200) {
      throw new Error(response.statusText);
    }
    const { data } = await response;
    return data.data;
  } catch (error) {
    throw new Error("Error adding a member to a group");
  }
}

async function getNotification(iduser) {
  try {
    const response = await axios.get(`${domain}/api/notification/${iduser}`);
    if (response.status !== 200) {
      throw new Error(response.statusText);
    }
    const { data } = await response;
    return data.data;
  } catch (error) {
    throw new Error(error.message);
  }
}

async function deleteNotification(idnotification) {
  try {
    const response = await axios.delete(`${domain}/api/notification/${idnotification}`);
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
  addNotification, getNotification, deleteNotification,
};
