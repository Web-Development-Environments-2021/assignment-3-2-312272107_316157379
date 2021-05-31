const axios = require("axios");
const api_domain = "https://soccer.sportmonks.com/api/v2.0";
// const TEAM_ID = "85";

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

async function get_info(players_ids) {
  let promises = [];
  players_ids.map((id) =>
    promises.push(
      axios.get(`${api_domain}/players/${id}`, {
        params: {
          api_token: process.env.api_token,
          include: `'team','stats'`,
        },
      })
    )
  );
  const players_found = await Promise.all(promises);
  const players_in_league = filter_by_league(players_found);
  return extract_relevant_data(players_in_league);
}

function extract_relevant_data(players_info) {
  return players_info.map((player_info) => {
    const { player_id,fullname, image_path, position_id } = player_info.data.data;
    const { name } = player_info.data.data.team.data;
    return {
      id: player_id,
      name: fullname,
      image: image_path,
      position: position_id,
      team_name: name,
    };
  });
}
function extract_ids(players_objects){
  const players_ids = Object.keys(players_objects).map(k => players_objects[k].player_id);
  return players_ids;
  
}

function filter_by_league(players_objects,league_id){
  players_in_league = [];
  players_objects.map( (player_object) => {
    if (player_object.data.data.stats.data.league_id == league_id){
      players_in_league.push(player_object.data.data);
    }
  });
  return players_in_league;
}

exports.get_info = get_info;
exports.extract_ids = extract_ids;
