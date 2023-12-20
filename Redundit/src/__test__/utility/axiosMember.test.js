/* eslint-disable no-undef */
const axios = require("axios");
const MockAdapter = require("axios-mock-adapter");
const lib = require("../../utility/axiosMember");

const mockAxios = new MockAdapter(axios);

const testDataMember = {
  idgroup: 1,
  iduser: 1,
  pending: false,
  admin: true,
};

describe("test creat member axios api", () => {
  mockAxios.onPost()
    .replyOnce(200, { data: testDataMember })
    .onPost()
    .replyOnce(404);

  test("should creat member with 200 code", () => {
    lib.createMember(1, 1, true).then((response) => {
      expect(response).toStrictEqual(testDataMember);
    });
  });

  test("should return error with 404 code", () => {
    expect(lib.createMember(1, 1, true)).rejects.toThrowError();
  });
});

describe("test get member axios api", () => {
  mockAxios.onGet()
    .replyOnce(200, { data: testDataMember })
    .onGet()
    .replyOnce(204, { data: {} })
    .onGet()
    .replyOnce(404);

  test("should get member with 200 code", () => {
    lib.getMember(1, 1).then((response) => {
      expect(response).toStrictEqual(testDataMember);
    });
  });

  test("should get no member with 204 code", () => {
    lib.getMember(1, 1).then((response) => {
      expect(response).toBeNull();
    });
  });

  test("should return error with 404 code", () => {
    expect(lib.getMember(1, 1)).rejects.toThrowError();
  });
});

describe("test delete member axios api", () => {
  mockAxios.onDelete()
    .replyOnce(200, { data: { message: "member deleted successfully" } })
    .onDelete()
    .replyOnce(404);

  test("should delete member with 200 code", () => {
    lib.deleteMember(1, 1).then((response) => {
      expect(response.message).toBe("member deleted successfully");
    });
  });

  test("should return error with 404 code", () => {
    expect(lib.deleteMember(1, 1)).rejects.toThrowError();
  });
});

describe("test update member axios api", () => {
  mockAxios.onPut()
    .replyOnce(200, { data: { message: "member updated successfully" } })
    .onPut()
    .replyOnce(404);

  test("should delete member with 200 code", () => {
    lib.putMember(1, 1, true, true).then((response) => {
      expect(response.message).toBe("member updated successfully");
    });
  });

  test("should return error with 404 code", () => {
    expect(lib.putMember(1, 1, true, true)).rejects.toThrowError();
  });
});
