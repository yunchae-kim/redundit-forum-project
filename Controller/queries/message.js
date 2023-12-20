// make chat group
const makeChatGroup = async (db, userID, name, isPrivate = false) => {
  const date = new Date().toISOString().slice(0, 19).replace('T', ' ');
  const query = 'INSERT INTO redundit.chat (iduser, name, timestamp, private) VALUES(?, ?, ?, ?)';
  const params = [userID, name, date, isPrivate];
  try {
    const [row] = await db.execute(query, params);
    return row.insertId;
  } catch (err) {
    throw new Error('Error executing the query');
  }
};

// update chat group
const updateChatGroup = async (db, chatID, name, isPrivate = false) => {
  const date = new Date().toISOString().slice(0, 19).replace('T', ' ');
  const query = 'UPDATE redundit.chat SET name=?, private=?, timestamp=? WHERE idchat=?';
  const params = [name, isPrivate, date, chatID];
  try {
    const [row] = await db.execute(query, params);
    return row.affectedRows;
  } catch (err) {
    throw new Error('Error executing the query');
  }
};

// delete chat group
const deleteChatGroup = async (db, chatID) => {
  const query = 'DELETE FROM redundit.chat WHERE idchat=?';
  const params = [chatID];
  try {
    const [row] = await db.execute(query, params);
    return row.affectedRows;
  } catch (err) {
    throw new Error('Error executing the query');
  }
};

// add user to chat group
const addUserToChatGroup = async (db, userID, chatID) => {
  const query = 'INSERT INTO redundit.chatgroup (iduser, idchat) VALUES(?, ?)';
  const params = [userID, chatID];
  try {
    const [row] = await db.execute(query, params);
    return row.affectedRows;
  } catch (err) {
    throw new Error('Error executing the query');
  }
};

// remove user from chat group
const removeUserFromChatGroup = async (db, userID, chatID) => {
  const query = 'DELETE FROM redundit.chatgroup WHERE iduser=? AND idchat=?';
  const params = [userID, chatID];
  try {
    const [row] = await db.execute(query, params);
    return row.affectedRows;
  } catch (err) {
    throw new Error('Error executing the query');
  }
};

// add message to chat group
const addMessageToChat = async (
  db,
  userID,
  chatID,
  content,
  image = null,
  audio = null,
  video = null,
) => {
  const query = 'INSERT INTO redundit.message (idsender, idchat, timestamp, content, image, audio, video) VALUES(?, ?, ?, ?, ?, ?, ?)';
  const date = new Date().toISOString().slice(0, 19).replace('T', ' ');
  const params = [userID, chatID, date, content, image, audio, video];
  try {
    const [row] = await db.execute(query, params);
    return row.affectedRows;
  } catch (err) {
    throw new Error('Error executing the query');
  }
};

// get all messages in a chat group
const getMessagesInChat = async (db, id) => {
  const query = `
  SELECT redundit.user.username, redundit.message.idsender, redundit.message.idchat, redundit.message.timestamp, redundit.message.content,
  redundit.message.image, redundit.message.video, redundit.message.audio
  FROM redundit.message JOIN redundit.user ON redundit.message.idsender = redundit.user.iduser
  WHERE redundit.message.idchat=? ORDER BY timestamp ASC`;
  const params = [id];
  try {
    const [row] = await db.execute(query, params);
    return row;
  } catch (err) {
    throw new Error('Error executing the query');
  }
};

// get all messages sent by a user in a chat group
const getMessagesInChatByUser = async (db, chatID, userID) => {
  const query = 'SELECT * FROM redundit.message WHERE idchat=? AND idsender=? ORDER BY timestamp ASC';
  const params = [chatID, userID];
  try {
    const [row] = await db.execute(query, params);
    return row;
  } catch (err) {
    throw new Error('Error executing the query');
  }
};

// get all chat groups a user is in
const getChatGroups = async (db, userID) => {
  const query = `
    SELECT * FROM redundit.chat
    WHERE redundit.chat.idchat IN (SELECT redundit.chat.idchat
    FROM redundit.chat JOIN redundit.chatgroup ON redundit.chat.idchat = redundit.chatgroup.idchat
    WHERE redundit.chatgroup.iduser = ?);`;
  const params = [userID];
  try {
    const [row] = await db.execute(query, params);
    return row;
  } catch (err) {
    throw new Error('Error executing the query');
  }
};


module.exports = {
  makeChatGroup,
  updateChatGroup,
  deleteChatGroup,
  addUserToChatGroup,
  removeUserFromChatGroup,
  addMessageToChat,
  getMessagesInChat,
  getMessagesInChatByUser,
  getChatGroups,
};
