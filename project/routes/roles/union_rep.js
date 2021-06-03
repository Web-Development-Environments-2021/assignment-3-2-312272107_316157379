var express = require("express");
var router = express.Router();
const DButils = require("../utils/DButils");
const union_rep_utils = require("../utils/roles/union_rep_utils");
const axios = require("axios");
let fs = require("fs");
const { role_to_role_name } = require("../utils/users_utils");
let logStream = fs.createWriteStream("log.txt", { flags: "a" });
const api_domain = "https://soccer.sportmonks.com/api/v2.0";

const LEAGUE_ID = 271; // SuperLiga

router.use(async function (req, res, next) {
  const users = await DButils.execQuery(
    `SELECT * FROM dbo.user_roles WHERE user_id = ${req.body.user_id} AND user_role = '${role_to_role_name.UNION_REP}'`
  );
  if (users.length == 0) {
    throw { status: 400, message: "user doesn't have permission" };
  }
  //   .catch((err) => next(err));
  next();
});

router.post("/matches", async (req, res, next) => {
  try {
    const { date_time, home_team_name, away_team_name,stage_id } = req.body;

    //verify that teams exist in league
    const home_team = await union_rep_utils.get_team_in_league(
      home_team_name,
      LEAGUE_ID
    );
    const away_team = await union_rep_utils.get_team_in_league(
      away_team_name,
      LEAGUE_ID
    );
    
    // checks if matches with the teams happend at the same day and that there are referees available.   
    const referee_id = union_rep_utils.check_add_match_depenedecies(home_team_name,away_team_name,date_time);

    const venue = await axios.get(
      `${api_domain}/venues/${home_team[0].venue_id}`,
      {
        params: {
          api_token: process.env.api_token,
        },
      }
    );


    const match_id = await DButils.execQuery(
      `
        INSERT INTO dbo.matches(match_date_time,home_team,away_team,venue,referee_id,is_over,stage)
        OUTPUT INSERTED.match_id
        VALUES (convert(varchar,'${date_time}', 20),'${home_team_name}','${away_team_name}','${venue.data.data.name}',${referee_id},0,${stage_id});
        `
    );
    
    res.status(201);
    logStream.end("match created succesfully");
  } catch (error) {
    // logStream.end(error.message); TODO need to return to this later
    next(error);
  }
});

router.post("/matches/:match_id/event_log", async (req, res, next) => {
  try {
    let { minute_in_game, event_type, event_description } = req.body;
    // classify event type to either existing one or other
    active_mactch=await DButils.execQuery(
      `SELECT match_id FROM dbo.matches WHERE is_over=0 AND match_id=${req.params.match_id}`
    );
    if (active_mactch.length == 0)
    {
      throw { status: 400, message: "can't add log-match" };
    }
    const event_type_name =Object.values(union_rep_utils.event_types).find(
      (value) => value === event_type);
    
    const away_scores = 0
    const home_scores = 0
    const is_over=0
    if (event_type_name === "undefined") {
      event_type = union_rep_utils.event_types.other;
    }
    else if(event_type_name==="End-match"){
      is_over=1
    }
    else if(event_type_name==="Home-Goal"){
      home_scores = 1
    } 
    else if(event_type_name==="Away-Goal"){
      away_scores = 1
    }
    await DButils.execQuery(
      `
          DECLARE @time time = (SELECT CAST( GETDATE() AS datetime ));
          INSERT INTO dbo.matches_event_log(match_id,event_date,event_time,minute_in_game,event_type,description)
          VALUES (${req.params.match_id}, @date, @time ,${minute_in_game},'${event_type}','${event_description}');
          `
    );
    await DButils.execQuery(
      `
      -- UPDATE matches SET
      is_over=${is_over},home_team_goals = home_team_goals+${home_scores} ,away_team_goals = away_team_goals+${away_scores}
          `
    );

    const match_creation_message = "event added successfully";
    res.status(201).send(match_creation_message);
    logStream.end(match_creation_message);
  } catch (error) {
    // logStream.end(error.message);
    next(error);
  }
});

module.exports = router;
