/* eslint-disable no-undef */
const axios = require("axios");
const MockAdapter = require("axios-mock-adapter");
const lib = require("../../utility/axiosNotification");

const mockAxios = new MockAdapter(axios);

const testDataNotification = {
  userid: 1,
  notification: "this is a notification",
};

describe("test add notification axios api", () => {
  mockAxios.onPost().replyOnce(200, { data: testDataNotification }).onPost().replyOnce(400);

  test("should add notification with 200 code", () => {
    lib.addNotification(1, testDataNotification).then((response) => {
      expect(response).toStrictEqual(testDataNotification);
    });
  });

  test("should return error with 400 code", () => {
    expect(lib.addNotification(1, testDataNotification)).rejects.toThrowError();
  });
});

describe("test get notification axios api", () => {
  mockAxios.onGet().replyOnce(200, { data: testDataNotification }).onGet().replyOnce(404);

  test("should update a chat with 200 code", () => {
    lib.getNotification(1).then((response) => {
      expect(response).toStrictEqual(testDataNotification);
    });
  });

  test("should return error with 404 code", () => {
    expect(lib.getNotification(1)).rejects.toThrowError();
  });
});

describe("test delete notification axios api", () => {
  mockAxios.onDelete().replyOnce(200, { data: { message: "notification deleted successfully" } }).onDelete().replyOnce(404);

  test("should delete a notification with 200 code", () => {
    lib.deleteNotification(1).then((response) => {
      expect(response.message).toBe("notification deleted successfully");
    });
  });

  test("should return error with 404 code", () => {
    expect(lib.deleteNotification(1)).rejects.toThrowError();
  });
});
