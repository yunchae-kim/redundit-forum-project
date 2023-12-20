/* eslint-disable max-len */
// express app
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const passport = require('passport');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');
const { strategy, serialize, deserialize } = require('./services/passport');

const saltRounds = 10;
// database
const lib = require('./database');
// queries
const userQ = require('./queries/user');
const commentQ = require('./queries/comment');
const groupQ = require('./queries/group');
const grouptagQ = require('./queries/grouptag');
const hashtagQ = require('./queries/hashtag');
const memberQ = require('./queries/member');
const mentionQ = require('./queries/mention');
const messageQ = require('./queries/message');
const postQ = require('./queries/post');
const replyQ = require('./queries/reply');
const notificationQ = require('./queries/notification');
const hideQ = require('./queries/hide');

const app = express();

app.use(cors());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  }),
);
passport.use(strategy);
passport.serializeUser(serialize);
passport.deserializeUser(deserialize);
app.use(passport.initialize());

// database connection instance
let db;
app.use(express.static(path.join(__dirname, '../Redundit/build')));

// Start server and connect to database
const port = process.env.PORT || 5000;

app.listen(port, async () => {
  db = await lib.connect();
  console.log(`Server running on port:${port}`);
});

/**
* Endpoint to log-in a user to the webapp, the username and password
* is expected to be in the body of the http request. The password is hashed
* for and compared to the password in the backend for authetnication.
* If authentication is succesful, a jwt token is included in the response.
* If authentication is unsuccesful a 401 Unauthorized response is returned.
* Else a 409 Confict response is returned.
*/
app.post('/api/session', async (req, res) => {
  try {
    if (req.body.username === undefined || req.body.password === undefined) {
      res.status(400).json({ error: 'invalid input, object invalid' });
      return;
    }
    const result = await userQ.getUserByName(db, req.body.username);
    const match = bcrypt.compareSync(req.body.password, result.password);
    if (match) {
      const token = jwt.sign(
        {
          iduser: result.iduser,
          username: result.username,
        },
        process.env.JWT_KEY,
      );
      res.status(200).json({ iduser: result.iduser, username: result.username, token });
    } else {
      res.status(401).json({ msg: 'Incorrect Password' });
    }
  } catch (err) {
    res.status(409).json({ error: err.message });
  }
});

/**
* Endpoint to create a new user in the backend, the username and password
* is expected to be in the body of the http request. The password is hashed
* for security and the hash of the password is stored in the backend. On
* success a 201 Created response is returned, else a 409 Conflict response
* is returned.
*/
app.post('/api/user', async (req, res) => {
  try {
    if (req.body.username === undefined || req.body.password === undefined) {
      res.status(400).json({ error: 'invalid input, object invalid' });
      return;
    }
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(req.body.password, salt);
    const result = await userQ.addUser(db, req.body.username, hash, req.body.email, req.body.image);
    res.status(201).json({ data: result });
  } catch (err) {
    res.status(409).json({ error: err.message });
  }
});

