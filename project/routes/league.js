var express = require("express");
var router = express.Router();
const league_utils = require("./utils/league_utils");
const fs = require('fs');
const logStream = fs.createWriteStream('log.txt', {flags: 'a'});

router.get("/details", async (req, res, next) => {
  try {
    const league_details = await league_utils.getLeagueDetails();
    res.send(league_details);
    logStream.end("league's details successfully retrieved");
  } catch (error) {
    logStream.end(error.message); // need to verify message is not null
    next(error);
  }
});

module.exports = router;
