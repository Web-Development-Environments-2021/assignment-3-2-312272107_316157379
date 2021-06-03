var express = require("express");
var router = express.Router();
const DButils = require("../utils/DButils");
const union_rep_utils = require("../utils/roles/union_rep_utils");
const axios = require("axios");
let fs = require("fs");
const { role_to_role_name } = require("../utils/users_utils");
let logStream = fs.createWriteStream("log.txt", { flags: "a" });
const api_domain = "https://soccer.sportmonks.com/api/v2.0";

const LEAGUE_ID = 271; // SuperLiga

router.use(async function (req, res, next) {
  const users = await DButils.execQuery(
    `SELECT * FROM dbo.user_roles WHERE user_id = ${req.body.user_id} AND user_role = '${role_to_role_name.REFEREE}'`
  );
  if (users.length == 0) {
    throw { status: 400, message: "user dones't have premission" };
  }
  //   .catch((err) => next(err));
  next();
});


module.exports = router;
