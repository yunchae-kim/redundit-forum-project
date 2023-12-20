const axios = require("axios");

// const domain = "http://localhost:5000";
const domain = "";

async function createChat(iduser, name, isPrivate) {
  try {
    const chat = {
      iduser,
      name,
      private: isPrivate,
    };
    const response = await axios.post(`${domain}/api/chat`, chat);
    if (response.status !== 201) {
      throw new Error(response.statusText);
    }
    const { data } = response;
    return data.data;
  } catch (err) {
    throw new Error("Error adding chat");
  }
}

async function updateChat(idchat, name, isPrivate) {
  try {
    const chat = {
      idchat,
      name,
      private: isPrivate,
    };
    const response = await axios.put(`${domain}/api/chat`, chat);
    if (response.status !== 200) {
      throw new Error(response.statusText);
    }
    const { data } = response;
    return data;
  } catch (err) {
    throw new Error("Error updating chat");
  }
}

async function deleteChat(idchat) {
  try {
    const chat = {
      idchat,
    };
    const response = await axios.delete(`${domain}/api/chat`, chat);
    if (response.status !== 200) {
      throw new Error(response.statusText);
    }
    const { data } = response;
    return data;
  } catch (err) {
    throw new Error("Error deleting chat");
  }
}

async function addUserToChat(chatID, iduser) {
  try {
    const chat = {
      iduser,
    };
    const response = await axios.post(`${domain}/api/chatgroup/${chatID}`, chat);
    if (response.status !== 200) {
      throw new Error(response.statusText);
    }
    const { data } = response;
    return data;
  } catch (err) {
    throw new Error("Error adding user to chat");
  }
}

async function removeUserFromChat(chatID, iduser) {
  try {
    const chat = {
      iduser,
    };
    const response = await axios.delete(`${domain}/api/chatgroup/${chatID}`, chat);
    if (response.status !== 200) {
      throw new Error(response.statusText);
    }
    const { data } = response;
    return data;
  } catch (err) {
    throw new Error("Error removing user from chat");
  }
}

async function addMessageToChat(chatID, iduser, content, image, audio, video) {
  try {
    const message = {
      iduser,
      content,
      image,
      audio,
      video,
    };
    const response = await axios.post(`${domain}/api/message/${chatID}`, message);
    if (response.status !== 200) {
      throw new Error(response.statusText);
    }
    const { data } = response;
    return data;
  } catch (err) {
    throw new Error("Error adding message to chat");
  }
}

async function getAllMessageInChat(chatID) {
  try {
    const response = await axios.get(`${domain}/api/message/${chatID}`);
    if (response.status !== 200) {
      throw new Error(response.statusText);
    }
    const { data } = response;
    return data;
  } catch (err) {
    throw new Error("Error getting messages in chat");
  }
}

async function getAllMessageInChatByUser(chatID, userID) {
  try {
    const response = await axios.get(`${domain}/api/message/${chatID}/user/${userID}`);
    if (response.status !== 200) {
      throw new Error(response.statusText);
    }
    const { data } = response;
    return data;
  } catch (err) {
    throw new Error("Error deleting chat");
  }
}

async function getAllChatgroups(userID) {
  try {
    const response = await axios.get(`${domain}/api/chatgroup/${userID}`);
    if (response.status !== 200) {
      throw new Error(response.statusText);
    }
    const { data } = response;
    return data;
  } catch (err) {
    throw new Error("Error deleting chat");
  }
}

export {
  createChat,
  updateChat,
  deleteChat,
  addUserToChat,
  removeUserFromChat,
  addMessageToChat,
  getAllMessageInChat,
  getAllMessageInChatByUser,
  getAllChatgroups,
};
