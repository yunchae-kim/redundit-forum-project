/* eslint-disable no-undef */
const axios = require("axios");
const MockAdapter = require("axios-mock-adapter");
const lib = require("../../utility/axiosGroup");

const mockAxios = new MockAdapter(axios);

const testDataGroup = {
  idgroup: 1,
  name: "myGroup",
  icon: "https://source.unsplash.com/random",
  description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  private: true,
  editable: true,
};

const testResponse = { data: testDataGroup };

describe("test creat group axios api", () => {
  mockAxios.onPost().replyOnce(201, testResponse).onPost().replyOnce(400);

  test("should creat group with 201 code", () => {
    lib.createGroup(
      testDataGroup.name,
      testDataGroup.isPrivate,
      testDataGroup.editable,
      testDataGroup.description,
      testDataGroup.icon,
      1,
    ).then((data) => {
      expect(data).toStrictEqual(testDataGroup);
    });
  });

  test("should return error with 400 code", () => {
    expect(lib.createGroup(
      testDataGroup.name,
      testDataGroup.isPrivate,
      testDataGroup.editable,
      testDataGroup.description,
      testDataGroup.icon,
      1,
    )).rejects.toThrowError();
  });
});

describe("test get public group axios api", () => {
  mockAxios.onGet().replyOnce(200, { data: [testDataGroup] }).onGet().replyOnce(404);

  test("should get public groups with 200 code", () => {
    lib.getPublicGroups().then((response) => {
      expect(response).toStrictEqual([testDataGroup]);
    });
  });

  test("should return error with 404 code", () => {
    expect(lib.getPublicGroups()).rejects.toThrowError();
  });
});

describe("test get group by id axios api", () => {
  mockAxios.onGet().replyOnce(200, { data: testDataGroup }).onGet().replyOnce(404);

  test("should get group by id with 200 code", () => {
    lib.getGroupById(1).then((response) => {
      expect(response).toStrictEqual(testDataGroup);
    });
  });

  test("should return error with 404 code", () => {
    expect(lib.getGroupById(1)).rejects.toThrowError();
  });
});

describe("test update group by id axios api", () => {
  mockAxios.onPut().replyOnce(200, { data: { message: "group updated successfully" } }).onPut().replyOnce(404);

  test("should update group by id with 200 code", () => {
    lib.putGroupById(testDataGroup.idgroup, testDataGroup).then((response) => {
      expect(response.message).toStrictEqual("group updated successfully");
    });
  });

  test("should return error with 404 code", () => {
    expect(lib.putGroupById(testDataGroup.idgroup, testDataGroup)).rejects.toThrowError();
  });
});

describe("test delete group by id axios api", () => {
  mockAxios.onDelete().replyOnce(200, { data: { message: "group deleted successfully" } }).onDelete().replyOnce(404);

  test("should delete group by id with 200 code", () => {
    lib.deleteGroupById(1).then((response) => {
      expect(response.message).toStrictEqual("group deleted successfully");
    });
  });

  test("should return error with 404 code", () => {
    expect(lib.deleteGroupById(1)).rejects.toThrowError();
  });
});

describe("test get groups by user axios api", () => {
  mockAxios.onGet().replyOnce(200, { data: [testDataGroup] }).onGet().replyOnce(404);

  test("should get groups by user with 200 code", () => {
    lib.getGroupsByUser(1).then((response) => {
      expect(response).toStrictEqual([testDataGroup]);
    });
  });

  test("should return error with 404 code", () => {
    expect(lib.getGroupsByUser(1)).rejects.toThrowError();
  });
});
