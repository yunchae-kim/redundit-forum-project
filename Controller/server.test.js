require('dotenv').config();
const knex = require('knex')({
  client: 'mysql2',
  connection: {
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER_ADMIN,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
  }
});

const lib = require('./database');
let db;
const request = require('supertest');
const { app } = require('./server');

// cleanup the database after each test
const clearDatabase = async () => {
  await knex('user').where('username', 'testuser').del();
  await knex('user').where('username', 'usertest').del();
  await knex('group').where('name', 'testgroup').del();
  await knex('post').where('title', 'testposttitle').del();
  await knex('comment').where('content', 'test comment').del();
  await knex('reply').where('content', 'test reply').del();
  await knex('chat').where('name','testchat').del();
  await knex('message').where('content','test message').del();
  await knex('grouptag').where('tag','testgrouptag').del();
  await knex('hashtag').where('hashtag','testhashtag').del();
  await knex('lockout').where('username','testuser').del();
  await knex('notification').where('notification','test notification').del();
};

beforeAll(async () =>{
 db = await lib.connect();
});

afterEach(async () => {
  await clearDatabase();
});

afterAll(async () => {
  await db.end();
});

describe('User table endpoint API & integration test', () => {
  const testUser = {
    username: 'testuser',
    password: 'password',
    email: 'test@email.com'
  };

  test('post user error code missing password', async () => {
    const response = await request(app).post('/api/user').send('name=testuser').expect(400);
    expect(JSON.parse(response.text).error).toBe('invalid input, object invalid');
  })

  test('post user is successful', async () => {
    await request(app).post('/api/user').send('username=testuser&password=password&email=test@email.com').expect(201);
    const newPlayer = await knex.select('*').from('user').where('username', '=', 'testuser');
    expect(newPlayer[0].username).toBe('testuser');
    expect(newPlayer[0].email).toBe('test@email.com');
  })

  test('post session is unsuccessful', async () => {
    const [id] = await knex('user').insert({username : 'testuser', password: 'password'})
    const response = await request(app).post('/api/session').send('username=testuser&password=wrongpassword').expect(401);
    expect(JSON.parse(response.text).msg).toBe("Incorrect Password");
  })

  test('post session is successful', async () => {
    await request(app).post('/api/user').send('username=testuser&password=password&email=test@email.com').expect(201);
    const response = await request(app).post('/api/session').send('username=testuser&password=password').expect(200);
    expect(JSON.parse(response.text).username).toBe('testuser');
    expect(JSON.parse(response.text).token).toBeDefined();
  })

  test('get users is succesful', async () => {
    const response = await request(app).get('/api/users').expect(200);
  });

  test('get user is succesful', async () => {
      const [id] = await knex('user').insert({username : 'testuser', password: 'password'})
      const response = await request(app).get(`/api/user/${id}`).expect(200);
      expect(JSON.parse(response.text).data.iduser).toBe(id)
      expect(JSON.parse(response.text).data.username).toBe('testuser')
      expect(JSON.parse(response.text).data.password).toBe('password')
  });

  test('update user error code', async () => {
      const response = await request(app).put(`/api/user/${99}`).send(`password=password&email=anotheremail@test.com`).expect(404);
      expect(JSON.parse(response.text).error).toBe('player not found');
  });

  test('update user is succesful', async () => {
      const [id] = await knex('user').insert({username : 'testuser', password: 'password'});
      const response = await request(app).put(`/api/user/${id}`).send(`userid=${id}&password=password&email=anotheremail@test.com`).expect(200);
      expect(JSON.parse(response.text).message).toBe("player updated successfully");
  });

  test('delete user is succesful', async () => {
    const [id] = await knex('user').insert({username : 'testuser', password: 'password'});
    const response = await request(app).delete(`/api/user/${id}`).expect(200)
    expect(JSON.parse(response.text).message).toBe("player deleted successfully");
  })

  test('get lockout is succesful', async () => {
    const [id] = await knex('lockout').insert({username : 'testuser'});
    const response = await request(app).get(`/api/lockout/testuser`).expect(200);
  })

  test('post lockout is succesful', async () => {
    const response = await request(app).post('/api/lockout').send('username=testuser').expect(201);
    const lockout = await knex.select('*').from('lockout').where('username', '=', 'testuser');
    expect(lockout[0].username).toBe('testuser');
    expect(lockout[0].attempts).toBe(1);
  })

  test('update lockout is succesful', async () => {
    const [id] = await knex('lockout').insert({username : 'testuser', attempts:1});
    const response = await request(app).put('/api/lockout').send('username=testuser').expect(200);
    const lockout = await knex.select('*').from('lockout').where('username', '=', 'testuser');
    expect(lockout[0].username).toBe('testuser');
    expect(lockout[0].attempts).toBe(2);
  })

  test('set lockout is succesful', async () => {
    const [id] = await knex('lockout').insert({username : 'testuser', attempts:1});
    const response = await request(app).put('/api/lockout/lock').send('username=testuser').expect(200);
    const lockout = await knex.select('*').from('lockout').where('username', '=', 'testuser');
    expect(lockout[0].username).toBe('testuser');
    expect(lockout[0].locked).toBe(1);
  })

  test('reset lockout is succesful', async () => {
    const [id] = await knex('lockout').insert({username : 'testuser', attempts:1, locked:1});
    const response = await request(app).put('/api/lockout/reset').send('username=testuser').expect(200);
    const lockout = await knex.select('*').from('lockout').where('username', '=', 'testuser');
    expect(lockout[0].username).toBe('testuser');
    expect(lockout[0].locked).toBe(0);
  })

});

