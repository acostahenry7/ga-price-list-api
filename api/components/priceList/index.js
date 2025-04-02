const store = require("../../../store/hanadb");
const controller = require("./controller");

module.exports = controller(store);
