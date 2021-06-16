var express = require("express");
var router = express.Router();
const league_utils = require("./utils/leagues_utils");
const matches_utils = require("./utils/matches_utils");
const fs = require("fs");
const logStream = fs.createWriteStream("log.txt", { flags: "a" });
const info_include_param = 'season';

// retrieves the league's name, stage name, season and next match details for the front page's right side
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

// retrieves all matches in SuperLiga - all matches found in local DB, allong with past matches event logs
router.get("/:league_id/matches", async (req, res, next) => {
  try {
    const matches_query = "SELECT * FROM dbo.matches"; // currently not supporting leagues other than SuperLiga
    const matches_in_league = await matches_utils.get_matches_by_query(
      matches_query
    );
    res.status(200).send(matches_in_league);
    logStream.end("league matches successfully retrieved");
  } catch (error) {
    logStream.end(error.message);
    next(error);
  }
});

module.exports = router;
