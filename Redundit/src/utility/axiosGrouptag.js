const axios = require("axios");

// const domain = "http://localhost:5000";
const domain = "";

async function createGrouptags(tags, groupId) {
  if (tags.length === 0) {
    return [];
  }
  try {
    const arr = [];
    await Promise.all(tags.map(async (tag) => {
      const postTarget = { tag };
      const response = await axios.post(`${domain}/api/grouptag/${groupId}`, postTarget);
      if (response.status !== 200) {
        throw new Error(response.statusText);
      }
      // arr.push(response.config.data.tag);
      arr.push(tag);
    }));

    return arr;
  } catch (error) {
    throw new Error("Error creating a group tag");
  }
}

async function getGrouptags(groupId) {
  try {
    const response = await axios.get(`${domain}/api/grouptag/${groupId}`);
    if (response.status !== 200) {
      throw new Error(response.statusText);
    }
    const { data } = await response;
    return data.data;
  } catch (error) {
    throw new Error("Error getting a group");
  }
}

async function getGroupsByTag(tag) {
  try {
    const response = await axios.get(`${domain}/api/grouptag/tag/${tag}`);
    if (response.status === 204) {
      return [];
    }
    if (response.status !== 200) {
      throw new Error(response.statusText);
    }
    const { data } = await response;
    return data.data;
  } catch (error) {
    throw new Error("Error getting a group");
  }
}

export {
  createGrouptags, getGrouptags, getGroupsByTag,
};
