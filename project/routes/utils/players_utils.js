const axios = require("axios");
const api_domain = "https://soccer.sportmonks.com/api/v2.0";
const info_include_param = `team,stats,position`;


function get_info(players_objects, league_id) {
  const players_in_league = filter_by_league(players_objects, league_id);
  return extract_relevant_search_data(players_in_league);
}

function extract_relevant_search_data(players_info) {
  return players_info.map((player_info) => {
    const { player_id,common_name,nationality,birthdate,birthcountry,height,weight, fullname, image_path } =
      player_info;
    const { team_name } = player_info.team.data;
    const { position } = player_info.position.data.name;

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
      position: position,
      team_name: team_name,
    };
  });
}

function filter_by_league(players_objects, league_id) {
  let players_in_league = [];
  players_objects.data.data.map((player_object) => {
    const player_stats_data = player_object.stats.data;
    if (
      player_stats_data.length > 0 &&
      player_stats_data[0].league_id == league_id
    ) {
      players_in_league.push(player_object);
    }
  });
  return players_in_league;
}

async function get_favorites_info(players_ids, category, league_id) {
  const players_objects = await users_utils.get_object_by_id(
    players_ids,
    category
  );
  return get_info(players_objects, league_id);
}

function extract_relevant_information_for_team_page(players){
    return players.map(player => player.name);
}


exports.get_info = get_info;
exports.info_include_param = info_include_param;
exports.get_favorites_info = get_favorites_info;
exports.extract_relevant_information_for_team_page = extract_relevant_information_for_team_page;
