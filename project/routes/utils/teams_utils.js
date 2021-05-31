const api_domain = "https://soccer.sportmonks.com/api/v2.0";
const axios = require("axios");
const { get_favorites_ids } = require("./users_utils");
const info_include_param = 'league';

// async function get_info(teams_ids) {
//     let player_ids_list = await getPlayerIdsByTeam(team_id);
//     let players_info = await get_players_info(player_ids_list);
//     return players_info;
//   }

function get_info(teams_objects, league_id) {
  const teams_in_league = filter_by_league(teams_objects, league_id);
  return extract_relevant_data(teams_in_league);
}
function extract_relevant_data(teams_info) {
  return teams_info.map((team_info) => {
    const { id, name, logo_path } = team_info;
    return {
      id: id,
      name: name,
      logo: logo_path,
    };
  });
}

function filter_by_league(teams_objects, league_id) {
  let teams_in_league = [];
  teams_objects.data.data.map( (team_leagues) => {
    if (team_leagues.league.data.id == league_id) {
      teams_in_league.push(team_leagues);
    }
  });
  return teams_in_league;
}
async function get_favorites_info(teams_ids,category,league_id){
  const teams_objects = await users_utils.get_object_by_id(teams_ids,category);
  return get_info(teams_objects,league_id);
}

exports.get_info = get_info;
exports.info_include_param = info_include_param;
exports.get_favorites_info = get_favorites_info;
