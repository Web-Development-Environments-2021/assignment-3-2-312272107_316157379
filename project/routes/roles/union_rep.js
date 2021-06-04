var express = require("express");
var router = express.Router();

const matches_utils = require('../utils/matches_utils');
const teams_utils = require('../utils/teams_utils');
const users_utils = require('../utils/users_utils');


let fs = require("fs");
let logStream = fs.createWriteStream("log.txt", { flags: "a" });

const LEAGUE_ID = 271; // SuperLiga

router.use(async function (req, res, next) {
  try{
    users_utils.validate_role(req.session.user_id,users_utils.role_to_role_name.UNION_REP)
    next();
  } catch(error){
    next(error);
  }
});

router.post('/matches', async (req, res, next) => {
  try {
    const { date_time, home_team_name, away_team_name,stage_id } = req.body;

    //verify that teams exist in league
    const home_team = await teams_utils.get_team_in_league(
      home_team_name,
      LEAGUE_ID
    );
    await teams_utils.get_team_in_league(
      away_team_name,
      LEAGUE_ID
    );
    
    // checks if matches with the teams happend at the same day and that there are referees available.   
    const referee_id = await matches_utils.check_add_match_depenedecies(home_team_name,away_team_name,date_time);

    const venue = await teams_utils.get_venue(home_team[0].venue_id);

    const match_id = await matches_utils.insert_new_match(date_time,home_team_name,away_team_name,venue.data.data.name,referee_id,stage_id);
    const success_message = 'match created succesfully'; 
    res.status(201).send(success_message);
    logStream.end(success_message);
  } catch (error) {
    logStream.end(error.message); 
    next(error);
  }
});

router.post("/matches/:match_id/event_log", async (req, res, next) => {
  try {
    let { minute_in_game, event_type, event_description } = req.body;
    const match_id = req.params.match_id;
    await matches_utils.verify_active_match(match_id); // match exists and not over

    // insert a new event into the DB and update the match details accordingly
    const event_type_name = await matches_utils.insert_new_event(match_id,minute_in_game,event_type,event_description); 

    const match_creation_message = `event of type ${event_type_name} was added successfully`;
    res.status(201).send(match_creation_message);
    logStream.end(match_creation_message);
  } catch (error) {
    logStream.end(error.message);
    next(error);
  }
});

module.exports = router;
