/* eslint-disable no-undef */
const axios = require("axios");
const MockAdapter = require("axios-mock-adapter");
const lib = require("../../utility/axiosUser");

const mockAxios = new MockAdapter(axios);

const testDataUser = {
  iduser: 1,
  email: "example@gmail.com",
  username: "username",
  userPassword: "12345678",
  joindate: {},
  image: "https://source.unsplash.com/",
};

describe("test get user in group axios api", () => {
  mockAxios.onGet()
    .replyOnce(200, { data: [testDataUser] })
    .onGet()
    .replyOnce(404);

  test("should get user in group with 200 code", () => {
    lib.getAllUsersInGroup(1).then((response) => {
      expect(response).toStrictEqual([testDataUser]);
    });
  });

  test("should return error with 404 code", () => {
    expect(lib.getAllUsersInGroup(1)).rejects.toThrowError();
  });
});

describe("test get user in group axios api", () => {
  mockAxios.onGet()
    .replyOnce(200, { data: [testDataUser] })
    .onGet()
    .replyOnce(404);

  test("should get user in group with 200 code", () => {
    lib.getAllNonUsersInGroup(1).then((response) => {
      expect(response).toStrictEqual([testDataUser]);
    });
  });

  test("should return error with 404 code", () => {
    expect(lib.getAllNonUsersInGroup(1)).rejects.toThrowError();
  });
});

describe("test get user by id axios api", () => {
  mockAxios.onGet()
    .replyOnce(200, { data: testDataUser })
    .onGet()
    .replyOnce(404);

  test("should get user by id with 200 code", () => {
    lib.getUserById(1).then((response) => {
      expect(response).toStrictEqual(testDataUser);
    });
  });

  test("should return error with 404 code", () => {
    expect(lib.getUserById(1)).rejects.toThrowError();
  });
});

describe("test get user by name axios api", () => {
  mockAxios.onGet()
    .replyOnce(200, { data: testDataUser })
    .onGet()
    .replyOnce(404);

  test("should get user by name with 200 code", () => {
    lib.getUserByName("name").then((response) => {
      expect(response).toStrictEqual(testDataUser);
    });
  });

  test("should return error with 404 code", () => {
    expect(lib.getUserByName("name")).rejects.toThrowError();
  });
});

describe("test update user by id axios api", () => {
  mockAxios.onPut()
    .replyOnce(200, { data: { message: "player updated successfully" } })
    .onPut()
    .replyOnce(404);

  test("should update user by id with 200 code", () => {
    lib.putUserById(1, "name", "123456", true, "url", true).then((response) => {
      expect(response.message).toStrictEqual("player updated successfully");
    });
  });

  test("should return error with 404 code", () => {
    expect(lib.putUserById(1, "name", "123456", true, "url", true)).rejects.toThrowError();
  });
});
