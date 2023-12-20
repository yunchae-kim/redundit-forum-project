// post notification
const addNotification = async (
  db,
  userID,
  contents,
) => {
  const query = 'INSERT INTO redundit.notification (iduser ,notification) VALUES(?, ?)';
  const params = [userID, contents];
  try {
    const [row] = await db.execute(query, params);
    return row.insertId;
  } catch (err) {
    throw new Error('Error executing the query');
  }
};

// get notifications
const getNotifications = async (db, userID) => {
  const query = 'SELECT * FROM redundit.notification WHERE iduser=?';
  const params = [userID];
  try {
    const [row] = await db.execute(query, params);
    return row;
  } catch (err) {
    throw new Error('Error executing the query');
  }
};

// delete notification
const deleteNotification = async (db, notificationID) => {
  const query = 'DELETE FROM redundit.notification WHERE idnotification=?';
  const params = [notificationID];
  try {
    const [row] = await db.execute(query, params);
    return row.affectedRows;
  } catch (err) {
    throw new Error('Error executing the query');
  }
};

module.exports = {
  addNotification, getNotifications, deleteNotification,
};