describe('Group table endpoint API & integration test', () => {
  const testUser = {
    username: 'testuser',
    password: 'password',
    email: 'test@email.com'
  };
  const testGroup = {
    name: 'testgroup',
    description: 'test description',
    private: 0,
    editable: 1
  };
  const testGrouptag = {
    tag: 'testgrouptag'
  };

  test('post group error code ', async () => {
    const response = await request(app).post('/api/group').expect(400);
    expect(JSON.parse(response.text).error).toBe('invalid input, object invalid');
  })

  test('post group is successful', async () => {
    const [id] = await knex('user').insert(testUser);
    await request(app).post('/api/group').send(`name=testgroup&creator=${id}`).expect(201);
    const newGroup = await knex.select('*').from('group').where('name', '=', 'testgroup');
    expect(newGroup[0].name).toBe('testgroup');
  })

  test('get groups is succesful', async () => {
    const response = await request(app).get('/api/groups').expect(200);
  });

  test('get group is succesful', async () => {
      const [iduser] = await knex('user').insert(testUser);
      testGroup.creator = iduser;
      const [id] = await knex('group').insert(testGroup)
      const response = await request(app).get(`/api/group/${id}`).expect(200);
      expect(JSON.parse(response.text).data.name).toBe('testgroup')
      expect(JSON.parse(response.text).data.description).toBe('test description')
      expect(JSON.parse(response.text).data.private).toBe(0)
      expect(JSON.parse(response.text).data.editable).toBe(1)
  });

  test('update group error code', async () => {
      const response = await request(app).put(`/api/group/${99}`).send(`name=testgroup`).expect(404);
      expect(JSON.parse(response.text).error).toBe('group not found');
  });

  test('update group is succesful', async () => {
      const [id] = await knex('group').insert(testGroup)
      const response = await request(app).put(`/api/group/${id}`).send(`private=1`).expect(200);
      const newGroup = await knex.select('*').from('group').where('name', '=', 'testgroup');
      expect(JSON.parse(response.text).message).toBe("group updated successfully");
      expect(newGroup[0].private).toBe(1);
  });

  test('delete group is succesful', async () => {
    const [id] = await knex('group').insert(testGroup);
    const response = await request(app).delete(`/api/group/${id}`).expect(200)
    expect(JSON.parse(response.text).message).toBe("group deleted successfully");
  })

  test('add member to group is unsuccesful', async () => {
    const [iduser] = await knex('user').insert(testUser);
    const [idgroup] = await knex('group').insert(testGroup);
    const response = await request(app).post(`/api/member`).send(`idgroup=${idgroup}`).expect(400);
    expect(JSON.parse(response.text).error).toBe('invalid input, object invalid');
  })

  test('add member to group is succesful', async () => {
    const [iduser] = await knex('user').insert(testUser);
    const [idgroup] = await knex('group').insert(testGroup);
    const response = await request(app).post(`/api/member`).send(`idgroup=${idgroup}&iduser=${iduser}`).expect(200);
    expect(JSON.parse(response.text).message).toBe("member added successfully");
    const member = await knex.select('*').from('member').where('iduser', '=', iduser);
    expect(member).toHaveLength(1);
    expect(member[0].iduser).toBe(iduser);
    expect(member[0].idgroup).toBe(idgroup);
    expect(member[0].pending).toBe(0);
    expect(member[0].admin).toBe(0);
  })

  test('update member to group is unsuccesful', async () => {
    const [iduser] = await knex('user').insert(testUser);
    const [idgroup] = await knex('group').insert(testGroup);
    const response = await request(app).put(`/api/member`).send(`idgroup=${idgroup}`).expect(400);
    expect(JSON.parse(response.text).error).toBe('invalid input, object invalid');
  })

  test('update member to group is succesful', async () => {
    const [iduser] = await knex('user').insert(testUser);
    const [idgroup] = await knex('group').insert(testGroup);
    const member = {
      iduser,
      idgroup,
    }
    await knex('member').insert(member);
    const response = await request(app).put(`/api/member`).send(`idgroup=${idgroup}&iduser=${iduser}&admin=1&pending=1`).expect(200);
    expect(JSON.parse(response.text).message).toBe("member updated successfully");
    const updatedMember = await knex.select('*').from('member').where('iduser', '=', iduser);
    expect(updatedMember).toHaveLength(1);
    expect(updatedMember[0].idgroup).toBe(idgroup);
    expect(updatedMember[0].iduser).toBe(iduser);
    expect(updatedMember[0].admin).toBe(1);
    expect(updatedMember[0].pending).toBe(1);
  })

  test('delete member to group is unsuccesful', async () => {
    const [iduser] = await knex('user').insert(testUser);
    const [idgroup] = await knex('group').insert(testGroup);
    const member = {
      iduser,
      idgroup,
    }
    await knex('member').insert(member);
    const response = await request(app).delete(`/api/member`).send(`idgroup=${idgroup}`).expect(400);
    expect(JSON.parse(response.text).error).toBe("invalid input, object invalid");
  })

  test('delete member to group is succesful', async () => {
    const [iduser] = await knex('user').insert(testUser);
    const [idgroup] = await knex('group').insert(testGroup);
    const member = {
      iduser,
      idgroup,
    }
    await knex('member').insert(member);
    const response = await request(app).delete(`/api/member`).send(`idgroup=${idgroup}&iduser=${iduser}`).expect(200);
    expect(JSON.parse(response.text).message).toBe("member deleted successfully");
    const updatedMember = await knex.select('*').from('member').where('iduser', '=', iduser);
    expect(updatedMember).toHaveLength(0);
  })

  test('get all groups a user belongs to is succesful', async () => {
    const [iduser] = await knex('user').insert(testUser);
    const [idgroup] = await knex('group').insert(testGroup);
    const member = {
      iduser,
      idgroup,
    }
    await knex('member').insert(member);
    const response = await request(app).get(`/api/user/${iduser}/groups`).expect(200);
    expect(JSON.parse(response.text).data).toHaveLength(1)
    expect(JSON.parse(response.text).data[0].name).toBe('testgroup')
    expect(JSON.parse(response.text).data[0].description).toBe('test description')
  })

  test('get all members in group is succesful', async () => {
    const [iduser] = await knex('user').insert(testUser);
    const [idgroup] = await knex('group').insert(testGroup);
    const member = {
      iduser,
      idgroup,
    }
    await knex('member').insert(member);
    const response = await request(app).get(`/api/group/${idgroup}/users`).expect(200);
    expect(JSON.parse(response.text).data).toHaveLength(1)
    expect(JSON.parse(response.text).data[0].username).toBe('testuser')
    expect(JSON.parse(response.text).data[0].iduser).toBe(iduser)
  })

  test('get all non-members in group is succesful', async () => {
    const [idgroup] = await knex('group').insert(testGroup);
    const response = await request(app).get(`/api/group/${idgroup}/nonusers`).expect(200);
    const allMembers = await knex.select('*').from('user');
    expect(JSON.parse(response.text).data).toHaveLength(allMembers.length);
  })

  test('add grouptag error code', async () => {
    const [iduser] = await knex('user').insert(testUser);
    const [idgroup] = await knex('group').insert(testGroup);
    const response = await request(app).post(`/api/grouptag/${idgroup}`).expect(400);
    expect(JSON.parse(response.text).error).toBe("invalid input, object invalid");
  });

  test('add grouptag is succesful', async () => {
    const [iduser] = await knex('user').insert(testUser);
    const [idgroup] = await knex('group').insert(testGroup);
    const response = await request(app).post(`/api/grouptag/${idgroup}`).send(`tag=testgrouptag`).expect(200);
    const newGroupTag = await knex.select('*').from('grouptag').where('tag', '=', 'testgrouptag');
    expect(JSON.parse(response.text).message).toBe("grouptag added to group successfully");
    expect(newGroupTag[0].tag).toBe('testgrouptag');
  });

  test('get grouptag for group is succesful', async () => {
    const [iduser] = await knex('user').insert(testUser);
    const [idgroup] = await knex('group').insert(testGroup);
    testGrouptag.idgroup = idgroup;
    await knex('grouptag').insert(testGrouptag);
    const response = await request(app).get(`/api/grouptag/${idgroup}`).expect(200);
    expect(JSON.parse(response.text).data).toHaveLength(1);
    expect(JSON.parse(response.text).data[0].tag).toBe('testgrouptag');
  });

  test('delete grouptag for group error code', async () => {
    const [iduser] = await knex('user').insert(testUser);
    const [idgroup] = await knex('group').insert(testGroup);
    const response = await request(app).delete(`/api/grouptag/${99}`).expect(400);
    expect(JSON.parse(response.text).error).toBe("invalid input, object invalid");
  });

  test('delete grouptag for group is succesful', async () => {
    const [iduser] = await knex('user').insert(testUser);
    const [idgroup] = await knex('group').insert(testGroup);
    testGrouptag.idgroup = idgroup;
    await knex('grouptag').insert(testGrouptag);
    const response = await request(app).delete(`/api/grouptag/${idgroup}`).send({tag:'testgrouptag'}).expect(200);
    expect(JSON.parse(response.text).message).toBe("grouptag removed from group successfully");
    const groupTags = await knex.select('*').from('grouptag').where('idgroup', '=', idgroup);
    expect(groupTags).toHaveLength(0);
  });

});

