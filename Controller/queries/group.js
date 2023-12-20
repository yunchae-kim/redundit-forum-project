// post group
const addGroup = async (
  db,
  name,
  creator,
  icon = null,
  description = null,
  isisPrivate = false,
  editable = true,
) => {
  const query = 'INSERT INTO redundit.group (name ,icon, description, private, editable, creator) VALUES(?, ?, ?, ?, ?, ?)';
  const params = [name, icon, description, isisPrivate, editable, creator];
  try {
    const [row] = await db.execute(query, params);
    return row.insertId;
  } catch (err) {
    throw new Error('Error executing the query');
  }
};

// get groups
const getGroups = async (db) => {
  const query = `
    SELECT redundit.group.idgroup, redundit.group.name, redundit.group.icon, redundit.group.description,
    redundit.group.private, redundit.group.editable, redundit.group.creator, redundit.user.username
    FROM redundit.group JOIN redundit.user ON redundit.group.creator = redundit.user.iduser
    WHERE redundit.group.private <> 1`;
  try {
    const [row] = await db.execute(query);
    return row;
  } catch (err) {
    throw new Error('Error executing the query');
  }
};

// get group
const getGroup = async (db, groupID) => {
  const query = `
    SELECT redundit.group.idgroup, redundit.group.name, redundit.group.icon, redundit.group.description,
    redundit.group.private, redundit.group.editable, redundit.group.creator, redundit.user.username
    FROM redundit.group JOIN redundit.user ON redundit.group.creator = redundit.user.iduser
    WHERE redundit.group.idgroup=?`;
  const params = [groupID];
  try {
    const [row] = await db.execute(query, params);
    return row[0];
  } catch (err) {
    throw new Error('Error executing the query');
  }
};

// put group
const updateGroup = async (
  db,
  groupID,
  icon = null,
  description = null,
  isPrivate = false,
  editable = true,
) => {
  const query = 'UPDATE redundit.group SET icon=?, description=?, private=?, editable=? WHERE idgroup=?';
  const params = [icon, description, isPrivate, editable, groupID];
  try {
    const [row] = await db.execute(query, params);
    return row.affectedRows;
  } catch (err) {
    throw new Error('Error executing the query');
  }
};

// delete group
const deleteGroup = async (db, groupID) => {
  const query = 'DELETE FROM redundit.group WHERE idgroup=?';
  const params = [groupID];
  try {
    const [row] = await db.execute(query, params);
    return row.affectedRows;
  } catch (err) {
    throw new Error('Error executing the query');
  }
};

// retrieve all groups a user is in
const getGroupsByUser = async (db, id) => {
  const query = `
  SELECT redundit.group.idgroup, redundit.group.name, redundit.group.icon, redundit.group.description, redundit.group.private, redundit.group.editable
  FROM redundit.group JOIN redundit.member ON redundit.group.idgroup = redundit.member.idgroup
  WHERE redundit.member.iduser=?`;
  const params = [id];
  try {
    const [row] = await db.execute(query, params);
    return row;
  } catch (err) {
    throw new Error('Error executing the query');
  }
};

module.exports = {
  addGroup, getGroups, getGroup, updateGroup, deleteGroup, getGroupsByUser,
};
