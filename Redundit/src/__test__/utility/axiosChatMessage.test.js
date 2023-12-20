/* eslint-disable no-undef */
const axios = require("axios");
const MockAdapter = require("axios-mock-adapter");
const lib = require("../../utility/axiosChatMessage");

const mockAxios = new MockAdapter(axios);

const testDataChat = {
  idchat: 1,
  iduser: 1,
  name: "chat group",
  timestamp: {},
  private: true,
};

const testDataUrl = "https://source.unsplash.com/random";

const testDataChatMessage = {
  iduser: 1,
  idchat: 1,
  timestamp: "timestamp",
  content: "chat group",
  image: testDataUrl,
  audio: testDataUrl,
  video: testDataUrl,
};

const testDataChatGroup = {
  idchat: 1,
  iduser: 1,
  name: "timestamp",
  timestamp: "2021-11-16 14:10:35",
  private: true,
};

describe("test creat chat axios api", () => {
  mockAxios.onPost().replyOnce(201, { data: testDataChat }).onPost().replyOnce(400);

  test("should create a chat with 201 code", () => {
    lib.createChat(1, "test", true).then((response) => {
      expect(response).toStrictEqual(testDataChat);
    });
  });

  test("should return error with 400 code", () => {
    expect(lib.createChat(1, "test", true)).rejects.toThrowError();
  });
});

describe("test update chat axios api", () => {
  mockAxios.onPut().replyOnce(200, { message: "chat updated successfully" }).onPut().replyOnce(404);

  test("should update a chat with 200 code", () => {
    lib.updateChat(1, "test", true).then((response) => {
      expect(response.message).toStrictEqual("chat updated successfully");
    });
  });

  test("should return error with 404 code", () => {
    expect(lib.updateChat(1, "test", true)).rejects.toThrowError();
  });
});

describe("test delete chat axios api", () => {
  mockAxios.onDelete().replyOnce(200, { message: "chat deleted successfully" }).onDelete().replyOnce(404);

  test("should delete a chat with 200 code", () => {
    lib.deleteChat(1).then((response) => {
      expect(response.message).toBe("chat deleted successfully");
    });
  });

  test("should return error with 404 code", () => {
    expect(lib.deleteChat(1)).rejects.toThrowError();
  });
});

describe("test add user to chat axios api", () => {
  mockAxios.onPost().replyOnce(200, { message: "user added to chat successfully" }).onPost().replyOnce(404);

  test("should add a user to chat with 200 code", () => {
    lib.addUserToChat(1, 1).then((response) => {
      expect(response.message).toStrictEqual("user added to chat successfully");
    });
  });

  test("should return error with 404 code", () => {
    expect(lib.addUserToChat(1, 1)).rejects.toThrowError();
  });
});

describe("test remove user from chat axios api", () => {
  mockAxios.onDelete().replyOnce(200, { message: "user removed from chat successfully" }).onDelete().replyOnce(404);

  test("should remove user with 200 code", () => {
    lib.removeUserFromChat(1, 1).then((response) => {
      expect(response.message).toStrictEqual("user removed from chat successfully");
    });
  });

  test("should return error with 404 code", () => {
    expect(lib.removeUserFromChat(1, 1)).rejects.toThrowError();
  });
});

describe("test add message to chat axios api", () => {
  mockAxios.onPost().replyOnce(200, { message: "added message to chat successfully" }).onPost().replyOnce(404);

  test("should add a message to chat with 200 code", () => {
    lib.addMessageToChat(1, 1, "testContent",
      testDataUrl,
      testDataUrl,
      testDataUrl).then((response) => {
      expect(response.message).toStrictEqual("added message to chat successfully");
    });
  });

  test("should return error with 404 code", () => {
    expect(lib.addMessageToChat(1, 1, "testContent",
      testDataUrl,
      testDataUrl,
      testDataUrl)).rejects.toThrowError();
  });
});

describe("test get all chat message axios api", () => {
  mockAxios.onGet().replyOnce(200, { data: [testDataChat] }).onGet().replyOnce(404);

  test("should get all chat with 200 code", () => {
    lib.getAllMessageInChat(1).then((response) => {
      expect(response.data).toStrictEqual([testDataChat]);
    });
  });

  test("should return error with 404 code", () => {
    expect(lib.getAllMessageInChat(1)).rejects.toThrowError();
  });
});

describe("test get all chat message by user axios api", () => {
  mockAxios.onGet().replyOnce(200, { data: [testDataChat] }).onGet().replyOnce(404);

  test("should get all chat by user with 200 code", () => {
    lib.getAllMessageInChatByUser(1, 1).then((response) => {
      expect(response.data).toStrictEqual([testDataChat]);
    });
  });

  test("should return error with 404 code", () => {
    expect(lib.getAllMessageInChatByUser(1, 1)).rejects.toThrowError();
  });
});

describe("test get all chat groups api", () => {
  mockAxios.onGet().replyOnce(200, { data: [testDataChatGroup] }).onGet().replyOnce(404);

  test("should get all chat by user with 200 code", () => {
    lib.getAllChatgroups(1).then((response) => {
      expect(response.data).toStrictEqual([testDataChatGroup]);
    });
  });

  test("should return error with 404 code", () => {
    expect(lib.getAllChatgroups(1)).rejects.toThrowError();
  });
});
