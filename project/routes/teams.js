var express = require("express");
var router = express.Router();
const teams_utils = require("./utils/teams_utils");
let fs = require("fs");
let logStream = fs.createWriteStream("log.txt", { flags: "a" });


router.get("/:team_name/matches", async (req, res, next) => {
    try {
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


router.get("/get_page_details/:team_id", async (req, res, next) => {
  try {
    const page_info = await teams_utils.get_player_and_team_info(
      req.params.team_id
    );
    const matches_query = `SELECT * from dbo.matches WHERE home_team = '${page_info.team_name}'  OR away_team= '${page_info.team_name}'`;
    const matches_info = await teams_utils.get_teams_matches(matches_query);
    const full_team_details ={
      match_details: matches_info,
      players_details: page_info.players_info
    } 
    res.status(200).send(full_team_details);
    logStream.end(`information successfully retrieved for team page`);
  } catch (error) {
    logStream.end(error.message);
    next(error);
  }
});

module.exports = router;
