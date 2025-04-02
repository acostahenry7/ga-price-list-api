const config = require("../config");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

//COMPONENTS
const list = require("./components/priceList/network");
const log = require("./components/log/network");

//MIDLEWARES
app.use(bodyParser.json());
app.use(
  cors({
    origin: "*",
  })
);

//ROUTER
app.use("/api/pricelist", list);
app.use("/api/log", log);

//RUNTIME
app.listen(config.app.port, () => {
  console.log("Listening on port " + config.app.port);
});