describe('Post table endpoint API & integration test', () => {
  const testUser = {
    username: 'testuser',
    password: 'password',
    email: 'test@email.com'
  };
  const testGroup = {
    name: 'testgroup',
    description: 'test description',
    private: 0,
    editable: 1
  };
  const testPost = {
    title: 'testposttitle',
    content: "test content",
  };
  const testHashtag = {
    hashtag: 'testhashtag'
  };

  test('post post error code ', async () => {
    const response = await request(app).post('/api/post').expect(400);
    expect(JSON.parse(response.text).error).toBe('invalid input, object invalid');
  })

  test('post post is successful', async () => {
    const [iduser] = await knex('user').insert(testUser);
    const [idgroup] = await knex('group').insert(testGroup);
    await request(app).post('/api/post').send(`title=testposttitle&content=test content&iduser=${iduser}&idgroup=${idgroup}`).expect(201);
    const newPost = await knex.select('*').from('post').where('title', '=', 'testposttitle');
    expect(newPost[0].iduser).toBe(iduser);
    expect(newPost[0].idgroup).toBe(idgroup);
    expect(newPost[0].title).toBe("testposttitle");
    expect(newPost[0].content).toBe("test content");
  })

  test('get posts is succesful', async () => {
    const response = await request(app).get('/api/posts').expect(200);
  });

  test('get post is succesful', async () => {
    const [iduser] = await knex('user').insert(testUser);
    const [idgroup] = await knex('group').insert(testGroup);
    testPost.iduser = iduser;
    testPost.idgroup = idgroup;
    const [idpost] = await knex('post').insert(testPost);
    const response = await request(app).get(`/api/post/${idpost}`).expect(200);
    expect(JSON.parse(response.text).data.iduser).toBe(iduser)
    expect(JSON.parse(response.text).data.idgroup).toBe(idgroup)
    expect(JSON.parse(response.text).data.title).toBe("testposttitle")
    expect(JSON.parse(response.text).data.content).toBe("test content")
  });

  test('update post error code', async () => {
    const response = await request(app).put(`/api/post/${99}`).send(`title=testposttitle&content=test content`).expect(404);
    expect(JSON.parse(response.text).error).toBe('post not found');
  });

  test('update post is succesful', async () => {
    const [iduser] = await knex('user').insert(testUser);
    const [idgroup] = await knex('group').insert(testGroup);
    testPost.iduser = iduser;
    testPost.idgroup = idgroup;
    const [idpost] = await knex('post').insert(testPost);
    const response = await request(app).put(`/api/post/${idpost}`).send(`title=testposttitle&content=changed content`).expect(200);
    expect(JSON.parse(response.text).message).toBe("post updated successfully");
    const updatedPost = await knex.select('*').from('post').where('title', '=', 'testposttitle');
    expect(updatedPost[0].iduser).toBe(iduser);
    expect(updatedPost[0].idgroup).toBe(idgroup);
    expect(updatedPost[0].title).toBe("testposttitle");
    expect(updatedPost[0].content).toBe("changed content");
  });

  test('delete post is succesful', async () => {
    const [iduser] = await knex('user').insert(testUser);
    const [idgroup] = await knex('group').insert(testGroup);
    testPost.iduser = iduser;
    testPost.idgroup = idgroup;
    const [idpost] = await knex('post').insert(testPost);
    const response = await request(app).delete(`/api/post/${idpost}`).expect(200)
    expect(JSON.parse(response.text).message).toBe("post deleted successfully");
  })

  test('get all posts a user has made is successful', async () => {
    const [iduser] = await knex('user').insert(testUser);
    const [idgroup] = await knex('group').insert(testGroup);
    testPost.iduser = iduser;
    testPost.idgroup = idgroup;
    const [idpost] = await knex('post').insert(testPost);
    const response = await request(app).get(`/api/user/${iduser}/posts`).expect(200);
    expect(JSON.parse(response.text).data).toHaveLength(1)
    expect(JSON.parse(response.text).data[0].iduser).toBe(iduser)
    expect(JSON.parse(response.text).data[0].idgroup).toBe(idgroup)
    expect(JSON.parse(response.text).data[0].title).toBe("testposttitle")
    expect(JSON.parse(response.text).data[0].content).toBe("test content")
  })

  test('get all posts within a group is successful', async () => {
    const [iduser] = await knex('user').insert(testUser);
    const [idgroup] = await knex('group').insert(testGroup);
    testPost.iduser = iduser;
    testPost.idgroup = idgroup;
    const [idpost] = await knex('post').insert(testPost);
    const response = await request(app).get(`/api/group/${idgroup}/posts`).expect(200);
    expect(JSON.parse(response.text).data).toHaveLength(1)
    expect(JSON.parse(response.text).data[0].iduser).toBe(iduser)
    expect(JSON.parse(response.text).data[0].idgroup).toBe(idgroup)
    expect(JSON.parse(response.text).data[0].title).toBe("testposttitle")
    expect(JSON.parse(response.text).data[0].content).toBe("test content")
  })

  test('add hashtag to post error code', async () => {
    const [iduser] = await knex('user').insert(testUser);
    const [idgroup] = await knex('group').insert(testGroup);
    testPost.iduser = iduser;
    testPost.idgroup = idgroup;
    const [idpost] = await knex('post').insert(testPost);
    const response = await request(app).post(`/api/hashtag`).expect(400);
    expect(JSON.parse(response.text).error).toBe('invalid input, object invalid');
  })

  test('add hashtag to post is succesful', async () => {
    const [iduser] = await knex('user').insert(testUser);
    const [idgroup] = await knex('group').insert(testGroup);
    testPost.iduser = iduser;
    testPost.idgroup = idgroup;
    const [idpost] = await knex('post').insert(testPost);
    testHashtag.idpost = idpost;
    const response = await request(app).post(`/api/hashtag`).send(testHashtag).expect(200);
    const newHashtag = await knex.select('*').from('hashtag').where('idpost', '=', idpost);
    expect(newHashtag[0].idpost).toBe(idpost);
    expect(newHashtag[0].hashtag).toBe('testhashtag');
  })

  test('get hashtag error code', async () => {
    const [iduser] = await knex('user').insert(testUser);
    const [idgroup] = await knex('group').insert(testGroup);
    testPost.iduser = iduser;
    testPost.idgroup = idgroup;
    const [idpost] = await knex('post').insert(testPost);
    testHashtag.idpost = idpost;
    await knex('hashtag').insert(testHashtag);
    const response = await request(app).get(`/api/hashtag`).expect(400);
    expect(JSON.parse(response.text).error).toBe('invalid input, object invalid');
  })

  test('get hashtag from post is succesful', async () => {
    const [iduser] = await knex('user').insert(testUser);
    const [idgroup] = await knex('group').insert(testGroup);
    testPost.iduser = iduser;
    testPost.idgroup = idgroup;
    const [idpost] = await knex('post').insert(testPost);
    testHashtag.idpost = idpost;
    await knex('hashtag').insert(testHashtag);
    const response = await request(app).get(`/api/hashtag?idpost=${idpost}`).expect(200);
    expect(JSON.parse(response.text).data).toHaveLength(1);
    expect(JSON.parse(response.text).data[0].hashtag).toBe('testhashtag');
  })

  test('delete hashtag is succesful', async () => {
    const [iduser] = await knex('user').insert(testUser);
    const [idgroup] = await knex('group').insert(testGroup);
    testPost.iduser = iduser;
    testPost.idgroup = idgroup;
    const [idpost] = await knex('post').insert(testPost);
    testHashtag.idpost = idpost;
    await knex('hashtag').insert(testHashtag);
    const response = await request(app).delete(`/api/hashtag/post/${idpost}`).expect(200);
    expect(JSON.parse(response.text).message).toBe("Hashtags removed successfully");
  })
});

