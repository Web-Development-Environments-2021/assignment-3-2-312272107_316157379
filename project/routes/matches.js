var express = require("express");
var router = express.Router();
const players_utils = require("./utils/players_utils");
const league_utils = require("./utils/league_utils");
const teams_utils = require("./utils/teams_utils");


const DButils = require("./DButils");
const LEAGUE_ID = 271;


// returns all matches' info in current stage, past games also include their event logs.
router.get("/:stage_id", async (req, res, next) => {
    try {
        const matches_query = `SELECT * from dbo.matches WHERE stage=${req.params.stage_id}`;
        const matches_full_info = teams_utils.get_teams_matches(matches_query);
        res.status(200).send(matches_full_info);
        logStream.end(`matches retrieved successfully`);
      } catch (error) {
        logStream.end(error.message);
        next(error);
      }
  });

module.exports = router;