var express = require("express");
var router = express.Router();
const teams_utils = require("./utils/teams_utils");
const matches_utils = require("./utils/matches_utils");
let fs = require("fs");
let logStream = fs.createWriteStream("log.txt", { flags: "a" });

// get information for team page - matches team participated in, team preview info and player preview info for each player in the team.
router.get("/get_page_details/:team_id", async (req, res, next) => {
  try {
    let team_players_info = await teams_utils.get_player_and_team_info(
      req.params.team_id,req.session.user_id
    );
    // get matches team participated in.
    const matches_query = `SELECT * from dbo.matches WHERE home_team = '${team_players_info.team_name}'  OR away_team= '${team_players_info.team_name}'`;
    let matches_info = await matches_utils.get_matches_by_query(
      matches_query
    );
    matches_info =  matches_utils.divide_to_past_and_future_matches(matches_info);
    const full_team_details = {
      team_details: team_players_info.team_details,
      match_details: matches_info,
      players_details: team_players_info.players,

    };
    res.status(200).send(full_team_details);
    logStream.end(`information successfully retrieved for team page`);
  } catch (error) {
    logStream.end(error.message);
    next(error);
  }
});

module.exports = router;
