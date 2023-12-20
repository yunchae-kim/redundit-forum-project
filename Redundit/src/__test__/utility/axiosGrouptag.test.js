/* eslint-disable no-undef */
const axios = require("axios");
const MockAdapter = require("axios-mock-adapter");
const lib = require("../../utility/axiosGrouptag");

const mockAxios = new MockAdapter(axios);

const testDataGroupTags = {
  idgroup: 1,
  tags: ["tag1", "tag2", "tag3"],
};

const testDataGroup = {
  idgroup: 1,
  name: "myGroup",
  icon: "https://source.unsplash.com/random",
  description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  private: true,
  editable: true,
};

const testResponse = {
  data: [{
    idgroup: 1,
    tags: "tag1",
  },
  {
    idgroup: 1,
    tags: "tag2",
  },
  {
    idgroup: 1,
    tags: "tag3",
  }],
};

describe("test creat grouptag axios api", () => {
  mockAxios.onPost()
    .replyOnce(200, { message: "grouptag added to group successfully" })
    .onPost()
    .replyOnce(200, { message: "grouptag added to group successfully" })
    .onPost()
    .replyOnce(200, { message: "grouptag added to group successfully" })
    .onPost()
    .replyOnce(404);

  test("should creat group with 200 code", () => {
    lib.createGrouptags(testDataGroupTags.tags, testDataGroupTags.idgroup).then((response) => {
      expect(response).toStrictEqual(testDataGroupTags.tags);
    });
  });

  test("should return error with 404 code", () => {
    expect(lib.createGrouptags(["tag4"],
      testDataGroupTags.idgroup)).rejects.toThrowError();
  });
});

describe("test get grouptag axios api", () => {
  mockAxios.onGet()
    .replyOnce(200, testResponse)
    .onGet()
    .replyOnce(404);

  test("should get group tag with 200 code", () => {
    lib.getGrouptags(1).then((response) => {
      expect(response).toStrictEqual(testResponse.data);
    });
  });

  test("should return error with 404 code", () => {
    expect(lib.getGrouptags(1)).rejects.toThrowError();
  });
});

describe("test get groups by tag axios api", () => {
  mockAxios.onGet()
    .replyOnce(200, { data: [testDataGroup] })
    .onGet()
    .replyOnce(204)
    .onGet()
    .replyOnce(404);

  test("should get group tag with 200 code", () => {
    lib.getGroupsByTag("tag").then((response) => {
      expect(response).toStrictEqual([testDataGroup]);
    });
  });

  test("should get group tag with 204 code", () => {
    lib.getGroupsByTag("tag").then((response) => {
      expect(response).toStrictEqual([]);
    });
  });

  test("should return error with 404 code", () => {
    expect(lib.getGroupsByTag("tag")).rejects.toThrowError();
  });
});
