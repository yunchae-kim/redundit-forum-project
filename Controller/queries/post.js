// post post
const addPost = async (
  db,
  userID,
  groupID,
  title,
  content,
  status = false,
  flagged = false,
  image = null,
  audio = null,
  video = null,
) => {
  const query = 'INSERT INTO redundit.post (iduser, idgroup, title, date, content, status, flagged, image, audio, video) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
  const date = new Date().toISOString().slice(0, 19).replace('T', ' ');
  const params = [userID, groupID, title, date, content, status, flagged, image, audio, video];
  try {
    const [row] = await db.execute(query, params);
    return row.insertId;
  } catch (err) {
    throw new Error('Error executing the query');
  }
};

// get posts
const getPosts = async (db) => {
  const query = 'SELECT * FROM redundit.post';
  try {
    const [row] = await db.execute(query);
    return row;
  } catch (err) {
    throw new Error('Error executing the query');
  }
};

// get post
const getPost = async (db, postID) => {
  const query = 'SELECT redundit.post.idpost, redundit.post.iduser, redundit.post.idgroup, redundit.post.title, redundit.post.date, redundit.post.content, redundit.post.flagged, redundit.post.image, redundit.post.audio, redundit.post.video, redundit.user.username, redundit.user.status FROM redundit.post JOIN redundit.user ON redundit.post.iduser = redundit.user.iduser WHERE idpost=?';
  const params = [postID];
  try {
    const [row] = await db.execute(query, params);
    return row[0];
  } catch (err) {
    throw new Error('Error executing the query');
  }
};

// put post
const updatePost = async (
  db,
  postID,
  title,
  content,
  status = false,
  flagged = false,
  image = null,
  audio = null,
  video = null,
) => {
  const query = 'UPDATE redundit.post SET title=?, content=?, status=?, flagged=?, image=?, audio=?, video=? WHERE idpost=?';
  const params = [title, content, status, flagged, image, audio, video, postID];
  try {
    const [row] = await db.execute(query, params);
    return row.affectedRows;
  } catch (err) {
    throw new Error('Error executing the query');
  }
};

// flag post
const flagPost = async (
  db,
  flagged,
  postID,
) => {
  const query = 'UPDATE redundit.post SET flagged=? WHERE idpost=?';
  const params = [flagged, postID];
  try {
    const [row] = await db.execute(query, params);
    return row.affectedRows;
  } catch (err) {
    throw new Error('Error executing the query');
  }
};

// delete post
const deletePost = async (db, postID) => {
  const query = 'DELETE FROM redundit.post WHERE idpost=?';
  const params = [postID];
  try {
    const [row] = await db.execute(query, params);
    return row.affectedRows;
  } catch (err) {
    throw new Error('Error executing the query');
  }
};

// retreive all posts in a group
const getAllPostsInGroup = async (db, id) => {
  const query = 'SELECT * FROM redundit.post WHERE idgroup=?';
  const params = [id];
  try {
    const [row] = await db.execute(query, params);
    return row;
  } catch (err) {
    throw new Error('Error executing the query');
  }
};

// retrieve all posts made by a user
const getAllPostsByUser = async (db, id) => {
  const query = 'SELECT * FROM redundit.post WHERE iduser=?';
  const params = [id];
  try {
    const [row] = await db.execute(query, params);
    return row;
  } catch (err) {
    throw new Error('Error executing the query');
  }
};

// get all posts that a user is mentioned in
const getAllPostsUserMention = async (db, id) => {
  const query = `
  SELECT redundit.post.idpost, redundit.post.iduser, redundit.post.idgroup, redundit.post.title, redundit.post.date, redundit.post.content, redundit.post.status,
  redundit.post.flagged, redundit.post.image, redundit.post.audio, redundit.post.video
  FROM redundit.post JOIN redundit.mention ON redundit.post.idpost = redundit.mention.idpost
  WHERE redundit.mention.iduser=?`;
  const params = [id];
  try {
    const [row] = await db.execute(query, params);
    return row;
  } catch (err) {
    throw new Error('Error executing the query');
  }
};

// get flagged post
const getFlaggedPostsInGroup = async (db, id) => {
  const query = 'SELECT redundit.post.idpost, redundit.post.iduser, redundit.post.idgroup, redundit.post.title, redundit.post.date, redundit.post.content, redundit.post.status, redundit.post.flagged, redundit.post.image, redundit.post.audio, redundit.post.video, redundit.user.username FROM redundit.post JOIN redundit.user ON redundit.post.iduser = redundit.user.iduser WHERE idgroup=? AND flagged=1';
  const params = [id];
  try {
    const [row] = await db.execute(query, params);
    return row;
  } catch (err) {
    throw new Error('Error executing the query');
  }
};

module.exports = {
  addPost,
  getPosts,
  getPost,
  updatePost,
  deletePost,
  getAllPostsInGroup,
  getAllPostsByUser,
  getAllPostsUserMention,
  getFlaggedPostsInGroup,
  flagPost,
};
