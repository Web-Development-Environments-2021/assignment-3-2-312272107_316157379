var express = require("express");
var router = express.Router();
const league_utils = require("./utils/league_utils");
const fs = require('fs');
const logStream = fs.createWriteStream('log.txt', {flags: 'a'});

// retrieves the league's name, stage name, season and next match details.
router.get("/details", async (req, res, next) => {
  try {
    const league_details = await league_utils.getLeagueDetails();
    res.status(200).send(league_details);
    logStream.end("league's details successfully retrieved");
  } catch (error) {
    logStream.end(error.message); 
    next(error);
  }
});

module.exports = router;
