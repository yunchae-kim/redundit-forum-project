/* eslint-disable no-undef */
const axios = require("axios");
const MockAdapter = require("axios-mock-adapter");
const lib = require("../../utility/axiosComment");

const mockAxios = new MockAdapter(axios);

const testDataComment = {
  iduser: 1,
  idpost: 1,
  content: "this is a new comment",
  status: false,
  flagged: false,
  image: "https://source.unsplash.com/random",
  audio: "https://source.unsplash.com/random",
  video: "https://source.unsplash.com/random",
};

describe("test add comment axios api", () => {
  mockAxios.onPost().replyOnce(201, { data: testDataComment }).onPost().replyOnce(400);

  test("should add comment with 201 code", () => {
    lib.addComment(1, 1, "testComment").then((response) => {
      expect(response).toStrictEqual(testDataComment);
    });
  });

  test("should return error with 400 code", () => {
    expect(lib.addComment(1, 1, "testComment")).rejects.toThrowError();
  });
});

describe("test get comment axios api", () => {
  mockAxios.onGet().replyOnce(200, { data: testDataComment }).onGet().replyOnce(404);

  test("should add comment with 200 code", () => {
    lib.getComment(1).then((response) => {
      expect(response).toStrictEqual(testDataComment);
    });
  });

  test("should return error with 404 code", () => {
    expect(lib.getComment(1)).rejects.toThrowError();
  });
});

describe("test update comment axios api", () => {
  mockAxios.onPut().replyOnce(200, { message: "comment updated successfully" }).onPut().replyOnce(404);

  test("should update comment with 200 code", async () => {
    lib.updateComment(
      1,
      testDataComment.content,
      testDataComment.status,
      testDataComment.flagged,
      testDataComment.image,
      testDataComment.audio,
      testDataComment.video,
    ).then((response) => {
      expect(response.data.message).toStrictEqual("comment updated successfully");
    });
  });

  test("should return error with 404 code", () => {
    expect(lib.updateComment(
      1,
      testDataComment.content,
      testDataComment.status,
      testDataComment.flagged,
      testDataComment.image,
      testDataComment.audio,
      testDataComment.video,
    )).rejects.toThrowError();
  });
});

describe("test delete comment axios api", () => {
  mockAxios.onDelete().replyOnce(200, { message: "comment deleted successfully" }).onDelete().replyOnce(400);

  test("should update comment with 200 code", async () => {
    lib.deleteComment(1).then((response) => {
      expect(response.data.message).toStrictEqual("comment deleted successfully");
    });
  });

  test("should return error with 400 code", () => {
    expect(lib.deleteComment(1)).rejects.toThrowError();
  });
});

describe("test get comment by post axios api", () => {
  mockAxios
    .onGet()
    .replyOnce(200, { data: [testDataComment] })
    .onGet()
    .replyOnce(204, { data: [{}] })
    .onGet()
    .replyOnce(404);

  test("should get comment by post with 200 code", async () => {
    lib.getCommentByPost(1).then((response) => {
      expect(response).toStrictEqual([testDataComment]);
    });
  });

  test("should get comment by post with 204 code", async () => {
    lib.getCommentByPost(1).then((response) => {
      expect(response).toBeNull();
    });
  });

  test("should return error with 404 code", () => {
    expect(lib.getCommentByPost(1)).rejects.toThrowError();
  });
});
