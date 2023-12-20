/* eslint-disable no-undef */
const axios = require("axios");
const MockAdapter = require("axios-mock-adapter");
const lib = require("../../utility/axiosReply");

const mockAxios = new MockAdapter(axios);

const testDataReply = {
  idreply: 1,
  iduser: 1,
  idcomment: 1,
  date: {},
  content: "this is a new reply",
  image: "https://source.unsplash.com/random",
  audio: "https://source.unsplash.com/random",
  video: "https://source.unsplash.com/random",
};

describe("test add reply axios api", () => {
  mockAxios.onPost()
    .replyOnce(201, { data: testDataReply })
    .onPost()
    .replyOnce(400);

  test("should add reply with 201 code", () => {
    lib.addReply(1,
      1,
      testDataReply.content,
      testDataReply.image,
      testDataReply.audio,
      testDataReply.video).then((response) => {
      expect(response.data).toStrictEqual(testDataReply);
    });
  });

  test("should return error with 400 code", () => {
    expect(lib.addReply(1,
      1,
      testDataReply.content,
      testDataReply.image,
      testDataReply.audio,
      testDataReply.video)).rejects.toThrowError();
  });
});

describe("test get reply axios api", () => {
  mockAxios.onGet()
    .replyOnce(200, { data: testDataReply })
    .onGet()
    .replyOnce(404);

  test("should get reply with 201 code", () => {
    lib.getReply(1).then((response) => {
      expect(response.data).toStrictEqual(testDataReply);
    });
  });

  test("should return error with 404 code", () => {
    expect(lib.getReply(1)).rejects.toThrowError();
  });
});

describe("test update reply axios api", () => {
  mockAxios.onPut()
    .replyOnce(200, { message: "reply updated successfully" })
    .onPut()
    .replyOnce(404);

  test("should get reply with 200 code", () => {
    lib.updateReply(1,
      testDataReply.content,
      testDataReply.image,
      testDataReply.audio,
      testDataReply.video).then((response) => {
      expect(response.data.message).toStrictEqual("reply updated successfully");
    });
  });

  test("should return error with 404 code", () => {
    expect(lib.updateReply(1,
      testDataReply.content,
      testDataReply.image,
      testDataReply.audio,
      testDataReply.video)).rejects.toThrowError();
  });
});

describe("test delete reply axios api", () => {
  mockAxios.onDelete()
    .replyOnce(200, { message: "reply deleted successfully" })
    .onDelete()
    .replyOnce(404);

  test("should get reply with 200 code", () => {
    lib.deleteReply(1).then((response) => {
      expect(response.data.message).toStrictEqual("reply deleted successfully");
    });
  });

  test("should return error with 404 code", () => {
    expect(lib.deleteReply(1)).rejects.toThrowError();
  });
});
