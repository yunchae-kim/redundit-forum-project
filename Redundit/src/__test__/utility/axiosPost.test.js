/* eslint-disable no-undef */
const axios = require("axios");
const MockAdapter = require("axios-mock-adapter");
const lib = require("../../utility/axiosPost");

const mockAxios = new MockAdapter(axios);

const testDataPost = {
  idpost: 1,
  iduser: 1,
  idgroup: 1,
  title: "newPost",
  date: {},
  content: "this is a new post",
  status: true,
  flagged: false,
  image: "https://source.unsplash.com/random",
  audio: "https://source.unsplash.com/random",
  video: "https://source.unsplash.com/random",
};

describe("test creat post axios api", () => {
  mockAxios.onPost()
    .replyOnce(201, { data: testDataPost })
    .onPost()
    .replyOnce(400);

  test("should creat post with 201 code", () => {
    lib.createPost(testDataPost).then((response) => {
      expect(response).toStrictEqual(testDataPost);
    });
  });

  test("should return error with 400 code", () => {
    expect(lib.createPost(testDataPost)).rejects.toThrowError();
  });
});

describe("test get all posts axios api", () => {
  mockAxios.onGet()
    .replyOnce(200, { data: [testDataPost] })
    .onGet()
    .replyOnce(404);

  test("should get all post with 200 code", () => {
    lib.getAllPosts().then((response) => {
      expect(response).toStrictEqual([testDataPost]);
    });
  });

  test("should return error with 404 code", () => {
    expect(lib.getAllPosts()).rejects.toThrowError();
  });
});

describe("test get post by id axios api", () => {
  mockAxios.onGet()
    .replyOnce(200, { data: testDataPost })
    .onGet()
    .replyOnce(404);

  test("should get all post with 200 code", () => {
    lib.getPostById(1).then((response) => {
      expect(response).toStrictEqual(testDataPost);
    });
  });

  test("should return error with 404 code", () => {
    expect(lib.getPostById(1)).rejects.toThrowError();
  });
});

describe("test update post by id axios api", () => {
  mockAxios.onPut()
    .replyOnce(200, { message: "post updated successfully" })
    .onPut()
    .replyOnce(404);

  test("should get all post with 200 code", () => {
    lib.putPostById(1, testDataPost).then((response) => {
      expect(response.message).toStrictEqual("post updated successfully");
    });
  });

  test("should return error with 404 code", () => {
    expect(lib.putPostById(1, testDataPost)).rejects.toThrowError();
  });
});

describe("test delete post by id axios api", () => {
  mockAxios.onDelete()
    .replyOnce(200, { message: "post deleted successfully" })
    .onDelete()
    .replyOnce(404);

  test("should delete post by id with 200 code", () => {
    lib.deletePostById(1).then((response) => {
      expect(response.message).toStrictEqual("post deleted successfully");
    });
  });

  test("should return error with 404 code", () => {
    expect(lib.deletePostById(1)).rejects.toThrowError();
  });
});

describe("test get all posts in group axios api", () => {
  mockAxios.onGet()
    .replyOnce(200, { data: [testDataPost] })
    .onGet()
    .replyOnce(404);

  test("should get all post in group with 200 code", () => {
    lib.getAllPostsInGroup(1).then((response) => {
      expect(response).toStrictEqual([testDataPost]);
    });
  });

  test("should return error with 404 code", () => {
    expect(lib.getAllPostsInGroup(1)).rejects.toThrowError();
  });
});

describe("test get posts by user axios api", () => {
  mockAxios.onGet()
    .replyOnce(200, { data: [testDataPost] })
    .onGet()
    .replyOnce(404);

  test("should get post by userID with 200 code", () => {
    lib.getPostsByUser(1).then((response) => {
      expect(response.data).toStrictEqual([testDataPost]);
    });
  });

  test("should return error with 404 code", () => {
    expect(lib.getPostsByUser(1)).rejects.toThrowError();
  });
});

describe("test get flagged post in group axios api", () => {
  mockAxios.onGet()
    .replyOnce(200, { data: [testDataPost] })
    .onGet()
    .replyOnce(404);

  test("should get flagged post in group with 200 code", () => {
    lib.getFlaggedPostsInGroup(1).then((response) => {
      expect(response).toStrictEqual([testDataPost]);
    });
  });

  test("should return error with 404 code", () => {
    expect(lib.getFlaggedPostsInGroup(1)).rejects.toThrowError();
  });
});

describe("test flag post by id axios api", () => {
  mockAxios.onPut()
    .replyOnce(200, { data: { message: "post updated successfully" } })
    .onPut()
    .replyOnce(404);

  test("should get flagged post in group with 200 code", () => {
    lib.flagPostById(1, true).then((response) => {
      expect(response.data.message).toStrictEqual("post updated successfully");
    });
  });

  test("should return error with 404 code", () => {
    expect(lib.flagPostById(1, true)).rejects.toThrowError();
  });
});