describe('Comment table endpoint API & integration test', () => {
  const testUser = {
    username: 'testuser',
    password: 'password',
    email: 'test@email.com'
  };
  const testGroup = {
    name: 'testgroup',
    description: 'test description',
    private: 0,
    editable: 1
  };
  const testPost = {
    title: 'testposttitle',
    content: "test content",
  };
  const testComment = {
    content: "test comment",
  };

  test('post comment error code ', async () => {
    const response = await request(app).post('/api/comment').expect(400);
    expect(JSON.parse(response.text).error).toBe('invalid input, object invalid');
  })

  test('post comment is successful', async () => {
    const [iduser] = await knex('user').insert(testUser);
    const [idgroup] = await knex('group').insert(testGroup);
    testPost.iduser = iduser;
    testPost.idgroup = idgroup;
    const [idpost] = await knex('post').insert(testPost);
    await request(app).post('/api/comment').send(`iduser=${iduser}&idpost=${idpost}&content=test comment`).expect(201);
    const newComment = await knex.select('*').from('comment').where('content', '=', 'test comment');
    expect(newComment[0].iduser).toBe(iduser);
    expect(newComment[0].idpost).toBe(idpost);
    expect(newComment[0].content).toBe("test comment");
  })

  test('get comment is succesful', async () => {
    const [iduser] = await knex('user').insert(testUser);
    testGroup.creator = iduser;
    const [idgroup] = await knex('group').insert(testGroup);
    testPost.iduser = iduser;
    testPost.idgroup = idgroup;
    const [idpost] = await knex('post').insert(testPost);
    testComment.iduser = iduser;
    testComment.idpost = idpost;
    const [idcomment] = await knex('comment').insert(testComment);
    const response = await request(app).get(`/api/comment/${idcomment}`).expect(200);
    expect(JSON.parse(response.text).data.iduser).toBe(iduser)
    expect(JSON.parse(response.text).data.idpost).toBe(idpost)
    expect(JSON.parse(response.text).data.idcomment).toBe(idcomment)
    expect(JSON.parse(response.text).data.content).toBe("test comment")
  });

  test('update comment error code', async () => {
    const response = await request(app).put(`/api/comment/${99}`).expect(400);
    expect(JSON.parse(response.text).error).toBe('invalid input, object invalid');
  });

  test('update comment is succesful', async () => {
    const [iduser] = await knex('user').insert(testUser);
    const [idgroup] = await knex('group').insert(testGroup);
    testPost.iduser = iduser;
    testPost.idgroup = idgroup;
    const [idpost] = await knex('post').insert(testPost);
    testComment.iduser = iduser;
    testComment.idpost = idpost;
    const [idcomment] = await knex('comment').insert(testComment);
    const response = await request(app).put(`/api/comment/${idcomment}`).send(`content=different comment`).expect(200);
    expect(JSON.parse(response.text).message).toBe("comment updated successfully");
    const updatedPost = await knex.select('*').from('comment').where('idcomment', '=', idcomment);
    expect(updatedPost[0].iduser).toBe(iduser);
    expect(updatedPost[0].idpost).toBe(idpost);
    expect(updatedPost[0].content).toBe("different comment");
  });

  test('delete comment is succesful', async () => {
    const [iduser] = await knex('user').insert(testUser);
    const [idgroup] = await knex('group').insert(testGroup);
    testPost.iduser = iduser;
    testPost.idgroup = idgroup;
    const [idpost] = await knex('post').insert(testPost);
    testComment.iduser = iduser;
    testComment.idpost = idpost;
    const [idcomment] = await knex('comment').insert(testComment);
    const response = await request(app).delete(`/api/comment/${idcomment}`).expect(200);
    expect(JSON.parse(response.text).message).toBe("comment deleted successfully");
  })

  test('get all comments for a post', async () => {
    const [iduser] = await knex('user').insert(testUser);
    const [idgroup] = await knex('group').insert(testGroup);
    testPost.iduser = iduser;
    testPost.idgroup = idgroup;
    const [idpost] = await knex('post').insert(testPost);
    testComment.iduser = iduser;
    testComment.idpost = idpost;
    const [idcomment] = await knex('comment').insert(testComment);
    const response = await request(app).get(`/api/post/${idpost}/comments`).expect(200);
    expect(JSON.parse(response.text).data).toHaveLength(1)
    expect(JSON.parse(response.text).data[0].iduser).toBe(iduser)
    expect(JSON.parse(response.text).data[0].idpost).toBe(idpost)
    expect(JSON.parse(response.text).data[0].content).toBe("test comment")
  })

  test('get all comments a user has made', async () => {
    const [iduser] = await knex('user').insert(testUser);
    const [idgroup] = await knex('group').insert(testGroup);
    testPost.iduser = iduser;
    testPost.idgroup = idgroup;
    const [idpost] = await knex('post').insert(testPost);
    testComment.iduser = iduser;
    testComment.idpost = idpost;
    const [idcomment] = await knex('comment').insert(testComment);
    const response = await request(app).get(`/api/user/${iduser}/comments`).expect(200);
    expect(JSON.parse(response.text).data).toHaveLength(1)
    expect(JSON.parse(response.text).data[0].iduser).toBe(iduser)
    expect(JSON.parse(response.text).data[0].idpost).toBe(idpost)
    expect(JSON.parse(response.text).data[0].content).toBe("test comment")
  })
});

