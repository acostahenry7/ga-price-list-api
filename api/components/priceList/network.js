const express = require("express");
const router = express.Router();
const response = require("../../../network/response");

const controller = require("./index");

router.post("/", async (req, res) => {
  try {
    let data = await controller.list(req.body);
    response.success(req, res, 200, data);
  } catch (error) {
    response.error(req, res, 500, error.message);
  }
});

router.get("/all", async (req, res) => {
  try {
    //let data = await controller
  } catch (error) {}
});

router.post("/update", async (req, res) => {
  try {
    let data = await controller.update(req.body);
    response.success(req, res, 200, data);
  } catch (error) {
    response.error(req, res, 500, error.message);
  }
});

module.exports = router;
