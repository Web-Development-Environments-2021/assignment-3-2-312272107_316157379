var express = require("express");
var router = express.Router();
const DButils = require("../utils/DButils");
const union_rep_utils = require("../utils/roles/union_rep_utils");
const axios = require("axios");
let fs = require('fs');
let logStream = fs.createWriteStream('log.txt', {flags: 'a'});
const api_domain = "https://soccer.sportmonks.com/api/v2.0";
  
const LEAGUE_ID = 271; // SuperLiga


router.post("/matches", async (req, res, next) => {
try {
    // TODO verify user has role of union rep, extract info from cookie first

    const {date,hour,home_team_name,away_team_name} = req.body; 

    //verify that teams exist in league 
    const home_team = await union_rep_utils.get_team_in_league(home_team_name,LEAGUE_ID);
    const away_team = await union_rep_utils.get_team_in_league(away_team_name,LEAGUE_ID);
    if (home_team === 'undefined' || away_team === 'undefined')
        throw { status: 400, message: "match could not be added,teams invalid or not in league"};


    const venue = await axios.get(`${api_domain}/venues/${home_team.venue_id}`, {
        params: {
          api_token: process.env.api_token,
        },
      });
    await DButils.execQuery(
        `
        DECLARE @date date = '${date}';
        DECLARE @time time = '${hour}';
        INSERT INTO dbo.matches(match_date, hour,home_team,away_team,venue)
        VALUES (@date,@time ,'${home_team_name}','${away_team_name}','${venue.data.data.name}');
        `
      );
    
    const match_creation_message = 'match created succesfully';
    res.status(201).send(match_creation_message);
    logStream.end(match_creation_message);
  } catch (error) {
    // logStream.end(error.message); TODO need to return to this later
    next(error);
  }
});

module.exports = router;