describe('Reply table endpoint API & integration test', () => {
  const testUser = {
    username: 'testuser',
    password: 'password',
    email: 'test@email.com'
  };
  const testGroup = {
    name: 'testgroup',
    description: 'test description',
    private: 0,
    editable: 1
  };
  const testPost = {
    title: 'testposttitle',
    content: "test content",
  };
  const testComment = {
    content: "test comment",
  };
  const testReply = {
    content: "test reply",
  };

  test('post reply error code ', async () => {
    const response = await request(app).post('/api/comment').expect(400);
    expect(JSON.parse(response.text).error).toBe('invalid input, object invalid');
  })

  test('post reply is successful', async () => {
    const [iduser] = await knex('user').insert(testUser);
    const [idgroup] = await knex('group').insert(testGroup);
    testPost.iduser = iduser;
    testPost.idgroup = idgroup;
    const [idpost] = await knex('post').insert(testPost);
    testComment.iduser = iduser;
    testComment.idpost = idpost;
    const [idcomment] = await knex('comment').insert(testComment);
    await request(app).post('/api/reply').send(`iduser=${iduser}&idcomment=${idcomment}&content=test reply`).expect(201);
    const newReply = await knex.select('*').from('reply').where('content', '=', 'test reply');
    expect(newReply[0].iduser).toBe(iduser);
    expect(newReply[0].idcomment).toBe(idcomment);
    expect(newReply[0].content).toBe("test reply");
  })

  test('get all replies for a comment is successful', async () => {
    const [iduser] = await knex('user').insert(testUser);
    const [idgroup] = await knex('group').insert(testGroup);
    testPost.iduser = iduser;
    testPost.idgroup = idgroup;
    const [idpost] = await knex('post').insert(testPost);
    testComment.iduser = iduser;
    testComment.idpost = idpost;
    const [idcomment] = await knex('comment').insert(testComment);
    testReply.iduser = iduser;
    testReply.idcomment = idcomment;
    const [idreply] = await knex('reply').insert(testReply);
    const response =  await request(app).get(`/api/comment/${idcomment}/replies`).expect(200);
    expect(JSON.parse(response.text).data.iduser).toBe(iduser);
    expect(JSON.parse(response.text).data.idcomment).toBe(idcomment);
    expect(JSON.parse(response.text).data.content).toBe("test reply");
  })

  test('get reply is succesful', async () => {
    const [iduser] = await knex('user').insert(testUser);
    const [idgroup] = await knex('group').insert(testGroup);
    testPost.iduser = iduser;
    testPost.idgroup = idgroup;
    const [idpost] = await knex('post').insert(testPost);
    testComment.iduser = iduser;
    testComment.idpost = idpost;
    const [idcomment] = await knex('comment').insert(testComment);
    testReply.iduser = iduser;
    testReply.idcomment = idcomment;
    const [idreply] = await knex('reply').insert(testReply);
    const response = await request(app).get(`/api/reply/${idreply}`).expect(200);
    expect(JSON.parse(response.text).data.iduser).toBe(iduser)
    expect(JSON.parse(response.text).data.idcomment).toBe(idcomment)
    expect(JSON.parse(response.text).data.content).toBe("test reply")
  });

  test('update reply error code', async () => {
    const response = await request(app).put(`/api/reply/${99}`).expect(400);
    expect(JSON.parse(response.text).error).toBe('invalid input, object invalid');
  });

  test('update comment is succesful', async () => {
    const [iduser] = await knex('user').insert(testUser);
    const [idgroup] = await knex('group').insert(testGroup);
    testPost.iduser = iduser;
    testPost.idgroup = idgroup;
    const [idpost] = await knex('post').insert(testPost);
    testComment.iduser = iduser;
    testComment.idpost = idpost;
    const [idcomment] = await knex('comment').insert(testComment);
    testReply.iduser = iduser;
    testReply.idcomment = idcomment;
    const [idreply] = await knex('reply').insert(testReply);
    const response = await request(app).put(`/api/reply/${idreply}`).send(`content=different reply`).expect(200);
    expect(JSON.parse(response.text).message).toBe("reply updated successfully");
    const updatedReply = await knex.select('*').from('reply').where('idreply', '=', idreply);
    expect(updatedReply[0].iduser).toBe(iduser);
    expect(updatedReply[0].idcomment).toBe(idcomment);
    expect(updatedReply[0].content).toBe("different reply");
  });

  test('delete reply is succesful', async () => {
    const [iduser] = await knex('user').insert(testUser);
    const [idgroup] = await knex('group').insert(testGroup);
    testPost.iduser = iduser;
    testPost.idgroup = idgroup;
    const [idpost] = await knex('post').insert(testPost);
    testComment.iduser = iduser;
    testComment.idpost = idpost;
    const [idcomment] = await knex('comment').insert(testComment);
    testReply.iduser = iduser;
    testReply.idcomment = idcomment;
    const [idreply] = await knex('reply').insert(testReply);
    const response = await request(app).delete(`/api/reply/${idreply}`).expect(200);
    expect(JSON.parse(response.text).message).toBe("reply deleted successfully");
  })

  test('get all replies by user', async () => {
    const [iduser] = await knex('user').insert(testUser);
    const [idgroup] = await knex('group').insert(testGroup);
    testPost.iduser = iduser;
    testPost.idgroup = idgroup;
    const [idpost] = await knex('post').insert(testPost);
    testComment.iduser = iduser;
    testComment.idpost = idpost;
    const [idcomment] = await knex('comment').insert(testComment);
    testReply.iduser = iduser;
    testReply.idcomment = idcomment;
    await knex('reply').insert(testReply);
    const response = await request(app).get(`/api/user/${iduser}/replies`).expect(200);
    expect(JSON.parse(response.text).data[0].idcomment).toBe(idcomment);
  });

  test('get all replies that user is mentioned in', async () => {
    const [iduser] = await knex('user').insert(testUser);
    const [idgroup] = await knex('group').insert(testGroup);
    testPost.iduser = iduser;
    testPost.idgroup = idgroup;
    const [idpost] = await knex('post').insert(testPost);
    testComment.iduser = iduser;
    testComment.idpost = idpost;
    const [idcomment] = await knex('comment').insert(testComment);
    testReply.iduser = iduser;
    testReply.idcomment = idcomment;
    const [idreply] = await knex('reply').insert(testReply);
    const testMention = {
      idpost, iduser, idcomment, idreply, hidden: false,
    };
    await knex('mention').insert(testMention);
    const response = await request(app).get(`/api/user/${iduser}/replies/mentioned`).expect(200);
    expect(JSON.parse(response.text).data.idreply).toBe(idreply);
    // clean up
    await knex('mention').where('idreply', idreply).del();
  });
});

