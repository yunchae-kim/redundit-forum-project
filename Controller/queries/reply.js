// post reply
const addReply = async (
  db,
  commentID,
  userID,
  content,
  image = null,
  audio = null,
  video = null,
) => {
  const query = 'INSERT INTO redundit.reply (idcomment, iduser, content, date, image, audio, video) VALUES(?, ?, ?, ?, ?, ?, ?)';
  const date = new Date().toISOString().slice(0, 19).replace('T', ' ');
  const params = [commentID, userID, content, date, image, audio, video];
  try {
    const [row] = await db.execute(query, params);
    return row.insertId;
  } catch (err) {
    throw new Error('Error executing the query');
  }
};

// get reply
const getReply = async (db, replyID) => {
  const query = 'SELECT * FROM redundit.reply WHERE idreply=?';
  const params = [replyID];
  try {
    const [row] = await db.execute(query, params);
    return row[0];
  } catch (err) {
    throw new Error('Error executing the query');
  }
};

// put reply
const updateReply = async (db, replyID, content, image = null, audio = null, video = null) => {
  const date = new Date().toISOString().slice(0, 19).replace('T', ' ');
  const query = 'UPDATE redundit.reply SET date=?, content=?, image=?, audio=?, video=? WHERE idreply=?';
  const params = [date, content, image, audio, video, replyID];
  try {
    const [row] = await db.execute(query, params);
    return row.affectedRows;
  } catch (err) {
    throw new Error('Error executing the query');
  }
};

// delete reply
const deleteReply = async (db, replyID) => {
  const query = 'DELETE FROM redundit.reply WHERE idreply=?';
  const params = [replyID];
  try {
    const [row] = await db.execute(query, params);
    return row.affectedRows;
  } catch (err) {
    throw new Error('Error executing the query');
  }
};

// retrieve all replies for a comment
const getReplyForComment = async (db, id) => {
  const query = 'SELECT * FROM redundit.reply WHERE idcomment=?';
  const params = [id];
  try {
    const [row] = await db.execute(query, params);
    return row[0];
  } catch (err) {
    throw new Error('Error executing the query');
  }
};

// retrieve all replie made by a user
const getAllRepliesByUser = async (db, id) => {
  const query = 'SELECT * FROM redundit.reply WHERE iduser=?';
  const params = [id];
  try {
    const [row] = await db.execute(query, params);
    return row;
  } catch (err) {
    throw new Error('Error executing the query');
  }
};

// get all replies that a user is mentioned in
const getAllRepliesUserMention = async (db, id) => {
  const query = `
  SELECT redundit.reply.idreply, redundit.reply.idcomment, redundit.reply.iduser, redundit.reply.content, redundit.reply.date, redundit.reply.image, redundit.reply.audio, redundit.reply.video
  FROM redundit.reply JOIN redundit.mention ON redundit.reply.idreply = redundit.mention.idreply
  WHERE redundit.mention.iduser=?`;
  const params = [id];
  try {
    const [row] = await db.execute(query, params);
    return row[0];
  } catch (err) {
    throw new Error('Error executing the query');
  }
};

module.exports = {
  addReply,
  getReply,
  updateReply,
  deleteReply,
  getReplyForComment,
  getAllRepliesByUser,
  getAllRepliesUserMention,
};
