/* eslint-disable max-len */
// add hashtag
const addHashtag = async (db, postID, commentID, replyID, hashtag) => {
  const query = 'INSERT INTO redundit.hashtag (idpost, idcomment, idreply, hashtag) VALUES(?, ?, ?, ?)';
  const params = [postID, commentID, replyID, hashtag];
  try {
    const [row] = await db.execute(query, params);
    return row.affectedRows;
  } catch (err) {
    throw new Error('Error executing the query');
  }
};

// get all hashtags for a post or comment or reply
const getHashtag = async (db, postID, commentID, replyID) => {
  const query = 'SELECT hashtag FROM redundit.hashtag WHERE idpost=? OR idcomment=? OR idreply=?';
  const params = [postID, commentID, replyID];
  try {
    const [row] = await db.execute(query, params);
    return row;
  } catch (err) {
    throw new Error('Error executing the query');
  }
};

// get all posts and comments with a specific hashtag
const getPostAndCommentByHashtag = async (db, hashtag) => {
  const query = 'SELECT * FROM redundit.hashtag WHERE hashtag=?';
  const params = [hashtag];
  try {
    const [row] = await db.execute(query, params);
    return row;
  } catch (err) {
    throw new Error('Error executing the query');
  }
};

// get all hashtags for a post
// const getHashtagForPost = async (db, id) => {
//   const query = 'SELECT * FROM redundit.hashtag WHERE idpost=?';
//   const params = [id];
//   try {
//     const row = await db.execute(query, params);
//     return row;
//   } catch (err) {
//     throw new Error('Error executing the query');
//   }
// };

// get all hashtags for a comment
// const getHashtagForComment = async (db, id) => {
//   const query = 'SELECT * FROM redundit.hashtag WHERE idcomment=?';
//   const params = [id];
//   try {
//     const row = await db.execute(query, params);
//     return row[0];
//   } catch (err) {
//     throw new Error('Error executing the query');
//   }
// };

// get all hashtags for a reply
// const getHashtagForReply = async (db, id) => {
//   const query = 'SELECT * FROM redundit.hashtag WHERE idreply=?';
//   const params = [id];
//   try {
//     const row = await db.execute(query, params);
//     return row[0];
//   } catch (err) {
//     throw new Error('Error executing the query');
//   }
// };

// delete a hashtag by post
const deleteHashtagByPost = async (db, idpost) => {
  const query = 'DELETE FROM redundit.hashtag WHERE idpost=?';
  const params = [idpost];
  try {
    const [row] = await db.execute(query, params);
    return row.affectedRows;
  } catch (err) {
    throw new Error('Error executing the query');
  }
};

// delete a hashtag by comment
const deleteHashtagByComment = async (db, idcomment) => {
  const query = 'DELETE FROM redundit.hashtag WHERE idcomment=?';
  const params = [idcomment];
  try {
    const [row] = await db.execute(query, params);
    return row.affectedRows;
  } catch (err) {
    throw new Error('Error executing the query');
  }
};

module.exports = {
  addHashtag, getHashtag, deleteHashtagByPost, getPostAndCommentByHashtag, deleteHashtagByComment,
};
