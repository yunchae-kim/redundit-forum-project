/* eslint-disable max-len */
const axios = require("axios");

// const domain = "http://localhost:5000";
const domain = "";

async function createPost(newPost) {
  try {
    const response = await axios.post(`${domain}/api/post`, newPost);
    if (response.status !== 201) {
      throw new Error(response.statusText);
    }
    const { data } = await response;
    return data.data;
  } catch (error) {
    throw new Error("Error creating a post");
  }
}

async function getAllPosts() {
  try {
    const response = await axios.get(`${domain}/api/posts`);
    if (response.status !== 200) {
      throw new Error(response.statusText);
    }
    const { data } = await response;
    return data.data;
  } catch (error) {
    throw new Error("Error getting all posts");
  }
}

async function getPostById(postId) {
  try {
    const response = await axios.get(`${domain}/api/post/${postId}`);
    if (response.status !== 200) {
      throw new Error(response.statusText);
    }
    const { data } = await response;
    return data.data;
  } catch (error) {
    throw new Error("Error getting a post");
  }
}

async function putPostById(postId, updatedPost) {
  try {
    const response = await axios.put(`${domain}/api/post/${postId}`, updatedPost);
    if (response.status !== 200) {
      throw new Error(response.statusText);
    }
    const { data } = await response;
    return data;
  } catch (error) {
    throw new Error("Error updating a post");
  }
}

async function deletePostById(postId) {
  try {
    const response = await axios.delete(`${domain}/api/post/${postId}`);
    if (response.status !== 200) {
      throw new Error(response.statusText);
    }
    const { data } = await response;
    return data;
  } catch (error) {
    throw new Error("Error deleteing a post");
  }
}

async function getAllPostsInGroup(groupId) {
  try {
    const response = await axios.get(`${domain}/api/group/${groupId}/posts`);
    if (response.status !== 200) {
      throw new Error(response.statusText);
    }
    const { data } = await response;
    return data.data;
  } catch (error) {
    throw new Error("Error getting posts of the group");
  }
}

async function getFlaggedPostsInGroup(groupId) {
  try {
    const response = await axios.get(`${domain}/api/group/${groupId}/flaggedposts`);
    if (response.status !== 200) {
      throw new Error(response.statusText);
    }
    const { data } = await response;
    return data.data;
  } catch (error) {
    throw new Error("Error getting posts of the group");
  }
}

async function getPostsByUser(userId) {
  try {
    const response = await axios.get(`${domain}/api/${userId}/posts`);
    if (response.status !== 200) {
      throw new Error(response.statusText);
    }
    const { data } = await response;
    return data;
  } catch (error) {
    throw new Error("Error getting posts of the user");
  }
}

async function flagPostById(postId, flag) {
  try {
    const putTarget = { flagged: flag };
    const response = await axios.put(`${domain}/api/post/flag/${postId}`, putTarget);
    if (response.status !== 200) {
      throw new Error(response.statusText);
    }
    const { data } = await response;
    return data;
  } catch (error) {
    throw new Error("Error flagging a post");
  }
}

export {
  createPost, getPostById, getAllPostsInGroup, putPostById, deletePostById, getAllPosts, getPostsByUser, getFlaggedPostsInGroup, flagPostById,
};
