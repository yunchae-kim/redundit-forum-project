// post comment
const addComment = async (
  db,
  userID,
  postID,
  content,
  status = false,
  flagged = false,
  image = null,
  audio = null,
  video = null,
) => {
  const query = 'INSERT INTO redundit.comment (iduser, idpost, date, content, status, flagged, image, audio, video) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)';
  const date = new Date().toISOString().slice(0, 19).replace('T', ' ');
  const params = [userID, postID, date, content, status, flagged, image, audio, video];
  try {
    const [row] = await db.execute(query, params);
    return row.insertId;
  } catch (err) {
    throw new Error('Error executing the query');
  }
};

// get comments
const getComments = async (db) => {
  const query = 'SELECT * FROM redundit.comment';
  try {
    const [row] = await db.execute(query);
    return row[0];
  } catch (err) {
    throw new Error('Error executing the query');
  }
};

// get comment
const getComment = async (db, commentID) => {
  const query = `
  SELECT redundit.comment.idcomment, redundit.comment.iduser, redundit.comment.idpost, redundit.comment.date, redundit.comment.content,
  redundit.comment.flagged, redundit.comment.image, redundit.comment.audio, redundit.comment.video, redundit.user.username, redundit.user.status
  FROM redundit.comment JOIN redundit.user ON redundit.comment.iduser = redundit.user.iduser
  WHERE redundit.comment.idcomment=?`;
  const params = [commentID];
  try {
    const [row] = await db.execute(query, params);
    return row[0];
  } catch (err) {
    throw new Error('Error executing the query');
  }
};

// put comment
const updateComment = async (
  db,
  commentID,
  content,
  status = false,
  flagged = false,
  image = null,
  audio = null,
  video = null,
) => {
  const date = new Date().toISOString().slice(0, 19).replace('T', ' ');
  const query = 'UPDATE redundit.comment SET date=?, content=?, status=?, flagged=?, image=?, audio=?, video=? WHERE idcomment=?';
  const params = [date, content, status, flagged, image, audio, video, commentID];
  try {
    const [row] = await db.execute(query, params);
    return row.affectedRows;
  } catch (err) {
    throw new Error('Error executing the query');
  }
};

// delete comment
const deleteComment = async (db, commentID) => {
  const query = 'DELETE FROM redundit.comment WHERE idcomment=?';
  const params = [commentID];
  try {
    const [row] = await db.execute(query, params);
    return row.affectedRows;
  } catch (err) {
    throw new Error('Error executing the query');
  }
};

// retrieve all comments for a post
const getAllCommentsInPost = async (db, id) => {
  const query = 'SELECT redundit.comment.idcomment, redundit.comment.iduser, redundit.comment.idpost, redundit.comment.date, redundit.comment.content, redundit.comment.flagged, redundit.comment.image, redundit.comment.audio, redundit.comment.video, redundit.user.status, redundit.user.username FROM redundit.comment JOIN redundit.user ON redundit.comment.iduser = redundit.user.iduser WHERE idpost=?';
  const params = [id];
  try {
    const [row] = await db.execute(query, params);
    return row;
  } catch (err) {
    throw new Error('Error executing the query');
  }
};

// retrieve all comments made by a user
const getAllCommentsByUser = async (db, id) => {
  const query = 'SELECT * FROM redundit.comment WHERE iduser=?';
  const params = [id];
  try {
    const [row] = await db.execute(query, params);
    return row;
  } catch (err) {
    throw new Error('Error executing the query');
  }
};

// get all comments that a user is mentioned in
const getAllCommentsUserMention = async (db, id) => {
  const query = `
  SELECT redundit.comment.idcomment, redundit.comment.iduser, redundit.comment.idpost, redundit.comment.date, redundit.comment.content, redundit.comment.status, redundit.comment.flagged,
  redundit.comment.image, redundit.comment.audio, redundit.comment.video
  FROM redundit.comment JOIN redundit.mention ON redundit.comment.idcomment = redundit.mention.idcomment
  WHERE redundit.mention.iduser=?`;
  const params = [id];
  try {
    const [row] = await db.execute(query, params);
    return row;
  } catch (err) {
    throw new Error('Error executing the query');
  }
};

module.exports = {
  addComment,
  getComments,
  getComment,
  updateComment,
  deleteComment,
  getAllCommentsInPost,
  getAllCommentsByUser,
  getAllCommentsUserMention,
};
