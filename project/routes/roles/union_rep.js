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
    `SELECT * FROM dbo.user_roles WHERE (user_id = '${req.body.user_id}') AND (user_role = '${role_to_role_name.UNION_REP}')`
  );
  if (users.length == 0) {
    throw { status: 400, message: "user dones't have premission" };
  }
  //   .catch((err) => next(err));
  next();
});

router.post("/matches", async (req, res, next) => {
  try {
    const { date, hour, home_team_name, away_team_name } = req.body;

    //verify that teams exist in league
    const home_team = await union_rep_utils.get_team_in_league(
      home_team_name,
      LEAGUE_ID
    );
    const away_team = await union_rep_utils.get_team_in_league(
      away_team_name,
      LEAGUE_ID
    );

    const venue = await axios.get(
      `${api_domain}/venues/${home_team.venue_id}`,
      {
        params: {
          api_token: process.env.api_token,
        },
      }
    );

    const match_id = await DButils.execQuery(
      `
        DECLARE @date date = '${date}';
        DECLARE @time time = '${hour}';
        INSERT INTO dbo.matches(match_date, hour,home_team,away_team,venue)
        OUTPUT INSERTED.match_id
        VALUES (@date,@time ,'${home_team_name}','${away_team_name}','${venue.data.data.name}');
        `
    );

    const match_creation_message = "match created succesfully";
    res.status(201).send(match_id);
    logStream.end(match_creation_message);
  } catch (error) {
    // logStream.end(error.message); TODO need to return to this later
    next(error);
  }
});

router.post("/matches/:match_id/event_log", async (req, res, next) => {
  try {
    let { minute_in_game, event_type, event_description } = req.body;
    // classify event type to either existing one or other
    if (
      Object.values(union_rep_utils.event_types).find(
        (value) => value === event_type
      ) === "undefined"
    ) {
      event_type = union_rep_utils.event_types.other;
    }

    await DButils.execQuery(
      `
          DECLARE @date date = (SELECT CAST( GETDATE() AS Date ));
          DECLARE @time time = (SELECT CAST( GETDATE() AS Time ));
          INSERT INTO dbo.matches_event_log(match_id,event_date,event_time,minute_in_game,event_type,description)
          VALUES (${req.params.match_id}, @date, @time ,${minute_in_game},'${event_type}','${event_description}');
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
