const { sapSL } = require("../utils/sec/conProperties");
const axios = require("axios");
const moment = require("moment");
const { v4 } = require("uuid");

async function create(data) {
  console.log(data);
  let result = {};

  let formatedData = {
    Code: generateCode(),
    Name: `${data.name} ${moment().format()}`,
    U_USER_CODE: data.username,
    U_CreateDate: moment().format(),
    U_Comment: data.comment,
    U_ObjectName: data.objectName,
    U_ClientHost: data.clientHost,
    U_ApplicationName: data.appName,
    U_ApplicationURL: data.appURL,
    U_EventStatus: data.status,
  };

  console.log("############", formatedData);

  try {
    const url = `${sapSL.url}/${data.target}`;
    await axios
      .post(url, formatedData, {
        headers: {
          "Content-Type": "application/json",
          Cookie: data.cookie,
        },
      })
      .then((res) => {
        result.body = {
          ...formatedData,
        };
      })
      .catch((err) => console.error(err));
  } catch (error) {
    console.log(error);
  }

  return result;
}

async function list(params) {
  console.log("SAPSL", params);

  try {
    let result = [];
    const url = `${sapSL.url}/${params.target}`;
    await axios
      .get(url, {
        headers: {
          "Content-Type": "application/json",
          Cookie: params.cookie,
        },
      })
      .then(({ data }) => {
        console.log(data.value);
        result = [...data.value];
      })
      .catch((err) => {
        console.log(err.response.data.error.message.value);
        throw err;
      });

    return result;
  } catch (error) {
    throw new Error(error.response.data.error.message.value);
  }
}

function generateCode() {
  return v4();
}

module.exports = {
  create,
  list,
};
