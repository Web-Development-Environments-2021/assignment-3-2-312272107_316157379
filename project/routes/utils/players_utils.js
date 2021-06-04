const axios = require("axios");
const api_domain = "https://soccer.sportmonks.com/api/v2.0";
let info_include_param = `team,stats,position`;


function get_info(players) {
  return players.map((player_info) => {
    const { player_id,common_name,nationality,birthdate,birthcountry,height,weight, fullname, image_path } =
      player_info;
    const team_name = player_info.team.data;
    const player_position = player_info.position.data.name;

    return {
      id: player_id,
      name: fullname,
      common_name: common_name,
      nationality: nationality,
      country: birthcountry,
      birth_date: birthdate,
      height: height,
      weight: weight,  
      image: image_path,
      position: player_position,
      team_name: team_name,
    };
  });
}

function filter_by_league(players_objects, league_id) {
  let players_in_league = [];
  let players = players_objects.data.data;
  if (!(players instanceof Array)) {
    players = [players];
  }
  players.data.data.map((player) => {
    const player_stats_data = player.stats.data;
    if (
      player_stats_data.length > 0 &&
      player_stats_data[0].league_id == league_id
    ) {
      players_in_league.push(player);
    }
  });
  return players_in_league;
}

async function get_favorites_info(players_ids, category, league_id) {

  return get_info(players_objects, league_id);
}



// function extract_relevant_information_for_team_page(players){
//     return players.map(player => player.data.data.fullname);
// }


exports.get_info = get_info;
exports.info_include_param = info_include_param;
