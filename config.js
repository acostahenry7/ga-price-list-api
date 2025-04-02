var hana = require("@sap/hana-client");
var connections = require("./utils/sec/conProperties.js");

module.exports = {
  app: {
    port: process.env.PORT || 3002,
  },
  store: {
    sapSL: connections.sapSL.url,
    hanadb: {
      connect: () => {
        var connection = hana.createConnection();
        connection.connect(connections.hanadb);
        return connection;
      },
    },
  },
};
