// add mention
const addMention = async (db, userID, postID, commentID, replyID) => {
  const query = 'INSERT INTO redundit.mention (idpost ,iduser, idreply, idcomment, hidden) VALUES(?, ?, ?, ?, ?)';
  const params = [postID, userID, replyID, commentID, false];
  try {
    const [row] = await db.execute(query, params);
    return row.affectedRows;
  } catch (err) {
    throw new Error('Error executing the query');
  }
};

// add mention to post
const addMentionToPost = async (db, userID, postID) => {
  const query = 'INSERT INTO redundit.mention (idpost ,iduser, idreply, idcomment, hidden) VALUES(?, ?, ?, ?, ?)';
  const params = [postID, userID, -1, -1, false];
  try {
    const [row] = await db.execute(query, params);
    return row.affectedRows;
  } catch (err) {
    throw new Error('Error executing the query');
  }
};

// add mention to comment
const addMentionToComment = async (db, userID, commentID) => {
  const query = 'INSERT INTO redundit.mention (idpost ,iduser, idreply, idcomment, hidden) VALUES(?, ?, ?, ?, ?)';
  const params = [-1, userID, -1, commentID, false];
  try {
    const [row] = await db.execute(query, params);
    return row.affectedRows;
  } catch (err) {
    throw new Error('Error executing the query');
  }
};

// add mention to reply
const addMentionToReply = async (db, userID, replyID) => {
  const query = 'INSERT INTO redundit.mention (idpost ,iduser, idreply, idcomment, hidden) VALUES(?, ?, ?, ?, ?)';
  const params = [-1, userID, replyID, -1, false];
  try {
    const [row] = await db.execute(query, params);
    return row.affectedRows;
  } catch (err) {
    throw new Error('Error executing the query');
  }
};

// delete mention
const deleteMention = async (db, userID, postID, commentID, replyID) => {
  const query = 'DELETE FROM redundit.mention WHERE iduser=? AND (idpost=? OR idcomment=? OR idreply=?)';
  const params = [userID, postID, commentID, replyID];
  try {
    const [row] = await db.execute(query, params);
    return row.affectedRows;
  } catch (err) {
    throw new Error('Error executing the query');
  }
};

// delete mention from post
const deleteMentionFromPost = async (db, postID, userID) => {
  const query = 'DELETE FROM redundit.mention WHERE idpost=? AND iduser=?';
  const params = [postID, userID];
  try {
    const [row] = await db.execute(query, params);
    return row[0];
  } catch (err) {
    throw new Error('Error executing the query');
  }
};

// delete mention from comment
const deleteMentionFromComment = async (db, commentID, userID) => {
  const query = 'DELETE FROM redundit.mention WHERE idcomment=? AND iduser=?';
  const params = [commentID, userID];
  try {
    const [row] = await db.execute(query, params);
    return row[0];
  } catch (err) {
    throw new Error('Error executing the query');
  }
};

// delete mention from reply
const deleteMentionFromReply = async (db, replyID, userID) => {
  const query = 'DELETE FROM redundit.mention WHERE idreply=? AND iduser=?';
  const params = [replyID, userID];
  try {
    const [row] = await db.execute(query, params);
    return row[0];
  } catch (err) {
    throw new Error('Error executing the query');
  }
};

// update mention
const updateMention = async (db, hidden, userID, postID, commentID, replyID) => {
  const query = 'UPDATE redundit.mention SET hidden=? WHERE iduser=? AND (idpost=? OR idcomment=? OR idreply=?)';
  const params = [hidden, userID, postID, commentID, replyID];
  try {
    const [row] = await db.execute(query, params);
    return row.affectedRows;
  } catch (err) {
    throw new Error('Error executing the query');
  }
};

// update mention from post
const updateMentionFromPost = async (db, postID, userID, hidden) => {
  const query = 'UPDATE redundit.mention SET hidden=? WHERE idpost=? AND iduser=?';
  const params = [hidden, postID, userID];
  try {
    const row = await db.execute(query, params);
    return row[0];
  } catch (err) {
    throw new Error('Error executing the query');
  }
};

// update mention from comment
const updateMentionFromComment = async (db, commentID, userID, hidden) => {
  const query = 'UPDATE redundit.mention SET hidden=? WHERE idcomment=? AND iduser=?';
  const params = [hidden, commentID, userID];
  try {
    const row = await db.execute(query, params);
    return row[0];
  } catch (err) {
    throw new Error('Error executing the query');
  }
};

// update mention from reply
const updateMentionFromReply = async (db, replyID, userID, hidden) => {
  const query = 'UPDATE redundit.mention SET hidden=? WHERE idreply=? AND iduser=?';
  const params = [hidden, replyID, userID];
  try {
    const row = await db.execute(query, params);
    return row[0];
  } catch (err) {
    throw new Error('Error executing the query');
  }
};

module.exports = {
  addMention,
  addMentionToPost,
  addMentionToComment,
  addMentionToReply,
  deleteMention,
  deleteMentionFromPost,
  deleteMentionFromComment,
  deleteMentionFromReply,
  updateMention,
  updateMentionFromPost,
  updateMentionFromComment,
  updateMentionFromReply,
};
