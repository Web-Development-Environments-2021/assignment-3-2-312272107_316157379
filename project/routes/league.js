var express = require("express");
var router = express.Router();
const league_utils = require("./utils/league_utils");
const matches_utils = require("./utils/matches_utils");
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
router.get("/:league_id/matches", async (req, res, next) => {
  try {
    const matches_query = 'SELECT * FROM dbo.matches'; // currently not supporting leagues other than SuperLiga
    const matches_in_league = await matches_utils.get_matches_by_query(matches_query);
    res.status(200).send(matches_in_league);
    logStream.end("matches' successfully retrieved");
  } catch (error) {
    logStream.end(error.message); 
    next(error);
  }
});

module.exports = router;
