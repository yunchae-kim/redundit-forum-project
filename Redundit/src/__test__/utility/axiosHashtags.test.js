/* eslint-disable no-undef */
const axios = require("axios");
const MockAdapter = require("axios-mock-adapter");
const lib = require("../../utility/axiosHashtags");

const mockAxios = new MockAdapter(axios);

const testDataHashTag = {
  idpost: 1,
  idcomment: 1,
  idreply: 1,
  hashtag: null,
};

const testDataHashTags = {
  tags: ["tag1", "tag2", "tag3"],
  id: 1,
  type: "post",
};

const testResponse = {
  data: [testDataHashTag],
};

describe("test add hashtag axios api", () => {
  mockAxios.onPost()
    .replyOnce(200, { data: { message: "hashtag added successfully" } })
    .onPost()
    .replyOnce(200, { data: { message: "hashtag added successfully" } })
    .onPost()
    .replyOnce(200, { data: { message: "hashtag added successfully" } })
    .onPost()
    .replyOnce(404);

  test("should add hashtag with 200 code", () => {
    lib.addHashtag(
      testDataHashTags.tags,
      testDataHashTags.id,
      testDataHashTags.type,
    ).then((response) => {
      expect(response).toStrictEqual(testDataHashTags.tags);
    });
  });

  test("should return error with 404 code", () => {
    expect(lib.addHashtag(
      testDataHashTags.tags,
      testDataHashTags.id,
      "comment",
    )).rejects.toThrowError();
  });
});

describe("test get hashtag axios api", () => {
  mockAxios.onGet()
    .replyOnce(200, testResponse)
    .onGet()
    .replyOnce(204, { data: {} })
    .onGet()
    .replyOnce(404);

  test("should get hashtag with 200 code", () => {
    lib.getHashtag(1, "post").then((response) => {
      expect(response).toStrictEqual(testResponse.data);
    });
  });

  test("should get empty hashtag with 204 code", () => {
    lib.getHashtag(1, "comment").then((response) => {
      expect(response).toStrictEqual([]);
    });
  });

  test("should return error with 404 code", () => {
    expect(lib.getHashtag(1, "post")).rejects.toThrowError();
  });
});

describe("test get post and comment by hashtag axios api", () => {
  mockAxios.onGet()
    .replyOnce(200, testResponse)
    .onGet()
    .replyOnce(204, { data: {} })
    .onGet()
    .replyOnce(404);

  test("should post and comment by hashtag with 200 code", () => {
    lib.getPostAndCommentByTag("post").then((response) => {
      expect(response).toStrictEqual(testResponse.data);
    });
  });

  test("should get empty data with 204 code", () => {
    lib.getPostAndCommentByTag("post").then((response) => {
      expect(response).toStrictEqual([]);
    });
  });

  test("should return error with 404 code", () => {
    expect(lib.getPostAndCommentByTag("post")).rejects.toThrowError();
  });
});

describe("test delete hashtag by post axios api", () => {
  mockAxios.onDelete()
    .replyOnce(200, { data: "hashtag deleted successfully" })
    .onDelete()
    .replyOnce(204, { data: "not hashtag found" })
    .onDelete()
    .replyOnce(404);

  test("should delete hashtag by post with 200 code", () => {
    lib.deleteHashtagByPost(1).then((response) => {
      expect(response.data).toStrictEqual("hashtag deleted successfully");
    });
  });

  test("should delete hashtag by post with 204 code", () => {
    lib.deleteHashtagByPost(1).then((response) => {
      expect(response.data).toStrictEqual("not hashtag found");
    });
  });

  test("should return error with 404 code", () => {
    expect(lib.deleteHashtagByPost(1)).rejects.toThrowError();
  });
});

describe("test delete hashtag by comment axios api", () => {
  mockAxios.onDelete()
    .replyOnce(200, { data: "hashtag deleted successfully" })
    .onDelete()
    .replyOnce(204, { data: "not hashtag found" })
    .onDelete()
    .replyOnce(404);

  test("should delete hashtag by comment with 200 code", () => {
    lib.deleteHashtagByComment(1).then((response) => {
      expect(response.data).toStrictEqual("hashtag deleted successfully");
    });
  });

  test("should delete hashtag by post with 204 code", () => {
    lib.deleteHashtagByComment(1).then((response) => {
      expect(response.data).toStrictEqual("not hashtag found");
    });
  });

  test("should return error with 404 code", () => {
    expect(lib.deleteHashtagByComment(1)).rejects.toThrowError();
  });
});
