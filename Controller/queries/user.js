// get all users
const getUsers = async (db) => {
  const query = 'SELECT * FROM redundit.user';
  try {
    const row = await db.execute(query);
    return row[0];
  } catch (err) {
    throw new Error('Error executing the query');
  }
};

// post user
const addUser = async (db, username, password, email = 'dummy@email.com', image = null) => {
  const date = new Date().toISOString().slice(0, 19).replace('T', ' ');
  const params = [username, password, email, date, image];
  const query = 'INSERT INTO redundit.user (username ,password, email, joindate, image, status) VALUES(?, ?, ?, ?, ?, 1)';
  try {
    const [row] = await db.execute(query, params);
    return row.insertId;
  } catch (err) {
    throw new Error('Error executing the query');
  }
};

// get user
const getUser = async (db, userID) => {
  const query = 'SELECT * FROM redundit.user WHERE iduser=?';
  const params = [userID];
  try {
    const [row] = await db.execute(query, params);
    return row[0];
  } catch (err) {
    throw new Error('Error user not found');
  }
};

const getUserByName = async (db, username) => {
  const query = 'SELECT * FROM redundit.user WHERE username=?';
  const params = [username];
  try {
    const [row] = await db.execute(query, params);
    return row[0];
  } catch (err) {
    throw new Error('Error user not found');
  }
};

// put user
const updateUser = async (db, userID, password, email, image = 'dummyURL', status = 0) => {
  const query = 'UPDATE redundit.user SET password=?, email=?, image=?, status=? WHERE iduser=?';
  const params = [password, email, image, status, userID];
  try {
    const [row] = await db.execute(query, params);
    return row.affectedRows;
  } catch (err) {
    throw new Error(err.message);
  }
};

// delete user
const deleteUser = async (db, userID) => {
  const query = 'DELETE FROM redundit.user WHERE iduser=?';
  const params = [userID];
  try {
    const [row] = await db.execute(query, params);
    return row.affectedRows;
  } catch (err) {
    throw new Error('Error executing the query');
  }
};

// retrieve all users in a group
const getAllUsersInGroup = async (db, id) => {
  const query = `
  SELECT redundit.user.iduser, redundit.user.username, redundit.user.email, redundit.user.joindate, redundit.user.image, redundit.member.pending, redundit.member.admin
  FROM redundit.user JOIN redundit.member ON redundit.user.iduser = redundit.member.iduser
  WHERE redundit.member.idgroup=?`;
  const params = [id];
  try {
    const [row] = await db.execute(query, params);
    return row;
  } catch (err) {
    throw new Error('Error executing the query');
  }
};

// retrieve all nonusers in a group
const getAllNonUsersInGroup = async (db, id) => {
  const query = `
  SELECT redundit.user.iduser, redundit.user.username, redundit.user.email, redundit.user.joindate, redundit.user.image
  FROM redundit.user WHERE
  redundit.user.iduser NOT IN (SELECT redundit.member.iduser FROM redundit.member WHERE redundit.member.idgroup=?)`;
  const params = [id];
  try {
    const [row] = await db.execute(query, params);
    return row;
  } catch (err) {
    throw new Error('Error executing the query');
  }
};

// get all users that are mentioned in a post
const getAllUsersPostMention = async (db, id) => {
  const query = `
  SELECT redundit.user.iduser, redundit.user.username, redundit.user.email, redundit.user.joindate, redundit.user.image
  FROM redundit.user JOIN redundit.mention ON redundit.user.iduser = redundit.mention.iduser
  WHERE redundit.mention.idpost=?`;
  const params = [id];
  try {
    const [row] = await db.execute(query, params);
    return row;
  } catch (err) {
    throw new Error('Error executing the query');
  }
};

// get all users that are mentioned in a comment
const getAllUsersCommentMention = async (db, id) => {
  const query = `
  SELECT redundit.user.iduser, redundit.user.username, redundit.user.email, redundit.user.joindate, redundit.user.image
  FROM redundit.user JOIN redundit.mention ON redundit.user.iduser = redundit.mention.iduser
  WHERE redundit.mention.idcomment=?`;
  const params = [id];
  try {
    const [row] = await db.execute(query, params);
    return row[0];
  } catch (err) {
    throw new Error('Error executing the query');
  }
};

// get all users that are mentioned in a reply
const getAllUsersReplyMention = async (db, id) => {
  const query = `
  SELECT redundit.user.iduser, redundit.user.username, redundit.user.email, redundit.user.joindate, redundit.user.image
  FROM redundit.user JOIN redundit.mention ON redundit.user.iduser = redundit.mention.iduser
  WHERE redundit.mention.idreply=?`;
  const params = [id];
  try {
    const [row] = await db.execute(query, params);
    return row[0];
  } catch (err) {
    throw new Error('Error executing the query');
  }
};

// get all users in a chat group
const getAllUsersInChat = async (db, id) => {
  const query = `
  SELECT redundit.user.iduser, redundit.user.username, redundit.user.email, redundit.user.joindate, redundit.user.image
  FROM redundit.user JOIN redundit.chatgroup ON redundit.user.iduser = redundit.chatgroup.iduser
  WHERE redundit.chatgroup.idchat=?`;
  const params = [id];
  try {
    const [row] = await db.execute(query, params);
    return row[0];
  } catch (err) {
    throw new Error('Error executing the query');
  }
};

const getLockout = async (db, username) => {
  const query = 'SELECT * from redundit.lockout WHERE username = ?';
  const params = [username];
  try {
    const [row] = await db.execute(query, params);
    return row[0];
  } catch (err) {
    throw new Error('Error executing the query');
  }
};

const addLockout = async (db, username) => {
  const date = new Date().toISOString().slice(0, 19).replace('T', ' ');
  const params = [username, 1, date];
  const query = 'INSERT INTO redundit.lockout (username ,attempts, timestamp) VALUES(?, ?, ?)';
  try {
    const [row] = await db.execute(query, params);
    return row.insertId;
  } catch (err) {
    throw new Error('Error executing the query');
  }
};

const updateLockout = async (db, username) => {
  const date = new Date().toISOString().slice(0, 19).replace('T', ' ');
  const query = 'UPDATE redundit.lockout SET attempts=attempts + 1, timestamp=? WHERE username=?';
  const params = [date, username];
  try {
    const [row] = await db.execute(query, params);
    return row.affectedRows;
  } catch (err) {
    throw new Error('Error executing the query');
  }
};

const setLockout = async (db, username) => {
  const date = new Date().toISOString().slice(0, 19).replace('T', ' ');
  const query = 'UPDATE redundit.lockout SET locked=1, timestamp=? WHERE username=?';
  const params = [date, username];
  try {
    const [row] = await db.execute(query, params);
    return row.affectedRows;
  } catch (err) {
    throw new Error('Error executing the query');
  }
};

const resetLockout = async (db, username) => {
  const date = new Date().toISOString().slice(0, 19).replace('T', ' ');
  const query = 'UPDATE redundit.lockout SET attempts=0, locked=0, timestamp=? WHERE username=?';
  const params = [date, username];
  try {
    const [row] = await db.execute(query, params);
    return row.affectedRows;
  } catch (err) {
    throw new Error('Error executing the query');
  }
};

module.exports = {
  getUsers,
  addUser,
  getUser,
  getUserByName,
  updateUser,
  deleteUser,
  getAllUsersInGroup,
  getAllNonUsersInGroup,
  getAllUsersPostMention,
  getAllUsersCommentMention,
  getAllUsersReplyMention,
  getAllUsersInChat,
  getLockout,
  addLockout,
  updateLockout,
  setLockout,
  resetLockout,
};
