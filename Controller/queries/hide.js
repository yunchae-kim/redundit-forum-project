// post hide post
const addHidePost = async (
  db,
  userID,
  postID,
  groupID,
) => {
  const query = 'INSERT INTO redundit.hide (iduser ,idpost, idgroup) VALUES(?, ?, ?)';
  const params = [userID, postID, groupID];
  try {
    const [row] = await db.execute(query, params);
    return row.insertId;
  } catch (err) {
    throw new Error(err.message);
  }
};

// get hide post
const getHidePost = async (db, userID, groupID) => {
  const query = 'SELECT idpost FROM redundit.hide WHERE iduser=? AND idgroup=?';
  const params = [userID, groupID];
  try {
    const [row] = await db.execute(query, params);
    return row;
  } catch (err) {
    throw new Error('Error executing the query');
  }
};

// get hide count of a post
const getHideCount = async (db, postID) => {
  const query = 'SELECT * FROM redundit.hide WHERE idpost=?';
  const params = [postID];
  try {
    const [row] = await db.execute(query, params);
    return row;
  } catch (err) {
    throw new Error('Error executing the query');
  }
};

// delete notification
const deleteHide = async (db, userID, postID) => {
  const query = 'DELETE FROM redundit.hide WHERE iduser=? AND idpost=?';
  const params = [userID, postID];
  try {
    const [row] = await db.execute(query, params);
    return row.affectedRows;
  } catch (err) {
    throw new Error('Error executing the query');
  }
};

module.exports = {
  addHidePost, getHidePost, deleteHide, getHideCount,
};
