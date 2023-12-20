const axios = require("axios");

// const domain = "http://localhost:5000";
const domain = "";

async function addHashtag(tags, id, type) {
  if (tags.length === 0 || (type !== "post" && type !== "comment")) {
    return [];
  }
  try {
    const arr = [];
    await Promise.all(tags.map(async (tag) => {
      let postTarget;
      if (type === "post") {
        postTarget = { idpost: id, hashtag: tag };
      } else if (type === "comment") {
        postTarget = { idcomment: id, hashtag: tag };
      }
      const response = await axios.post(`${domain}/api/hashtag`, postTarget);
      if (response.status !== 200) {
        throw new Error(response.statusText);
      }
      // const { data } = await response;
      arr.push(tag);
    }));
    return arr;
  } catch (error) {
    throw new Error("Error creating a hashtag");
  }
}

async function getHashtag(id, type) {
  try {
    let getTarget;
    if (type === "post") {
      getTarget = { idpost: id };
    } else if (type === "comment") {
      getTarget = { idcomment: id };
    } else {
      throw new Error("Error getting a tag");
    }
    const response = await axios.get(`${domain}/api/hashtag`, { params: getTarget });
    if (response.status === 204) {
      return [];
    }
    if (response.status !== 200) {
      throw new Error(response.statusText);
    }
    const { data } = await response;
    return data.data;
  } catch (error) {
    throw new Error("Error getting a hashtag");
  }
}

async function deleteHashtagByPost(idpost) {
  try {
    const response = await axios.delete(`${domain}/api/hashtag/post/${idpost}`);
    if (response.status !== 200 && response.status !== 204) {
      throw new Error(response.statusText);
    }
    const { data } = await response;
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
}

async function deleteHashtagByComment(idcomment) {
  try {
    const response = await axios.delete(`${domain}/api/hashtag/comment/${idcomment}`);
    if (response.status !== 200 && response.status !== 204) {
      throw new Error(response.statusText);
    }
    const { data } = await response;
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
}

async function getPostAndCommentByTag(hashtag) {
  try {
    const response = await axios.get(`${domain}/api/hashtag/${hashtag}`);
    if (response.status === 204) {
      return [];
    }
    if (response.status !== 200) {
      throw new Error(response.statusText);
    }
    const { data } = await response;
    return data.data;
  } catch (error) {
    throw new Error("Error getting a hashtag");
  }
}

export {
  addHashtag, getHashtag, deleteHashtagByPost, deleteHashtagByComment, getPostAndCommentByTag,
};