describe('Chat/ChatGroup/Message table endpoint API & integration test', () => {
  const testUser = {
    username: 'testuser',
    password: 'password',
    email: 'test@email.com'
  };
  const playerTest = {
    username: 'usertest',
    password: 'password',
    email: 'test@email.com'
  };
  const testChat = {
    name: 'testchat',
    private: 0
  };
  const testMessage = {
    content : 'test message'
  };

  test('post chat error code ', async () => {
    const response = await request(app).post('/api/chat').expect(400);
    expect(JSON.parse(response.text).error).toBe('invalid input, object invalid');
  })

  test('post chat is successful', async () => {
    const [iduser] = await knex('user').insert(testUser);
    await request(app).post('/api/chat').send(`iduser=${iduser}&name=testchat&private=0`).expect(201);
    const newChat = await knex.select('*').from('chat').where('name', '=', 'testchat');
    expect(newChat[0].iduser).toBe(iduser);
    expect(newChat[0].private).toBe(0);
    expect(newChat[0].name).toBe("testchat");
  })

  test('update chat is successful', async () => {
    const [iduser] = await knex('user').insert(testUser);
    testChat.iduser = iduser;
    const [idchat] = await knex('chat').insert(testChat);
    await request(app).put('/api/chat').send(`idchat=${idchat}&name=testchat&private=1`).expect(200);
    const updatedChat = await knex.select('*').from('chat').where('idchat', '=', idchat);
    expect(updatedChat[0].idchat).toBe(idchat);
    expect(updatedChat[0].private).toBe(1);
    expect(updatedChat[0].name).toBe("testchat");
  })

  test('delete chat is succesful', async () => {
    const [iduser] = await knex('user').insert(testUser);
    testChat.iduser = iduser;
    const [idchat] = await knex('chat').insert(testChat);
    const response = await request(app).delete(`/api/chat/`).send(`idchat=${idchat}`).expect(200);
    expect(JSON.parse(response.text).message).toBe("chat deleted successfully");
  })

  test('add user to chatgroup error code', async () => {
    const response = await request(app).post(`/api/chatgroup/${99}`).expect(400);
    expect(JSON.parse(response.text).error).toBe('invalid input, object invalid');
  });

  test('add user to chatgroup is succesful', async () => {
    const [iduser] = await knex('user').insert(testUser);
    testChat.iduser = iduser;
    const [idchat] = await knex('chat').insert(testChat);
    await request(app).post(`/api/chatgroup/${idchat}`).send(`iduser=${iduser}`).expect(200);
    const newChatgroup = await knex.select('*').from('chatgroup').where('iduser', '=', iduser);
    expect(newChatgroup[0].iduser).toBe(iduser);
    expect(newChatgroup[0].idchat).toBe(idchat);
  });

  test('delete user to chatgroup error code', async () => {
    const response = await request(app).delete(`/api/chatgroup/${99}`).expect(400);
    expect(JSON.parse(response.text).error).toBe('invalid input, object invalid');
  });

  test('delete user from chatgroup is succesful', async () => {
    const [iduser] = await knex('user').insert(testUser);
    testChat.iduser = iduser;
    const [idchat] = await knex('chat').insert(testChat);
    await knex('chatgroup').insert({iduser, idchat});
    const response = await request(app).delete(`/api/chatgroup/${idchat}`).send(`iduser=${iduser}`).expect(200);
    expect(JSON.parse(response.text).message).toBe("user removed from chat successfully");
  })

  test('add message to chat error code', async () => {
    const [iduser] = await knex('user').insert(testUser);
    testChat.iduser = iduser;
    const [idchat] = await knex('chat').insert(testChat);
    await knex('chatgroup').insert({iduser, idchat});
    const response = await request(app).post(`/api/message/${99}`).expect(400);
    expect(JSON.parse(response.text).error).toBe('invalid input, object invalid');
  });

  test('add message to chat is successful', async () => {
    const [iduser] = await knex('user').insert(testUser);
    testChat.iduser = iduser;
    const [idchat] = await knex('chat').insert(testChat);
    await knex('chatgroup').insert({iduser, idchat});
    testMessage.iduser = iduser;
    const response = await request(app).post(`/api/message/${idchat}`).send(testMessage).expect(200);
    const newMessage = await knex.select('*').from('message').where('idchat', '=', idchat);
    expect(newMessage[0].idsender).toBe(iduser);
    expect(newMessage[0].idchat).toBe(idchat);
    expect(newMessage[0].content).toBe('test message');
  });

  test('get messages from chat is successful', async () => {
    const [iduser] = await knex('user').insert(testUser);
    testChat.iduser = iduser;
    const [idchat] = await knex('chat').insert(testChat);
    await knex('chatgroup').insert({iduser, idchat});
    testMessage.idchat = idchat;
    testMessage.idsender = iduser;
    await knex('message').insert({idchat, idsender:iduser, content: 'test message'});
    const response = await request(app).get(`/api/message/${idchat}`).expect(200);
    expect(JSON.parse(response.text).data).toHaveLength(1);
    expect(JSON.parse(response.text).data[0].idsender).toBe(iduser);
    expect(JSON.parse(response.text).data[0].idchat).toBe(idchat);
    expect(JSON.parse(response.text).data[0].content).toBe("test message");
  });

  test('get messages from chat that user sent is successful', async () => {
    const [iduser] = await knex('user').insert(testUser);
    testChat.iduser = iduser;
    const [idchat] = await knex('chat').insert(testChat);
    await knex('chatgroup').insert({iduser, idchat});
    testMessage.idchat = idchat;
    testMessage.idsender = iduser;
    await knex('message').insert({idchat, idsender:iduser, content: 'test message'});
    const response = await request(app).get(`/api/message/${idchat}/user/${iduser}`).expect(200);
    expect(JSON.parse(response.text).data).toHaveLength(1);
    expect(JSON.parse(response.text).data[0].idsender).toBe(iduser);
    expect(JSON.parse(response.text).data[0].idchat).toBe(idchat);
    expect(JSON.parse(response.text).data[0].content).toBe("test message");
  });
});