/**
* Endpoint to retrieve all users in the backend.
*/
app.get('/api/users', async (req, res) => {
  try {
    const results = await userQ.getUsers(db);
    res.status(200).json({ data: results });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

/**
* Endpoint to retrieve a user in the backend by a user id. The user id
* is expected as a parameter in the url.
*/
app.get('/api/user/:userid', async (req, res) => {
  try {
    if (req.params.userid === undefined) {
      res.status(400).json({ error: 'user ID is missing' });
      return;
    }
    const result = await userQ.getUser(db, req.params.userid);
    if (result === undefined) {
      res.status(404).json({ error: 'player not found' });
      return;
    }
    res.status(200).json({ data: result });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

/**
* Endpoint to retrieve a user in the backend by a user name. The user name
* is expected as a parameter in the url.
*/
app.get('/api/username/:username', async (req, res) => {
  try {
    if (req.params.username === undefined) {
      res.status(400).json({ error: 'user name is missing' });
      return;
    }
    const result = await userQ.getUserByName(db, req.params.username);
    if (result === undefined) {
      res.status(204).json({ data: {} });
      return;
    }
    res.status(200).json({ data: result });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

/**
* Endpoint to update a user in the backend by a user id. The user id
* is expected as a parameter in the url, and the updated parameters (password,
* email, image) are in the body of the request.
*/
app.put('/api/user/:userid', async (req, res) => {
  try {
    if (req.params.userid === undefined) {
      res.status(400).json({ error: 'user ID is missing' });
      return;
    }
    if (req.body.password === undefined) {
      res.status(400).json({ error: 'invalid input, object invalid' });
      return;
    }
    let password;
    if (req.body.changePassword) {
      const salt = bcrypt.genSaltSync(saltRounds);
      password = bcrypt.hashSync(req.body.password, salt);
    } else {
      password = req.body.password;
    }
    const result = await userQ.updateUser(
      db,
      req.params.userid,
      password,
      req.body.email,
      req.body.image,
      req.body.status,
    );
    if (Number(result) === 0) {
      res.status(404).json({ error: 'player not found' });
      return;
    }
    if (result === 1) {
      res.status(200).json({ message: 'player updated successfully' });
    }
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

/**
* Endpoint to delete a user in the backend by a user id. The user id
* is expected as a parameter in the url.
*/
app.delete('/api/user/:userid', async (req, res) => {
  try {
    if (req.params.userid === undefined) {
      res.status(400).json({ error: 'user ID is missing' });
      return;
    }
    const result = await userQ.deleteUser(db, req.params.userid);
    if (Number(result) === 0) {
      res.status(404).json({ error: 'player not found' });
      return;
    }
    if (result === 1) {
      res.status(200).json({ message: 'player deleted successfully' });
    }
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

/**
* Endpoint to get all groups a user belongs to. The user id
* is expected as a parameter in the url.
*/
app.get('/api/user/:userid/groups', async (req, res) => {
  try {
    if (req.params.userid === undefined) {
      res.status(400).json({ error: 'user ID is missing' });
      return;
    }
    const result = await groupQ.getGroupsByUser(db, req.params.userid);
    res.status(200).json({ data: result });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

/**
* Endpoint to get all posts a user has made. The user id
* is expected as a parameter in the url.
*/
app.get('/api/user/:userid/posts', async (req, res) => {
  try {
    if (req.params.userid === undefined) {
      res.status(400).json({ error: 'user ID is missing' });
      return;
    }
    const result = await postQ.getAllPostsByUser(db, req.params.userid);
    res.status(200).json({ data: result });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

/**
* Endpoint to update a user in the backend by a user id. The user id
* is expected as a parameter in the url, and the updated parameters (password,
* email, image) are in the body of the request.
*/
app.get('/api/user/:userid/comments', async (req, res) => {
  try {
    if (req.params.userid === undefined) {
      res.status(400).json({ error: 'user ID is missing' });
      return;
    }
    const result = await commentQ.getAllCommentsByUser(db, req.params.userid);
    res.status(200).json({ data: result });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

/**
* Endpoint to get all replies a user has made. The user id
* is expected as a parameter in the url.
*/
app.get('/api/user/:userid/replies', async (req, res) => {
  try {
    if (req.params.userid === undefined) {
      res.status(400).json({ error: 'user ID is missing' });
      return;
    }
    const result = await replyQ.getAllRepliesByUser(db, req.params.userid);
    res.status(200).json({ data: result });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

/**
* Endpoint to add a new group in the backend. The name, creator, icon,
* description, private, editable settings of the group are expected
* in the body of the request.
*/
app.post('/api/group', async (req, res) => {
  try {
    if (req.body.name === undefined) {
      res.status(400).json({ error: 'invalid input, object invalid' });
      return;
    }
    const result = await groupQ.addGroup(
      db,
      req.body.name,
      req.body.creator,
      req.body.icon,
      req.body.description,
      req.body.isPrivate,
      req.body.editable,
    );
    res.status(201).json({ data: result });
  } catch (err) {
    res.status(409).json({ error: err.message });
  }
});

/**
* Endpoint to get all public groups in the backend.
*/
app.get('/api/groups', async (req, res) => {
  try {
    const results = await groupQ.getGroups(db);
    res.status(200).json({ data: results });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

/**
* Endpoint to get a group in the backend. The group id
* is expected as a parameter in the url.
*/
app.get('/api/group/:groupid', async (req, res) => {
  try {
    if (req.params.groupid === undefined) {
      res.status(400).json({ error: 'group ID is missing' });
      return;
    }
    const result = await groupQ.getGroup(db, req.params.groupid);
    if (result === undefined) {
      res.status(404).json({ error: 'group not found' });
      return;
    }
    res.status(200).json({ data: result });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

/**
* Endpoint to update a group in the backend. The group id is expected
* as a paramter in the url. The new group settings (icon, description,
* private and editable settings) are expected in the request body.
*/
app.put('/api/group/:groupid', async (req, res) => {
  try {
    if (req.params.groupid === undefined) {
      res.status(400).json({ error: 'group ID is missing' });
      return;
    }
    const result = await groupQ.updateGroup(
      db,
      req.params.groupid,
      req.body.icon,
      req.body.description,
      req.body.private,
      req.body.editable,
    );
    if (Number(result) === 0) {
      res.status(404).json({ error: 'group not found' });
      return;
    }
    if (result === 1) {
      res.status(200).json({ message: 'group updated successfully' });
    }
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

/**
* Endpoint to delete a group in the backend. The group id is expected
* as a paramter in the url.
*/
app.delete('/api/group/:groupid', async (req, res) => {
  try {
    if (req.params.groupid === undefined) {
      res.status(400).json({ error: 'group ID is missing' });
      return;
    }
    const result = await groupQ.deleteGroup(db, req.params.groupid);
    if (Number(result) === 0) {
      res.status(404).json({ error: 'group not found' });
      return;
    }
    if (result === 1) {
      res.status(200).json({ message: 'group deleted successfully' });
    }
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

/**
* Endpoint to get all posts in a group. The group id is expected
* as a paramter in the url.
*/
app.get('/api/group/:groupid/posts', async (req, res) => {
  try {
    if (req.params.groupid === undefined) {
      res.status(400).json({ error: 'group ID is missing' });
      return;
    }
    const result = await postQ.getAllPostsInGroup(db, req.params.groupid);
    if (result === undefined) {
      res.status(404).json({ error: 'group not found' });
      return;
    }
    res.status(200).json({ data: result });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

/**
* Endpoint to get all flagged posts in a group. The group id is expected
* as a paramter in the url.
*/
app.get('/api/group/:groupid/flaggedposts', async (req, res) => {
  try {
    if (req.params.groupid === undefined) {
      res.status(400).json({ error: 'group ID is missing' });
      return;
    }
    const result = await postQ.getFlaggedPostsInGroup(db, req.params.groupid);
    if (result === undefined) {
      res.status(404).json({ error: 'group not found' });
      return;
    }
    res.status(200).json({ data: result });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

/**
* Endpoint to get all members in a group. The group id is expected
* as a paramter in the url.
*/
app.get('/api/group/:groupid/users', async (req, res) => {
  try {
    if (req.params.groupid === undefined) {
      res.status(400).json({ error: 'group ID is missing' });
      return;
    }
    const result = await userQ.getAllUsersInGroup(db, req.params.groupid);
    if (result === undefined) {
      res.status(404).json({ error: 'group not found' });
      return;
    }
    res.status(200).json({ data: result });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

/**
* Endpoint to get all non-members in a group. The group id is expected
* as a paramter in the url.
*/
app.get('/api/group/:groupid/nonusers', async (req, res) => {
  try {
    if (req.params.groupid === undefined) {
      res.status(400).json({ error: 'group ID is missing' });
      return;
    }
    const result = await userQ.getAllNonUsersInGroup(db, req.params.groupid);
    if (result === undefined) {
      res.status(404).json({ error: 'group not found' });
      return;
    }
    res.status(200).json({ data: result });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

/**
* Endpoint to add a new post to a group. The user id, group id, title,
* content, status, flagged, image, audio and video settings of the post
* are expected in the body of the request.
*/
app.post('/api/post', async (req, res) => {
  try {
    if (req.body.iduser === undefined || req.body.idgroup === undefined
      || req.body.title === undefined || req.body.content === undefined) {
      res.status(400).json({ error: 'invalid input, object invalid' });
      return;
    }
    const result = await postQ.addPost(
      db,
      req.body.iduser,
      req.body.idgroup,
      req.body.title,
      req.body.content,
      req.body.status,
      req.body.flagged,
      req.body.image,
      req.body.audio,
      req.body.video,
    );
    res.status(201).json({ data: result });
  } catch (err) {
    res.status(409).json({ error: err.message });
  }
});

/**
* Endpoint to get all post from the backend.
*/
app.get('/api/posts', async (req, res) => {
  try {
    const results = await postQ.getPosts(db);
    res.status(200).json({ data: results });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

/**
* Endpoint to get a post by its post id. The post id is expected
* as a parameter in the url.
*/
app.get('/api/post/:postid', async (req, res) => {
  try {
    if (req.params.postid === undefined) {
      res.status(400).json({ error: 'post ID is missing' });
      return;
    }
    const result = await postQ.getPost(db, req.params.postid);
    if (result === undefined) {
      res.status(404).json({ error: 'post not found' });
      return;
    }
    res.status(200).json({ data: result });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

/**
* Endpoint to update a post by its post id. The post id is expected
* as a parameter in the url. The title, content, status, flagged, image,
* audio and video settings of the post are expected in the body of the request.
*/
app.put('/api/post/:postid', async (req, res) => {
  try {
    if (req.params.postid === undefined) {
      res.status(400).json({ error: 'post ID is missing' });
      return;
    }
    if (req.body.title === undefined && req.body.content === undefined) {
      res.status(400).json({ error: 'invalid input, object invalid' });
      return;
    }
    const result = await postQ.updatePost(
      db,
      req.params.postid,
      req.body.title,
      req.body.content,
      req.body.status,
      req.body.flagged,
      req.body.image,
      req.body.audio,
      req.body.video,
    );
    if (Number(result) === 0) {
      res.status(404).json({ error: 'post not found' });
      return;
    }
    if (result === 1) {
      res.status(200).json({ message: 'post updated successfully' });
    }
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

/**
* Endpoint to update the flagged setting of a post by its post id.
* The post id is expected as a parameter in the url. The flagged
* setting of the post are expected in the body of the request.
*/
app.put('/api/post/flag/:postid', async (req, res) => {
  try {
    if (req.params.postid === undefined) {
      res.status(400).json({ error: 'post ID is missing' });
      return;
    }
    const result = await postQ.flagPost(
      db,
      req.body.flagged,
      req.params.postid,
    );
    if (Number(result) === 0) {
      res.status(404).json({ error: 'post not found' });
      return;
    }
    if (result === 1) {
      res.status(200).json({ message: 'post updated successfully' });
    }
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

/**
* Endpoint to delete a post by its post id. The post id is expected
* as a parameter in the url.
*/
app.delete('/api/post/:postid', async (req, res) => {
  try {
    if (req.params.postid === undefined) {
      res.status(400).json({ error: 'post ID is missing' });
      return;
    }
    const result = await postQ.deletePost(db, req.params.postid);
    if (Number(result) === 0) {
      res.status(404).json({ error: 'post not found' });
      return;
    }
    if (result === 1) {
      res.status(200).json({ message: 'post deleted successfully' });
    }
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

/**
* Endpoint to get all comments for a post.
* The post id is expected as a parameter in the url.
*/
app.get('/api/post/:postid/comments', async (req, res) => {
  try {
    if (req.params.postid === undefined) {
      res.status(400).json({ error: 'post ID is missing' });
      return;
    }
    const result = await commentQ.getAllCommentsInPost(db, req.params.postid);
    if (result === undefined) {
      res.status(204).json({ data: {} });
      return;
    }
    res.status(200).json({ data: result });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

/**
* Endpoint to add a comment for a post.
* The user id, post id, content, status, flagged, image, audio, video
* settings for the comment are expected in the body of the request.
*/
app.post('/api/comment', async (req, res) => {
  try {
    if (req.body.iduser === undefined || req.body.idpost === undefined
      || req.body.content === undefined) {
      res.status(400).json({ error: 'invalid input, object invalid' });
      return;
    }
    const result = await commentQ.addComment(
      db,
      req.body.iduser,
      req.body.idpost,
      req.body.content,
      req.body.status,
      req.body.flagged,
      req.body.image,
      req.body.audio,
      req.body.video,
    );
    res.status(201).json({ data: result });
  } catch (err) {
    res.status(409).json({ error: err.message });
  }
});

/**
* Endpoint to get a comment by its comment id.
* The comment id is expected as a parameter in the url.
*/
app.get('/api/comment/:commentid', async (req, res) => {
  try {
    if (req.params.commentid === undefined) {
      res.status(400).json({ error: 'comment ID is missing' });
      return;
    }
    const result = await commentQ.getComment(db, req.params.commentid);
    if (result === undefined) {
      res.status(404).json({ error: 'comment not found' });
      return;
    }
    res.status(200).json({ data: result });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

/**
* Endpoint to update a comment by its comment id.
* The comment id is expected as a parameter in the url.
* The content, status, flagged, image, audio, video
* settings for the comment are expected in the body of the request.
*/
app.put('/api/comment/:commentid', async (req, res) => {
  try {
    if (req.params.commentid === undefined) {
      res.status(400).json({ error: 'comment ID is missing' });
      return;
    }
    if (req.body.content === undefined) {
      res.status(400).json({ error: 'invalid input, object invalid' });
      return;
    }
    const result = await commentQ.updateComment(
      db,
      req.params.commentid,
      req.body.content,
      req.body.status,
      req.body.flagged,
      req.body.image,
      req.body.audio,
      req.body.video,
    );
    if (Number(result) === 0) {
      res.status(404).json({ error: 'comment not found' });
      return;
    }
    if (result === 1) {
      res.status(200).json({ message: 'comment updated successfully' });
    }
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

/**
* Endpoint to delete a comment by its comment id.
* The comment id is expected as a parameter in the url.
*/
app.delete('/api/comment/:commentid', async (req, res) => {
  try {
    if (req.params.commentid === undefined) {
      res.status(400).json({ error: 'comment ID is missing' });
      return;
    }
    const result = await commentQ.deleteComment(db, req.params.commentid);
    if (Number(result) === 0) {
      res.status(404).json({ error: 'comment not found' });
      return;
    }
    if (result === 1) {
      res.status(200).json({ message: 'comment deleted successfully' });
    }
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

/**
* Endpoint to get all replies for a comment by its comment id.
* The comment id is expected as a parameter in the url.
*/
app.get('/api/comment/:commentid/replies', async (req, res) => {
  try {
    if (req.params.commentid === undefined) {
      res.status(400).json({ error: 'comment ID is missing' });
      return;
    }
    const result = await replyQ.getReplyForComment(db, req.params.commentid);
    if (result === undefined) {
      res.status(404).json({ error: 'comment not found' });
      return;
    }
    res.status(200).json({ data: result });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

/**
* Endpoint to add a reply to a comment. The comment id, user id, content,
* image, audio and video settings of the reply are expected in the body
* of the request.
*/
app.post('/api/reply', async (req, res) => {
  try {
    if (req.body.idcomment === undefined || req.body.iduser === undefined
      || req.body.content === undefined) {
      res.status(400).json({ error: 'invalid input, object invalid' });
      return;
    }
    const result = await replyQ.addReply(
      db,
      req.body.idcomment,
      req.body.iduser,
      req.body.content,
      req.body.image,
      req.body.audio,
      req.body.video,
    );
    res.status(201).json({ data: result });
  } catch (err) {
    res.status(409).json({ error: err.message });
  }
});

/**
* Endpoint to get a reply by a reply id.
* The reply id is expected as a parameter in the url.
*/
app.get('/api/reply/:replyid', async (req, res) => {
  try {
    if (req.params.replyid === undefined) {
      res.status(400).json({ error: 'reply ID is missing' });
      return;
    }
    const result = await replyQ.getReply(db, req.params.replyid);
    if (result === undefined) {
      res.status(404).json({ error: 'reply not found' });
      return;
    }
    res.status(200).json({ data: result });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

/**
* Endpoint to update a reply by a reply id.
* The reply id is expected as a parameter in the url. The content,
* image, audio and video settings of the reply are expected in the body
* of the request.
*/
app.put('/api/reply/:replyid', async (req, res) => {
  try {
    if (req.params.replyid === undefined) {
      res.status(400).json({ error: 'reply ID is missing' });
      return;
    }
    if (req.body.content === undefined) {
      res.status(400).json({ error: 'invalid input, object invalid' });
      return;
    }
    const result = await replyQ.updateReply(
      db,
      req.params.replyid,
      req.body.content,
      req.body.image,
      req.body.audio,
      req.body.video,
    );
    if (Number(result) === 0) {
      res.status(404).json({ error: 'reply not found' });
      return;
    }
    if (result === 1) {
      res.status(200).json({ message: 'reply updated successfully' });
    }
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

/**
* Endpoint to delete a reply by a reply id.
* The reply id is expected as a parameter in the url.
*/
app.delete('/api/reply/:replyid', async (req, res) => {
  try {
    if (req.params.replyid === undefined) {
      res.status(400).json({ error: 'reply ID is missing' });
      return;
    }
    const result = await replyQ.deleteReply(db, req.params.replyid);
    if (Number(result) === 0) {
      res.status(404).json({ error: 'reply not found' });
      return;
    }
    if (result === 1) {
      res.status(200).json({ message: 'reply deleted successfully' });
    }
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

/**
* Endpoint to add a member to a group.
* The user id, group id, pending and admin settings of the member
* are expected in the body of the request.
*/
app.post('/api/member', async (req, res) => {
  try {
    if (req.body.iduser === undefined || req.body.idgroup === undefined) {
      res.status(400).json({ error: 'invalid input, object invalid' });
      return;
    }
    const result = await memberQ.addMember(
      db,
      req.body.iduser,
      req.body.idgroup,
      req.body.pending,
      req.body.admin,
    );
    if (Number(result) === 0) {
      res.status(404).json({ error: 'unsucessful' });
      return;
    }
    if (result === 1) {
      res.status(200).json({ message: 'member added successfully' });
    }
  } catch (err) {
    res.status(409).json({ error: err.message });
  }
});

/**
* Endpoint to update a member of a group.
* The user id, group id, pending and admin settings of the member
* are expected in the body of the request.
*/
app.put('/api/member', async (req, res) => {
  try {
    if (req.body.iduser === undefined || req.body.idgroup === undefined) {
      res.status(400).json({ error: 'invalid input, object invalid' });
      return;
    }
    const result = await memberQ.updateMember(
      db,
      req.body.iduser,
      req.body.idgroup,
      req.body.pending,
      req.body.admin,
    );
    if (Number(result) === 0) {
      res.status(404).json({ error: 'unsucessful' });
      return;
    }
    if (result === 1) {
      res.status(200).json({ message: 'member updated successfully' });
    }
  } catch (err) {
    res.status(409).json({ error: err.message });
  }
});

/**
* Endpoint to delete a member from a group.
* The user id, group id  of the member
* are expected in the body of the request.
*/
app.delete('/api/member', async (req, res) => {
  try {
    if (req.body.iduser === undefined || req.body.idgroup === undefined) {
      res.status(400).json({ error: 'invalid input, object invalid' });
      return;
    }
    const result = await memberQ.deleteMember(
      db,
      req.body.iduser,
      req.body.idgroup,
    );
    if (Number(result) === 0) {
      res.status(404).json({ error: 'unsucessful' });
      return;
    }
    if (result === 1) {
      res.status(200).json({ message: 'member deleted successfully' });
    }
  } catch (err) {
    res.status(409).json({ error: err.message });
  }
});

/**
* Endpoint to get a member from a group by group id and user id.
* The user id and group id  of the member are expected as parameters
* in the url.
*/
app.get('/api/member/:groupid/:userid', async (req, res) => {
  try {
    if (req.params.userid === undefined || req.params.groupid === undefined) {
      res.status(400).json({ error: 'invalid input, object invalid' });
      return;
    }
    const result = await memberQ.getMember(
      db,
      req.params.userid,
      req.params.groupid,
    );
    if (result === undefined) {
      res.status(204).json({ data: {} });
      return;
    }
    res.status(200).json({ data: result });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

/**
* Endpoint to add a new chat.
* The user id, name and privacy setting of the chat
* are expected in the body of the request.
*/
app.post('/api/chat', async (req, res) => {
  try {
    if (req.body.iduser === undefined || req.body.name === undefined) {
      res.status(400).json({ error: 'invalid input, object invalid' });
      return;
    }
    const result = await messageQ.makeChatGroup(
      db,
      req.body.iduser,
      req.body.name,
      req.body.private,
    );
    res.status(201).json({ data: result });
  } catch (err) {
    res.status(409).json({ error: err.message });
  }
});

/**
* Endpoint to update a chat.
* The chat id, name and privacy setting of the chat
* are expected in the body of the request.
*/
app.put('/api/chat', async (req, res) => {
  try {
    if (req.body.idchat === undefined || req.body.name === undefined) {
      res.status(400).json({ error: 'invalid input, object invalid' });
      return;
    }
    const result = await messageQ.updateChatGroup(
      db,
      req.body.idchat,
      req.body.name,
      req.body.private,
    );
    if (Number(result) === 0) {
      res.status(404).json({ error: 'unsucessful' });
      return;
    }
    if (result === 1) {
      res.status(200).json({ message: 'chat updated successfully' });
    }
  } catch (err) {
    res.status(409).json({ error: err.message });
  }
});

/**
* Endpoint to delete a chat.
* The chat id is expected in the body of the request.
*/
app.delete('/api/chat', async (req, res) => {
  try {
    if (req.body.idchat === undefined) {
      res.status(400).json({ error: 'invalid input, object invalid' });
      return;
    }
    const result = await messageQ.deleteChatGroup(db, req.body.idchat);
    if (Number(result) === 0) {
      res.status(404).json({ error: 'unsucessful' });
      return;
    }
    if (result === 1) {
      res.status(200).json({ message: 'chat deleted successfully' });
    }
  } catch (err) {
    res.status(409).json({ error: err.message });
  }
});

/**
* Endpoint to add a new user to a chatgroup.
* The chat id is expected as a parameter in the url.
* The user id is expected in the body of the request.
*/
app.post('/api/chatgroup/:chatid', async (req, res) => {
  try {
    if (req.params.chatid === undefined) {
      res.status(400).json({ error: 'chat ID is missing' });
      return;
    }
    if (req.body.iduser === undefined) {
      res.status(400).json({ error: 'invalid input, object invalid' });
      return;
    }
    const result = await messageQ.addUserToChatGroup(
      db,
      req.body.iduser,
      req.params.chatid,
    );
    if (Number(result) === 0) {
      res.status(404).json({ error: 'unsucessful' });
      return;
    }
    if (result === 1) {
      res.status(200).json({ message: 'user added to chat successfully' });
    }
  } catch (err) {
    res.status(409).json({ error: err.message });
  }
});

/**
* Endpoint to delete a user from a chatgroup.
* The chat id is expected as a parameter in the url.
* The user id is expected in the body of the request.
*/
app.delete('/api/chatgroup/:chatid', async (req, res) => {
  try {
    if (req.params.chatid === undefined) {
      res.status(400).json({ error: 'chat ID is missing' });
      return;
    }
    if (req.body.iduser === undefined) {
      res.status(400).json({ error: 'invalid input, object invalid' });
      return;
    }
    const result = await messageQ.removeUserFromChatGroup(
      db,
      req.body.iduser,
      req.params.chatid,
    );
    if (Number(result) === 0) {
      res.status(404).json({ error: 'unsucessful' });
      return;
    }
    if (result === 1) {
      res.status(200).json({ message: 'user removed from chat successfully' });
    }
  } catch (err) {
    res.status(409).json({ error: err.message });
  }
});

/**
* Endpoint to add a new message to a chatgroup.
* The chat id is expected as a parameter in the url.
* The user id, content, image, audio and video settings of the messages
* are expected in the body of the request.
*/
app.post('/api/message/:chatid', async (req, res) => {
  try {
    if (req.params.chatid === undefined) {
      res.status(400).json({ error: 'chat ID is missing' });
      return;
    }
    if (req.body.iduser === undefined || req.body.content === undefined) {
      res.status(400).json({ error: 'invalid input, object invalid' });
      return;
    }
    const result = await messageQ.addMessageToChat(
      db,
      req.body.iduser,
      req.params.chatid,
      req.body.content,
      req.body.image,
      req.body.audio,
      req.body.video,
    );
    if (Number(result) === 0) {
      res.status(404).json({ error: 'unsucessful' });
      return;
    }
    if (result === 1) {
      res.status(200).json({ message: 'added message to chat successfully' });
    }
  } catch (err) {
    res.status(409).json({ error: err.message });
  }
});

/**
* Endpoint to get all messages from a chatgroup.
* The chat id is expected as a parameter in the url.
*/
app.get('/api/message/:chatid', async (req, res) => {
  try {
    if (req.params.chatid === undefined) {
      res.status(400).json({ error: 'chat ID is missing' });
      return;
    }
    const result = await messageQ.getMessagesInChat(db, req.params.chatid);
    if (result === undefined) {
      res.status(404).json({ error: 'chat not found' });
      return;
    }
    res.status(200).json({ data: result });
  } catch (err) {
    res.status(409).json({ error: err.message });
  }
});

/**
* Endpoint to get all messages from a chatgroup that is sent by
* a particular user.
* The chat id and user id is expected as a parameter in the url.
*/
app.get('/api/message/:chatid/user/:userid', async (req, res) => {
  try {
    if (req.params.chatid === undefined) {
      res.status(400).json({ error: 'chat ID is missing' });
      return;
    }
    if (req.params.userid === undefined) {
      res.status(400).json({ error: 'user ID is missing' });
      return;
    }
    const result = await messageQ.getMessagesInChatByUser(
      db,
      req.params.chatid,
      req.params.userid,
    );
    if (result === undefined) {
      res.status(404).json({ error: 'chat not found' });
      return;
    }
    res.status(200).json({ data: result });
  } catch (err) {
    res.status(409).json({ error: err.message });
  }
});

/**
* Endpoint to add a new grouptag to a group.
* The group id is expected as a parameter in the url.
* The group tag is expected in the body of the request.
*/
app.post('/api/grouptag/:idgroup', async (req, res) => {
  try {
    if (req.params.idgroup === undefined) {
      res.status(400).json({ error: 'group ID is missing' });
      return;
    }
    if (req.body.tag === undefined) {
      res.status(400).json({ error: 'invalid input, object invalid' });
      return;
    }
    const result = await grouptagQ.addGrouptag(
      db,
      req.params.idgroup,
      req.body.tag,
    );
    if (Number(result) === 0) {
      res.status(404).json({ error: 'unsucessful' });
      return;
    }
    if (result === 1) {
      res.status(200).json({ message: 'grouptag added to group successfully' });
    }
  } catch (err) {
    res.status(409).json({ error: err.message });
  }
});

/**
* Endpoint to get all grouptags for a group.
* The group id is expected as a parameter in the url.
*/
app.get('/api/grouptag/:idgroup', async (req, res) => {
  try {
    if (req.params.idgroup === undefined) {
      res.status(400).json({ error: 'group ID is missing' });
      return;
    }
    const result = await grouptagQ.getGrouptagForGroup(db, req.params.idgroup);
    if (result === undefined) {
      res.status(404).json({ error: 'group not found' });
      return;
    }
    res.status(200).json({ data: result });
  } catch (err) {
    res.status(409).json({ error: err.message });
  }
});

/**
* Endpoint to get all groups for a grouptag.
* The group tag is expected as a parameter in the url.
*/
app.get('/api/grouptag/tag/:grouptag', async (req, res) => {
  try {
    if (req.params.grouptag === undefined) {
      res.status(400).json({ error: 'group tag is missing' });
      return;
    }
    const result = await grouptagQ.getGroupForGrouptag(db, req.params.grouptag);
    if (result === undefined) {
      res.status(204).json({ data: [] });
      return;
    }
    res.status(200).json({ data: result });
  } catch (err) {
    res.status(409).json({ error: err.message });
  }
});

/**
* Endpoint to delete a grouptag for a group.
* The group id is expected as a parameter in the url.
* The grouptag is expected in the body of the request.
*/
app.delete('/api/grouptag/:idgroup', async (req, res) => {
  try {
    if (req.params.idgroup === undefined) {
      res.status(400).json({ error: 'group ID is missing' });
      return;
    }
    if (req.body.tag === undefined) {
      res.status(400).json({ error: 'invalid input, object invalid' });
      return;
    }
    const result = await grouptagQ.deleteGrouptagForGroup(
      db,
      req.params.idgroup,
      req.body.tag,
    );
    if (Number(result) === 0) {
      res.status(404).json({ error: 'unsucessful' });
      return;
    }
    if (result === 1) {
      res.status(200).json({ message: 'grouptag removed from group successfully' });
    }
  } catch (err) {
    res.status(409).json({ error: err.message });
  }
});

/**
* Endpoint to add a new hashtag.
* The post id or comment id or reply id, and the hashtag
* are expected in the body of the request.
*/
app.post('/api/hashtag', async (req, res) => {
  try {
    if ((req.body.idpost === undefined && req.body.idcomment === undefined
      && req.body.idreply === undefined)
    || req.body.hashtag === undefined) {
      res.status(400).json({ error: 'invalid input, object invalid' });
      return;
    }
    req.body.idpost = req.body.idpost === undefined ? -1 : req.body.idpost;
    req.body.idcomment = req.body.idcomment === undefined ? -1 : req.body.idcomment;
    req.body.idreply = req.body.idreply === undefined ? -1 : req.body.idreply;
    const result = await hashtagQ.addHashtag(
      db,
      req.body.idpost,
      req.body.idcomment,
      req.body.idreply,
      req.body.hashtag,
    );
    if (Number(result) === 0) {
      res.status(404).json({ error: 'unsucessful' });
      return;
    }
    if (result === 1) {
      res.status(200).json({ message: 'hashtag added successfully' });
    }
  } catch (err) {
    res.status(409).json({ error: err.message });
  }
});

/**
* Endpoint to get the posts and comments of a hashtag.
* The tag is expected as a parameter in the url.
*/
app.get('/api/hashtag/:hashtag', async (req, res) => {
  try {
    if (req.params.hashtag === undefined) {
      res.status(400).json({ error: 'invalid input, object invalid' });
      return;
    }
    const result = await hashtagQ.getPostAndCommentByHashtag(
      db,
      req.params.hashtag,
    );
    if (result === undefined) {
      res.status(204).json({ data: {} });
      return;
    }
    res.status(200).json({ data: result });
  } catch (err) {
    res.status(409).json({ error: err.message });
  }
});

/**
* Endpoint to get a hashtag.
* The post id or comment id or reply id
* is expected in the body of the request.
*/
app.get('/api/hashtag', async (req, res) => {
  try {
    if (req.query.idpost === undefined && req.query.idcomment === undefined
      && req.query.idreply === undefined) {
      res.status(400).json({ error: 'invalid input, object invalid' });
      return;
    }
    const idpost = req.query.idpost === undefined ? -2 : req.query.idpost;
    const idcomment = req.query.idcomment === undefined ? -2 : req.query.idcomment;
    const idreply = req.query.idreply === undefined ? -2 : req.query.idreply;
    const result = await hashtagQ.getHashtag(
      db,
      idpost,
      idcomment,
      idreply,
    );
    if (result === undefined) {
      res.status(204).json({ data: {} });
      return;
    }
    res.status(200).json({ data: result });
  } catch (err) {
    res.status(409).json({ error: err.message });
  }
});

/**
* Endpoint to delete a hashtag in a post.
* The post id is expected as a parameter in the url.
*/
app.delete('/api/hashtag/post/:idpost', async (req, res) => {
  try {
    if (req.params.idpost === undefined) {
      res.status(400).json({ error: 'invalid input, object invalid' });
      return;
    }
    const result = await hashtagQ.deleteHashtagByPost(
      db,
      req.params.idpost,
    );
    if (Number(result) === 0) {
      res.status(204).json({ data: {} });
      return;
    }
    res.status(200).json({ message: 'Hashtags removed successfully' });
  } catch (err) {
    res.status(409).json({ error: err.message });
  }
});

/**
* Endpoint to delete a hashtag in a comment.
* The comment id is expected as a parameter in the url.
*/
app.delete('/api/hashtag/comment/:idcomment', async (req, res) => {
  try {
    if (req.params.idcomment === undefined) {
      res.status(400).json({ error: 'invalid input, object invalid' });
      return;
    }
    const result = await hashtagQ.deleteHashtagByComment(
      db,
      req.params.idcomment,
    );
    if (Number(result) === 0) {
      res.status(204).json({ data: {} });
      return;
    }
    res.status(200).json({ message: 'Hashtags removed successfully' });
  } catch (err) {
    res.status(409).json({ error: err.message });
  }
});

/**
* Endpoint to add a new mention.
* The post id or comment id or reply id, and the user id
* are expected in the body of the request.
*/
app.post('/api/mention', async (req, res) => {
  try {
    if ((req.body.idpost === undefined && req.body.idcomment === undefined
      && req.body.idreply === undefined) || req.body.iduser === undefined) {
      res.status(400).json({ error: 'invalid input, object invalid' });
      return;
    }
    req.body.idpost = req.body.idpost === undefined ? -1 : req.body.idpost;
    req.body.idcomment = req.body.idcomment === undefined ? -1 : req.body.idcomment;
    req.body.idreply = req.body.idreply === undefined ? -1 : req.body.idreply;
    const result = await mentionQ.addMention(
      db,
      req.body.iduser,
      req.body.idpost,
      req.body.idcomment,
      req.body.idreply,
    );
    if (Number(result) === 0) {
      res.status(404).json({ error: 'unsucessful' });
      return;
    }
    if (result === 1) {
      res.status(200).json({ message: 'mention added successfully' });
    }
  } catch (err) {
    res.status(409).json({ error: err.message });
  }
});

/**
* Endpoint to delete a mention.
* The post id or comment id or reply id, and the user id
* are expected in the body of the request.
*/
app.delete('/api/mention', async (req, res) => {
  try {
    if ((req.body.idpost === undefined && req.body.idcomment === undefined
      && req.body.idreply === undefined) || req.body.iduser === undefined) {
      res.status(400).json({ error: 'invalid input, object invalid' });
      return;
    }
    req.body.idpost = req.body.idpost === undefined ? -1 : req.body.idpost;
    req.body.idcomment = req.body.idcomment === undefined ? -1 : req.body.idcomment;
    req.body.idreply = req.body.idreply === undefined ? -1 : req.body.idreply;
    const result = await mentionQ.deleteMention(
      db,
      req.body.iduser,
      req.body.idpost,
      req.body.idcomment,
      req.body.idreply,
    );
    if (Number(result) === 0) {
      res.status(404).json({ error: 'unsucessful' });
      return;
    }
    if (result === 1) {
      res.status(200).json({ message: 'mention removed successfully' });
    }
  } catch (err) {
    res.status(409).json({ error: err.message });
  }
});

/**
* Endpoint to update a mention.
* The post id or comment id or reply id, and the user id and hidden setting
* are expected in the body of the request.
*/
app.put('/api/mention', async (req, res) => {
  try {
    if ((req.body.idpost === undefined && req.body.idcomment === undefined
      && req.body.idreply === undefined) || req.body.iduser === undefined) {
      res.status(400).json({ error: 'invalid input, object invalid' });
      return;
    }
    req.body.idpost = req.body.idpost === undefined ? -1 : req.body.idpost;
    req.body.idcomment = req.body.idcomment === undefined ? -1 : req.body.idcomment;
    req.body.idreply = req.body.idreply === undefined ? -1 : req.body.idreply;
    req.body.hidden = req.body.hidden !== undefined;
    const result = await mentionQ.updateMention(
      db,
      req.body.hidden,
      req.body.iduser,
      req.body.idpost,
      req.body.idcomment,
      req.body.idreply,
    );
    if (Number(result) === 0) {
      res.status(404).json({ error: 'unsucessful' });
      return;
    }
    if (result === 1) {
      res.status(200).json({ message: 'mention updated successfully' });
    }
  } catch (err) {
    res.status(409).json({ error: err.message });
  }
});

/**
* Endpoint to get all posts a user is mentioned in.
* The user id is expected as a parameter in the url.
*/
app.get('/api/user/:userid/posts/mentioned', async (req, res) => {
  try {
    if (req.params.userid === undefined) {
      res.status(400).json({ error: 'user ID is missing' });
      return;
    }
    const result = await postQ.getAllPostsUserMention(db, req.params.userid);
    res.status(200).json({ data: result });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

/**
* Endpoint to get all comments a user is mentioned in.
* The user id is expected as a parameter in the url.
*/
app.get('/api/user/:userid/comments/mentioned', async (req, res) => {
  try {
    if (req.params.userid === undefined) {
      res.status(400).json({ error: 'user ID is missing' });
      return;
    }
    const result = await commentQ.getAllCommentsUserMention(db, req.params.userid);
    res.status(200).json({ data: result });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

/**
* Endpoint to get all replies a user is mentioned in.
* The reply id is expected as a parameter in the url.
*/
app.get('/api/user/:userid/replies/mentioned', async (req, res) => {
  try {
    if (req.params.userid === undefined) {
      res.status(400).json({ error: 'user ID is missing' });
      return;
    }
    const result = await replyQ.getAllRepliesUserMention(db, req.params.userid);
    res.status(200).json({ data: result });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

/**
* Endpoint to get the lockout information for a username.
* The username is expected as a parameter in the url.
*/
app.get('/api/lockout/:username', async (req, res) => {
  try {
    if (req.params.username === undefined) {
      res.status(400).json({ error: 'username is missing' });
      return;
    }
    const result = await userQ.getLockout(db, req.params.username);
    res.status(200).json({ data: result });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

/**
* Endpoint to add the lockout information for a username.
* The username is expected in the body of the request.
*/
app.post('/api/lockout', async (req, res) => {
  try {
    if (req.body.username === undefined) {
      res.status(400).json({ error: 'username is missing' });
      return;
    }
    const result = await userQ.addLockout(db, req.body.username);
    res.status(201).json({ data: result });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

/**
* Endpoint to update the lockout information for a username.
* The username is expected in the body of the request.
*/
app.put('/api/lockout', async (req, res) => {
  try {
    if (req.body.username === undefined) {
      res.status(400).json({ error: 'username is missing' });
      return;
    }
    const result = await userQ.updateLockout(db, req.body.username);
    res.status(200).json({ data: result });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

/**
* Endpoint to set the lockout for a username.
* The username is expected in the body of the request.
*/
app.put('/api/lockout/lock', async (req, res) => {
  try {
    if (req.body.username === undefined) {
      res.status(400).json({ error: 'username is missing' });
      return;
    }
    const result = await userQ.setLockout(db, req.body.username);
    res.status(200).json({ data: result });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

/**
* Endpoint to reset the lockout for a username.
* The username is expected in the body of the request.
*/
app.put('/api/lockout/reset', async (req, res) => {
  try {
    if (req.body.username === undefined) {
      res.status(400).json({ error: 'username is missing' });
      return;
    }
    const result = await userQ.resetLockout(db, req.body.username);
    res.status(200).json({ data: result });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

/**
* Endpoint to get all chat groups a user is in.
* The user id is expected as a parameter in the url.
*/
app.get('/api/chatgroup/:userid', async (req, res) => {
  try {
    if (req.params.userid === undefined) {
      res.status(400).json({ error: 'user id is missing' });
      return;
    }
    const result = await messageQ.getChatGroups(db, req.params.userid);
    res.status(200).json({ data: result });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

/**
* Endpoint to get all notifications for a user.
* The user id is expected as a parameter in the url.
*/
app.get('/api/notification/:userid', async (req, res) => {
  try {
    if (req.params.userid === undefined) {
      res.status(400).json({ error: 'user id is missing' });
      return;
    }
    const result = await notificationQ.getNotifications(db, req.params.userid);
    res.status(200).json({ data: result });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

/**
* Endpoint to add a notification for a user.
* The user id is expected in the body of the request.
*/
app.post('/api/notification/', async (req, res) => {
  try {
    if (req.body.userid === undefined) {
      res.status(400).json({ error: 'user id is missing' });
      return;
    }
    const result = await notificationQ.addNotification(db, req.body.userid, req.body.notification);
    res.status(200).json({ data: result });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

/**
* Endpoint to delete a notification for a user.
* The notification id is expected in the parameter of the url.
*/
app.delete('/api/notification/:idnotification', async (req, res) => {
  try {
    if (req.params.idnotification === undefined) {
      res.status(400).json({ error: 'notification id is missing' });
      return;
    }
    const result = await notificationQ.deleteNotification(db, req.params.idnotification);
    res.status(200).json({ data: result });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

/**
* Endpoint to get all hidden posts for a user in a certain group.
* The user id and group id are expected as a parameter in the url.
*/
app.get('/api/hide/:userid/:groupid', async (req, res) => {
  try {
    if (req.params.userid === undefined || req.params.groupid === undefined) {
      res.status(400).json({ error: 'invalid input, object invalid' });
      return;
    }
    const result = await hideQ.getHidePost(db, req.params.userid, req.params.groupid);
    res.status(200).json({ data: result });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

/**
* Endpoint to get all users hiding a post.
* The post id is expected as a parameter in the url.
*/
app.get('/api/hideby/post/:postid', async (req, res) => {
  try {
    if (req.params.postid === undefined) {
      res.status(400).json({ error: 'invalid input, object invalid' });
      return;
    }
    const result = await hideQ.getHideCount(db, req.params.postid);
    res.status(200).json({ data: result });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

/**
* Endpoint to add a notification for a user.
* The user id is expected in the body of the request.
*/
app.post('/api/hide/', async (req, res) => {
  try {
    if (req.body.userid === undefined || req.body.groupid === undefined || req.body.postid === undefined) {
      res.status(400).json({ error: 'invalid input, object invalid' });
      return;
    }
    const result = await hideQ.addHidePost(db, req.body.userid, req.body.postid, req.body.groupid);
    res.status(200).json({ data: result });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

/**
* Endpoint to delete a notification for a user.
* The notification id is expected in the parameter of the url.
*/
app.delete('/api/hide/:iduser/:idpost', async (req, res) => {
  try {
    if (req.params.iduser === undefined || req.params.idpost === undefined) {
      res.status(400).json({ error: 'invalid input, object invalid' });
      return;
    }
    const result = await hideQ.deleteHide(db, req.params.iduser, req.params.idpost);
    res.status(200).json({ data: result });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../Redundit/build/index.html'));
});

module.exports = { app };
