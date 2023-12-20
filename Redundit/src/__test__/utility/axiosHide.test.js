/* eslint-disable no-undef */
const axios = require("axios");
const MockAdapter = require("axios-mock-adapter");
const lib = require("../../utility/axiosHide");

const mockAxios = new MockAdapter(axios);

const testDataHide = {
  iduser: 1,
  idpost: 1,
  idgroup: 1,
};

describe("test add hide axios api", () => {
  mockAxios
    .onPost()
    .replyOnce(200, { data: testDataHide })
    .onPost()
    .replyOnce(400);

  test("should add hide with 201 code", () => {
    lib.addHide(1, 1, 1).then((response) => {
      expect(response).toStrictEqual(testDataHide);
    });
  });

  test("should return error with 400 code", () => {
    expect(lib.addHide(1, 1, 1)).rejects.toThrowError();
  });
});

describe("test get hide axios api", () => {
  mockAxios
    .onGet()
    .replyOnce(200, { data: [testDataHide] })
    .onGet()
    .replyOnce(404);

  test("should get hide with 200 code", () => {
    lib.getHide(1, 1).then((response) => {
      expect(response).toStrictEqual([testDataHide]);
    });
  });

  test("should return error with 404 code", () => {
    expect(lib.getHide(1, 1)).rejects.toThrowError();
  });
});

describe("test get hide count axios api", () => {
  mockAxios
    .onGet()
    .replyOnce(200, { data: 2 })
    .onGet()
    .replyOnce(404);

  test("should get hide count with 200 code", () => {
    lib.getHideCount(1).then((response) => {
      expect(response).toBe(2);
    });
  });

  test("should return error with 404 code", () => {
    expect(lib.getHideCount(1)).rejects.toThrowError();
  });
});


describe("test delete hide axios api", () => {
  mockAxios
    .onDelete()
    .replyOnce(200, { data: { message: "hide deleted successfully" } })
    .onDelete()
    .replyOnce(400);

  test("should delete hide with 200 code", async () => {
    lib.deleteHide(1, 1).then((response) => {
      expect(response.message).toStrictEqual("hide deleted successfully");
    });
  });

  test("should return error with 400 code", () => {
    expect(lib.deleteHide(1, 1)).rejects.toThrowError();
  });
});
