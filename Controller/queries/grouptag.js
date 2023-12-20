// add grouptag
const addGrouptag = async (db, groupID, tag) => {
  const query = 'INSERT INTO redundit.grouptag (idgroup, tag) VALUES(?, ?)';
  const params = [groupID, tag];
  try {
    const [row] = await db.execute(query, params);
    return row.affectedRows;
  } catch (err) {
    throw new Error('Error executing the query');
  }
};

// get all grouptags for a group
const getGrouptagForGroup = async (db, id) => {
  const query = 'SELECT * FROM redundit.grouptag WHERE idgroup=?';
  const params = [id];
  try {
    const [row] = await db.execute(query, params);
    return row;
  } catch (err) {
    throw new Error('Error executing the query');
  }
};

// delete a grouptag for a group
const deleteGrouptagForGroup = async (db, id, tag) => {
  const query = 'DELETE FROM redundit.grouptag WHERE idgroup=? AND tag=?';
  const params = [id, tag];
  try {
    const [row] = await db.execute(query, params);
    return row.affectedRows;
  } catch (err) {
    throw new Error('Error executing the query');
  }
};

// get all groups for a grouptag
const getGroupForGrouptag = async (db, tag) => {
  const query = 'SELECT * FROM redundit.grouptag WHERE tag=?';
  const params = [tag];
  try {
    const [row] = await db.execute(query, params);
    return row;
  } catch (err) {
    throw new Error('Error executing the query');
  }
};

module.exports = {
  addGrouptag, getGrouptagForGroup, deleteGrouptagForGroup, getGroupForGrouptag,
};
