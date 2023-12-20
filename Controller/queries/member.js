// add a new group member
const addMember = async (db, userID, groupID, pending = false, admin = false) => {
  const query = 'INSERT INTO redundit.member (idgroup, iduser, pending, admin) VALUES(?, ?, ?, ?)';
  const params = [groupID, userID, pending, admin];
  try {
    const [row] = await db.execute(query, params);
    return row.affectedRows;
  } catch (err) {
    throw new Error('Error executing the query');
  }
};

// update a member
const updateMember = async (db, userID, groupID, pending = false, admin = false) => {
  const query = 'UPDATE redundit.member SET pending=?, admin=? WHERE iduser=? AND idgroup=?';
  const params = [pending, admin, userID, groupID];
  try {
    const [row] = await db.execute(query, params);
    return row.affectedRows;
  } catch (err) {
    throw new Error('Error executing the query');
  }
};

// delete a member
const deleteMember = async (db, userID, groupID) => {
  const query = 'DELETE FROM redundit.member WHERE iduser=? AND idgroup=?';
  const params = [userID, groupID];
  try {
    const [row] = await db.execute(query, params);
    return row.affectedRows;
  } catch (err) {
    throw new Error('Error executing the query');
  }
};

// get a member
const getMember = async (db, userID, groupID) => {
  const query = 'SELECT * FROM redundit.member WHERE iduser=? AND idgroup=?';
  const params = [userID, groupID];
  try {
    const [row] = await db.execute(query, params);
    return row[0];
  } catch (err) {
    throw new Error('Error executing the query');
  }
};

module.exports = {
  addMember, updateMember, deleteMember, getMember,
};