describe('Notification table endpoint API & integration test', () => {
  const testUser = {
    username: 'testuser',
    password: 'password',
    email: 'test@email.com'
  };
  const testNotification = {
    notification: 'test notification'
  };

  test('post notification error code ', async () => {
    const response = await request(app).post('/api/notification').expect(400);
    expect(JSON.parse(response.text).error).toBe('user id is missing');
  })

  test('post notification is successful', async () => {
    const [iduser] = await knex('user').insert(testUser);
    testNotification.userid = iduser;
    const response = await request(app).post('/api/notification').send(testNotification).expect(200);
    const notification = await knex.select('*').from('notification').where('iduser', '=', iduser);
    expect(notification[0].iduser).toBe(iduser);
    expect(notification[0].notification).toBe('test notification');
  })

  test('get notification is successful', async () => {
    const [iduser] = await knex('user').insert(testUser);
    const [idnotification] = await knex('notification').insert({iduser:iduser, notification:'test notification'});
    const response = await request(app).get(`/api/notification/${iduser}`).expect(200);
    expect(JSON.parse(response.text).data).toHaveLength(1);
    expect(JSON.parse(response.text).data[0].iduser).toBe(iduser);
    expect(JSON.parse(response.text).data[0].idnotification).toBe(idnotification);
    expect(JSON.parse(response.text).data[0].notification).toBe("test notification");
  })

  test('delete chat is successful', async () => {
    const [iduser] = await knex('user').insert(testUser);
    const [idnotification] = await knex('notification').insert({iduser:iduser, notification:'test notification'});
    const response = await request(app).delete(`/api/notification/${iduser}`).expect(200);
  })
});

describe('hide table endpoint API & integration test', () => {
  const testUser = {
    username: 'testuser',
    password: 'password',
    email: 'test@email.com'
  };
  const testGroup = {
    name: 'testgroup',
    description: 'test description',
    private: 0,
    editable: 1
  };
  const testPost = {
    title: 'testposttitle',
    content: "test content",
  };
  const hideRequest = { userid: undefined, postid: undefined, groupid: undefined };
  const hideRequestTwo = { iduser: undefined, idpost: undefined, idgroup: undefined };

  test('get all hidden post', async () => {
    const [iduser] = await knex('user').insert(testUser);
    const [idgroup] = await knex('group').insert(testGroup);
    testPost.iduser = iduser;
    testPost.idgroup = idgroup;
    const [idpost] = await knex('post').insert(testPost);

    // 404
    await request(app).get('/api/hide/').expect(404);

    // 200
    hideRequestTwo.iduser = iduser;
    hideRequestTwo.idpost = idpost;
    hideRequestTwo.idgroup = idgroup;
    await knex('hide').insert(hideRequestTwo);
    const response = await request(app).get(`/api/hide/${iduser}/${idgroup}`).expect(200);
    expect(JSON.parse(response.text).data[0].idpost).toBe(idpost);

    // clean up
    await knex('hide').where('iduser', iduser).del();
  });

  test('get all users hiding a post', async () => {
    const [iduser] = await knex('user').insert(testUser);
    const [idgroup] = await knex('group').insert(testGroup);
    testPost.iduser = iduser;
    testPost.idgroup = idgroup;
    const [idpost] = await knex('post').insert(testPost);

    // 404
    await request(app).get('/api/hideby/post/').expect(404);

    // 200
    hideRequestTwo.iduser = iduser;
    hideRequestTwo.idpost = idpost;
    hideRequestTwo.idgroup = idgroup;
    await knex('hide').insert(hideRequestTwo);
    const response = await request(app).get(`/api/hideby/post/${idpost}`).expect(200);
    expect(JSON.parse(response.text).data[0].iduser).toBe(iduser);
    await knex('hide').where('iduser', iduser).del();
  });

  test('add hide when user hide a post', async () => {
    const [iduser] = await knex('user').insert(testUser);
    const [idgroup] = await knex('group').insert(testGroup);
    testPost.iduser = iduser;
    testPost.idgroup = idgroup;
    const [idpost] = await knex('post').insert(testPost);

    // 400
    await request(app).post('/api/hide/').send({}).expect(400);

    // 200
    hideRequest.userid = iduser;
    hideRequest.postid = idpost;
    hideRequest.groupid = idgroup;
    await request(app).post('/api/hide/').send(hideRequest).expect(200);

    const response = await knex('hide').where('iduser', iduser);
    expect(response[0].idpost).toBe(idpost);
    await knex('hide').where('iduser', iduser).del();
  });

  test('delete user-post hide pair', async () => {
    const [iduser] = await knex('user').insert(testUser);
    const [idgroup] = await knex('group').insert(testGroup);
    testPost.iduser = iduser;
    testPost.idgroup = idgroup;
    const [idpost] = await knex('post').insert(testPost);

    // 404
    await request(app).delete('/api/hide/').expect(404);

    // 200
    hideRequestTwo.iduser = iduser;
    hideRequestTwo.idpost = idpost;
    hideRequestTwo.idgroup = idgroup;
    await knex('hide').insert(hideRequestTwo);
    await request(app).delete(`/api/hide/${iduser}/${idpost}`).expect(200);
    const response = await knex('hide').where('iduser', iduser);
    expect(response.length).toBe(0);

    // clean up
    await knex('hide').where('iduser', iduser).del();
  });
});

