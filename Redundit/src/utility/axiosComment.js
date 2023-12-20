const axios = require("axios");

// const domain = "http://localhost:5000";
const domain = "";

async function addComment(iduser, idpost, content, status = false) {
  try {
    const comment = {
      iduser,
      idpost,
      content,
      status,
    };
    const response = await axios.post(`${domain}/api/comment`, comment);

    if (response.status !== 201) {
      throw new Error(response.statusText);
    }
    const { data } = response;
    return data.data;
  } catch (err) {
    throw new Error("Error adding comment");
  }
}

async function getComment(commentID) {
  try {
    const response = await axios.get(`${domain}/api/comment/${commentID}`);
    if (response.status !== 200) {
      throw new Error(response.statusText);
    }
    const { data } = response;
    return data.data;
  } catch (err) {
    throw new Error("Error getting comment");
  }
}

async function updateComment(commentID, content, status, flagged, image, audio, video) {
  try {
    const comment = {
      content,
      status,
      flagged,
      image,
      audio,
      video,
    };
    const response = await axios.put(`${domain}/api/comment/${commentID}`, comment);
    if (response.status !== 200) {
      throw new Error(response.statusText);
    }
    return response;
  } catch (err) {
    throw new Error("Error updating comment");
  }
}

async function deleteComment(commentID) {
  try {
    const response = await axios.delete(`${domain}/api/comment/${commentID}`);
    if (response.status !== 200) {
      throw new Error(response.statusText);
    }
    return response;
  } catch (err) {
    throw new Error("Error deleting comment");
  }
}

async function getCommentByPost(postId) {
  try {
    const response = await axios.get(`${domain}/api/post/${postId}/comments`);
    if (response.status === 204) {
      return null;
    }
    if (response.status !== 200) {
      throw new Error(response.statusText);
    }
    const { data } = response;
    return data.data;
  } catch (err) {
    throw new Error("Error getting comments");
  }
}

export {
  addComment,
  getComment,
  updateComment,
  deleteComment,
  getCommentByPost,
};
