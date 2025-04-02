const express = require("express");
const router = express.Router();
const response = require("../../../network/response");
const controller = require("./index");

router.get("/", async (req, res) => {
  try {
    console.log("lol", req.query);
    console.log(req.headers);
    console.log("###############################");
    let data = await controller.list(req.query);
    response.success(req, res, 200, data);
  } catch (error) {
    response.error(req, res, 500, error.message);
  }
});

router.post("/", async (req, res) => {
  try {
    // console.log(`Your IP Address is ${clientIp}.`);
    let data = await controller.create({
      clientHost: req.headers.host,
      appURL: req.headers.origin,
      ...req.body,
    });
    response.success(req, res, 200, data);
  } catch (error) {
    response.error(req, res, 500, error.message);
  }
});

module.exports = router;
