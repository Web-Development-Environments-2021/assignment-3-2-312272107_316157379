const axios = require("axios");
const api_domain = "https://soccer.sportmonks.com/api/v2.0";
const info_include_param = `team,stats`;

// async function getPlayerIdsByTeam(team_id) {
//   let player_ids_list = [];
//   const team = await axios.get(`${api_domain}/teams/${team_id}`, {
//     params: {
//       include: "squad",
//       api_token: process.env.api_token,
//     },
//   });
//   team.data.data.squad.data.map((player) =>
//     player_ids_list.push(player.player_id)
//   );
//   return player_ids_list;
// }
function get_info(players_objects, league_id) {
  const players_in_league = filter_by_league(players_objects, league_id);
  return extract_relevant_data(players_in_league);
}

function extract_relevant_data(players_info) {
  return players_info.map((player_info) => {
    const { player_id, fullname, image_path, position_id } =
      player_info;
    const { name } = player_info.team.data;
    return {
      id: player_id,
      name: fullname,
      image: image_path,
      position: position_id,
      team_name: name,
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

exports.get_info = get_info;
exports.info_include_param = info_include_param;
exports.get_favorites_info = get_favorites_info;
