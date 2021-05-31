const axios = require("axios");
const search_utils = require("../search_utils");
const teams_utils = require("../teams_utils");
const LEAGUE_ID = 271; // SuperLiga
const api_domain = "https://soccer.sportmonks.com/api/v2.0";

async function get_team_in_league(team_name, league_id = LEAGUE_ID) {
  let teams_matching_name = await search_utils.search_by_category_and_query("teams", team_name,league_id).then(
    (teams_found) => teams_found.data.data
  );
  const team_in_league = teams_utils.get_info(teams_matching_name,league_id);
  if (team_in_league.length != 1){
    throw {
      status: 400,
      message: `could not match ${team_name} to a team in the given league`,
    } 
  }
  return team_in_league;
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
