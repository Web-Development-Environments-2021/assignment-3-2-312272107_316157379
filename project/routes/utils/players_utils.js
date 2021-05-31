const axios = require("axios");
const api_domain = "https://soccer.sportmonks.com/api/v2.0";
// const TEAM_ID = "85";

async function getPlayerIdsByTeam(team_id) {
  let player_ids_list = [];
  const team = await axios.get(`${api_domain}/teams/${team_id}`, {
    params: {
      include: "squad",
      api_token: process.env.api_token,
    },
  });
  team.data.data.squad.data.map((player) =>
    player_ids_list.push(player.player_id)
  );
  return player_ids_list;
}

async function get_info(players_ids) {
  let promises = [];
  players_ids.map((id) =>
    promises.push(
      axios.get(`${api_domain}/players/${id}`, {
        params: {
          api_token: process.env.api_token,
          include: "team",
        },
      })
    )
  );
  let players_info = await Promise.all(promises);
  return extract_relevant_data(players_info);
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
  

  // return Object.keys(players_objects).map(
  //   (k) => players_objects[k][player_id]);
}

exports.get_info = get_info;
exports.extract_ids = extract_ids;
