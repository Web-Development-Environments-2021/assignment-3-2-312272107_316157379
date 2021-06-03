const axios = require("axios");
const search_utils = require("../search_utils");
const teams_utils = require("../teams_utils");
const LEAGUE_ID = 271; // SuperLiga
const api_domain = "https://soccer.sportmonks.com/api/v2.0";

async function get_team_in_league(team_name, league_id = LEAGUE_ID) {
  let teams_matching_name = await search_utils.search_by_category_and_query("teams", team_name,league_id);
  const team_in_league = teams_utils.get_info(teams_matching_name,league_id);
  if (team_in_league.length != 1){
    throw {
      status: 400,
      message: `could not match ${team_name} to a team in the given league`,
    } 
  }
  return team_in_league;
}

async function check_add_match_depenedecies(home_team_name,away_team_name,date_time){

  const teams_plays_today=await DButils.execQuery(
    `
    SELECT match_id from matches WHERE 
    ((home_team = '${home_team_name}' or away_team= '${home_team_name}') or (home_team = '${away_team_name}' or away_team= '${away_team_name}'))  and
    CAST(matches.match_date_time As date) = CAST('${date_time}' As date)      
      `
  );
  const free_referees = await DButils.execQuery(
    `
    SELECT user_id  FROM user_roles WHERE user_role = 'referee' AND user_id not in 
    (SELECT referee_id from matches WHERE
    CAST(matches.match_date_time As date) = CAST('${date_time}' As date))
    `
  );

  if (free_referees.length==0 || teams_plays_today.length != 0 ){
    throw { status: 400, message: "can't add match" };
  }
  
  return free_referees[0].user_id;


}

const event_types = {
  goal: "Goal",
  offside: "Offside",
  foul: "Foul",
  redcard: "Red-Card",
  yellowcard: "Yellow-Card",
  injury: "Injury",
  sub: "Substitution",
  other: "Other",
};

exports.get_team_in_league = get_team_in_league;
exports.event_types = event_types;
exports.check_add_match_depenedecies = check_add_match_depenedecies;
