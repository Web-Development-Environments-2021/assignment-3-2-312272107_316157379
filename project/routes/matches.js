var express = require("express");
var router = express.Router();
const players_utils = require("./utils/players_utils");
const teams_utils = require("./utils/teams_utils");


const DButils = require("./DButils");
const LEAGUE_ID = 271;

router.get("/matches", async (req, res, next) => {
    try {
        const matches_query = `SELECT * from dbo.matches`;
        const matches_full_info = teams_utils.get_teams_matches(matches_query);
        res.status(200).send(matches_full_info);
        logStream.end(`matches retrieved successfully`);
      } catch (error) {
        logStream.end(error.message);
        next(error);
      }
  });

module.exports = router;