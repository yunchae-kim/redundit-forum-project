const axios = require("axios");

// const domain = "http://localhost:5000";
const domain = "";

async function addReply(commentID, userID, content, image, audio, video) {
  try {
    const reply = {
      commentID,
      userID,
      content,
      image,
      audio,
      video
    };
    const response = await axios.post(`${domain}/api/reply`, reply);
    if (response.status !== 201) {
      throw new Error(response.statusText);
    }
    const { data } = response;
    return data;
  } catch (err) {
    throw new Error("Error adding reply");
  }
}

async function getReply(replyID) {
  try {
    const response = await axios.get(`${domain}/api/reply/${replyID}`);
    if (response.status !== 200) {
      throw new Error(response.statusText);
    }
    const { data } = response;
    return data;
  } catch (err) {
    throw new Error("Error getting reply");
  }
}

async function updateReply(replyID, content, image, audio, video) {
  try {
    const reply = {
      content,
      image,
      audio,
      video,
    }
    const response = await axios.put(`${domain}/api/reply/${replyID}`, reply);
    if (response.status !== 200) {
      throw new Error(response.statusText);
    }
    return response;
  } catch (err) {
    throw new Error("Error updating reply");
  }
}

async function deleteReply(replyID) {
  try {
    const response = await axios.delete(`${domain}/api/reply/${replyID}`);
    if (response.status !== 200) {
      throw new Error(response.statusText);
    }
    return response;
  } catch (err) {
    throw new Error("Error deleting comment");
  }
}

export {
  addReply, getReply, updateReply, deleteReply,
};
