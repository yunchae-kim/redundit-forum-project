const axios = require("axios");

// const domain = "http://localhost:5000";
const domain = "";

async function createMember(idgroup, iduser, admin, pending = false) {
  try {
    const member = {
      idgroup,
      iduser,
      admin,
      pending,
    };
    const response = await axios.post(`${domain}/api/member`, member);
    if (response.status !== 200) {
      throw new Error(response.statusText);
    }
    const { data } = await response;
    return data.data;
  } catch (error) {
    throw new Error("Error adding a member to a group");
  }
}

async function getMember(idgroup, iduser) {
  try {
    const response = await axios.get(`${domain}/api/member/${idgroup}/${iduser}`);
    if (response.status === 204) {
      return null;
    }
    if (response.status !== 200) {
      throw new Error(response.statusText);
    }
    const { data } = await response;
    return data.data;
  } catch (error) {
    throw new Error(error.message);
  }
}

async function deleteMember(idgroup, iduser) {
  try {
    const response = await axios.delete(`${domain}/api/member/`, { data: { idgroup, iduser } });
    if (response.status !== 200) {
      throw new Error(response.statusText);
    }
    const { data } = await response;
    return data.data;
  } catch (error) {
    throw new Error(error.message);
  }
}

async function putMember(iduser, idgroup, pending, admin) {
  try {
    const updatedMember = {
      iduser,
      idgroup,
      pending,
      admin,
    };
    const response = await axios.put(`${domain}/api/member`, updatedMember);
    if (response.status !== 200) {
      throw new Error(response.statusText);
    }
    const { data } = await response;
    return data.data;
  } catch (error) {
    throw new Error(error.message);
  }
}

export {
  createMember, getMember, deleteMember, putMember,
};
