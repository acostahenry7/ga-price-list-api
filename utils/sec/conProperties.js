const hostname = process.env.PROD_DB_HOST || "10.1.100.146";

module.exports = {
  hanadb: {
    serverNode: `${hostname}:30015`,
    UID: "B1DBREPORT",
    PWD: "Znb721680",
    sslValidateCertificate: "false",
  },
  sapSL: {
    url: `http://${hostname}:50001/b1s/v1`,
  },
};
