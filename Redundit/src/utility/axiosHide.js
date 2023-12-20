const axios = require("axios");

// const domain = "http://localhost:5000";
const domain = "";

async function addHide(userid, postid, groupid) {
  try {
    const hidden = {
      userid,
      postid,
      groupid,
    };
    const response = await axios.post(`${domain}/api/hide`, hidden);
    if (response.status !== 200) {
      throw new Error(response.statusText);
    }
    const { data } = await response;
    return data.data;
  } catch (error) {
    throw new Error(error.message);
  }
}

async function getHide(iduser, idgroup) {
  try {
    const response = await axios.get(`${domain}/api/hide/${iduser}/${idgroup}`);
    if (response.status !== 200) {
      throw new Error(response.statusText);
    }
    const { data } = await response;
    return data.data;
  } catch (error) {
    throw new Error(error.message);
  }
}

async function getHideCount(idpost) {
  try {
    const response = await axios.get(`${domain}/api/hideby/post/${idpost}`);
    if (response.status !== 200) {
      throw new Error(response.statusText);
    }
    const { data } = await response;
    return data.data;
  } catch (error) {
    throw new Error(error.message);
  }
}

async function deleteHide(iduser, idpost) {
  try {
    const response = await axios.delete(`${domain}/api/hide/${iduser}/${idpost}`);
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
  addHide, getHide, deleteHide, getHideCount,
};
