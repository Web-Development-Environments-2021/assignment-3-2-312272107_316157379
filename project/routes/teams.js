var express = require("express");
var router = express.Router();
const teams_utils = require("./utils/teams_utils");
const LEAGUE_ID = 271;
let fs = require("fs");
let logStream = fs.createWriteStream("log.txt", { flags: "a" });


router.get("/:team_name/matches", async (req, res, next) => {
    try {
      // const matches_query = `SELECT * from dbo.matches`;
        const team_name = req.params.team_name; 
        const matches_query = `SELECT * FROM dbo.matches WHERE (home_team='${team_name}') OR (away_team='${team_name}')`;
        const matches_full_info = teams_utils.get_teams_matches(matches_query);
        res.status(200).send(matches_full_info);
        logStream.end(`matches successfully retrieved when searching for team ${team_name}`);
    } catch (error) {
      logStream.end(error.message);
      next(error);
    }
  });


router.get("/get_page_details/:team__id", async (req, res, next) => {
  try {
    const players_info = await teams_utils.get_players_info_for_team_page(
      req.params.team__id
    );
    const matches_query = `SELECT * from dbo.matches`;
    const matches_info = teams_utils.get_teams_matches(matches_query);
    const full_team_details ={
      match_details: matches_info,
      players_details: players_info
    } 
    res.status(200).send(full_team_details);
    logStream.end(`information successfully retrieved for team page`);
  } catch (error) {
    logStream.end(error.message);
    next(error);
  }
});

module.exports = router;


module.exports = router;