describe('mention table endpoint API & integration test', () => {
  const testUser = {
    username: 'testuser',
    password: 'password',
    email: 'test@email.com'
  };
  const testGroup = {
    name: 'testgroup',
    description: 'test description',
    private: 0,
    editable: 1
  };
  const testPost = {
    title: 'testposttitle',
    content: "test content",
  };
  const testComment = {
    content: "test comment",
  };
  const testReply = {
    content: "test reply",
  };

  test('add mention', async () => {
    const [iduser] = await knex('user').insert(testUser);
    const [idgroup] = await knex('group').insert(testGroup);
    testPost.iduser = iduser;
    testPost.idgroup = idgroup;
    const [idpost] = await knex('post').insert(testPost);
    testComment.iduser = iduser;
    testComment.idpost = idpost;
    const [idcomment] = await knex('comment').insert(testComment);
    testReply.iduser = iduser;
    testReply.idcomment = idcomment;
    const [idreply] = await knex('reply').insert(testReply);

    // 400
    await request(app).post('/api/mention').expect(400);

    // post
    let testMention = {
      iduser, idpost,
    };
    await request(app).post('/api/mention').send(testMention).expect(200);
    let response = await knex('mention').where('iduser', iduser);
    expect(response[0].idpost).toBe(idpost);

    // comment
    testMention = {
      iduser, idcomment,
    };
    await request(app).post('/api/mention').send(testMention).expect(200);
    response = await knex('mention').where('idcomment', idcomment);
    expect(response[0].iduser).toBe(iduser);

    // comment
    testMention = {
      iduser, idreply,
    };
    await request(app).post('/api/mention').send(testMention).expect(200);
    response = await knex('mention').where('idreply', idreply);
    expect(response[0].iduser).toBe(iduser);

    // clean up
    await knex('mention').where('iduser', iduser).del();
  });

  test('delete mention', async () => {
    const [iduser] = await knex('user').insert(testUser);
    const [idgroup] = await knex('group').insert(testGroup);
    testPost.iduser = iduser;
    testPost.idgroup = idgroup;
    const [idpost] = await knex('post').insert(testPost);
    testComment.iduser = iduser;
    testComment.idpost = idpost;
    const [idcomment] = await knex('comment').insert(testComment);
    testReply.iduser = iduser;
    testReply.idcomment = idcomment;
    const [idreply] = await knex('reply').insert(testReply);

    // 400
    await request(app).delete('/api/mention').expect(400);

    // comment
    let testMentionKnex = {
      iduser, idcomment, idreply: -1, idpost: -1,
    };
    let testMention = {
      iduser, idcomment,
    };
    await knex('mention').insert(testMentionKnex);
    let response = await knex('mention').where('idcomment', idcomment);
    expect(response.length).toBe(1);

    await request(app).delete('/api/mention').send(testMention).expect(200);
    response = await knex('mention').where('idcomment', idcomment);
    expect(response.length).toBe(0);

    // post
    testMentionKnex = {
      iduser, idcomment: -1, idreply: -1, idpost,
    };
    testMention = {
      iduser, idpost,
    };
    await knex('mention').insert(testMentionKnex);
    response = await knex('mention').where('idpost', idpost);
    expect(response.length).toBe(1);

    await request(app).delete('/api/mention').send(testMention).expect(200);
    response = await knex('mention').where('idpost', idpost);
    expect(response.length).toBe(0);

    // reply
    testMentionKnex = {
      iduser, idcomment: -1, idreply, idpost: -1,
    };
    testMention = {
      iduser, idreply,
    };
    await knex('mention').insert(testMentionKnex);
    response = await knex('mention').where('idreply', idreply);
    expect(response.length).toBe(1);

    await request(app).delete('/api/mention').send(testMention).expect(200);
    response = await knex('mention').where('idreply', idreply);
    expect(response.length).toBe(0);

    // clean up
    await knex('mention').where('idreply', idreply).del();
  });

  test('get all posts that user is mentioned in', async () => {
    const [iduser] = await knex('user').insert(testUser);
    const [idgroup] = await knex('group').insert(testGroup);
    testPost.iduser = iduser;
    testPost.idgroup = idgroup;
    const [idpost] = await knex('post').insert(testPost);


    const testMention = {
      idpost, iduser, idcomment: -1, idreply: -1, hidden: false,
    };
    await knex('mention').insert(testMention);
    const response = await request(app).get(`/api/user/${iduser}/posts/mentioned`).expect(200);
    expect(JSON.parse(response.text).data[0].idpost).toBe(idpost);
    // clean up
    await knex('mention').where('idpost', idpost).del();
  });

  test('get all comment that user is mentioned in', async () => {
    const [iduser] = await knex('user').insert(testUser);
    const [idgroup] = await knex('group').insert(testGroup);
    testPost.iduser = iduser;
    testPost.idgroup = idgroup;
    const [idpost] = await knex('post').insert(testPost);
    testComment.iduser = iduser;
    testComment.idpost = idpost;
    const [idcomment] = await knex('comment').insert(testComment);

    const testMention = {
      idpost: -1, iduser, idcomment, idreply: -1, hidden: false,
    };
    await knex('mention').insert(testMention);
    const response = await request(app).get(`/api/user/${iduser}/comments/mentioned`).expect(200);
    expect(JSON.parse(response.text).data[0].idcomment).toBe(idcomment);
    // clean up
    await knex('mention').where('idcomment', idcomment).del();
  });
});
