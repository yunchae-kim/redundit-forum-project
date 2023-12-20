import httpClient from "../../utility/auth.helper";

const axios = require("axios");
const MockAdapter = require("axios-mock-adapter");

const mockAxios = new MockAdapter(axios);
const testDataInput = { username: "test_name ", password: "password" };
const testDataToken = { iduser: 1, username: "test_name", token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3RfbmFtZSAiLCJwYXNzd29yZCI6InBhc3N3b3JkIn0.440mJEgIyzw8Ms9Kgn0aLMw6QD5iYppxJxOgXqU8CRs" };
const testDataLockOut = {
  idlockout: 1, username: "test_name", attempts: 2, timestamp: "2021-12-18 05:10:16", locked: true,
};

describe("test log-in axios api", () => {
  mockAxios
    .onPost()
    .replyOnce(200, { data: testDataToken })
    .onPost()
    .replyOnce(200, testDataToken)
    .onPost()
    .replyOnce(401, { data: { msg: "Incorrect Password" } });

  test("should get jwt token with 200 code, but no token return false", () => {
    httpClient.login("test_name", "password").then((response) => {
      expect(response).toBe(false);
    });
  });

  test("should get jwt token with 200 code", () => {
    httpClient.login("test_name", "password").then((response) => {
      expect(response).toStrictEqual(testDataInput);
    });
  });

  test("should return error with 401 code", () => {
    expect(httpClient.login("test_name", "password")).rejects.toThrowError();
  });
});

describe("test sign-up axios api", () => {
  mockAxios
    .onPost()
    .replyOnce(201, testDataToken)
    .onPost()
    .replyOnce(400, { data: { msg: "Incorrect Password" } });

  test("should get response with 201 code", () => {
    httpClient.signUp("test_name", "password").then((response) => {
      expect(response).toStrictEqual(testDataToken);
    });
  });

  test("should return error with 400 code", () => {
    expect(httpClient.signUp("test_name", "password")).rejects.toThrowError();
  });
});

describe("test sessionStorage api", () => {
  test("should set and get the same token ", () => {
    httpClient.setToken(testDataToken.token);
    const token = httpClient.getToken();
    expect(token).toStrictEqual(testDataToken.token);
  });

  test("should get current user and log out user", () => {
    httpClient.setToken(testDataToken.token);
    let user = httpClient.getCurrentUser();
    expect(user).toStrictEqual(testDataInput);
    // log out
    httpClient.logOut();
    user = httpClient.getCurrentUser();
    expect(user).toBeNull();
  });
});

describe("test get lock-out axios api", () => {
  mockAxios
    .onGet()
    .replyOnce(200, { data: testDataLockOut })
    .onGet()
    .replyOnce(404, { data: { msg: "no user found" } });

  test("should get lockout info with 200 code", () => {
    httpClient.getLockout("test_name").then((response) => {
      expect(response.data).toStrictEqual(testDataLockOut);
    });
  });

  test("should return error with 401 code", () => {
    expect(httpClient.getLockout("test_name")).rejects.toThrowError();
  });
});

describe("test add lock-out axios api", () => {
  mockAxios
    .onPost()
    .replyOnce(201, { data: testDataLockOut })
    .onPost()
    .replyOnce(404, { data: { msg: "no user found" } });

  test("should add lockout with 201 code", () => {
    httpClient.addLockout("test_name").then((response) => {
      expect(response.data).toStrictEqual(testDataLockOut);
    });
  });

  test("should return error with 401 code", () => {
    expect(httpClient.addLockout("test_name")).rejects.toThrowError();
  });
});

describe("test update lock-out axios api", () => {
  mockAxios
    .onPut()
    .replyOnce(200, { data: testDataLockOut })
    .onPut()
    .replyOnce(404, { data: { msg: "no user found" } });

  test("should update lockout with 200 code", () => {
    httpClient.updateLockout("test_name").then((response) => {
      expect(response.data).toStrictEqual(testDataLockOut);
    });
  });

  test("should return error with 401 code", () => {
    expect(httpClient.updateLockout("test_name")).rejects.toThrowError();
  });
});

describe("test set lock-out axios api", () => {
  mockAxios
    .onPut()
    .replyOnce(200, { data: testDataLockOut })
    .onPut()
    .replyOnce(404, { data: { msg: "no user found" } });

  test("should set lockout with 200 code", () => {
    httpClient.setLockout("test_name").then((response) => {
      expect(response.data).toStrictEqual(testDataLockOut);
    });
  });

  test("should return error with 401 code", () => {
    expect(httpClient.setLockout("test_name")).rejects.toThrowError();
  });
});

describe("test reset lock-out axios api", () => {
  mockAxios
    .onPut()
    .replyOnce(200, { data: testDataLockOut })
    .onPut()
    .replyOnce(404, { data: { msg: "no user found" } });

  test("should reset lockout with 200 code", () => {
    httpClient.resetLockout("test_name").then((response) => {
      expect(response.data).toStrictEqual(testDataLockOut);
    });
  });

  test("should return error with 401 code", () => {
    expect(httpClient.resetLockout("test_name")).rejects.toThrowError();
  });
});
