const api_domain = "https://soccer.sportmonks.com/api/v2.0";

// async function get_info(teams_ids) {
//     let player_ids_list = await getPlayerIdsByTeam(team_id);
//     let players_info = await get_players_info(player_ids_list);
//     return players_info;
//   }

async function get_info(teams_ids) {
  let promises = [];
  teams_ids.map((id) =>
    promises.push(
      axios.get(`${api_domain}/teams/${id}`, {
        params: {
          api_token: process.env.api_token
        },
      })
    )
  );
  let teams_info = await Promise.all(promises);
  return extract_relevant_data(teams_info);
}
function extract_relevant_data(teams_info) {
  return teams_info.map( (team_info) => {
    const { name,logo_path } = team_info.data.data;
    return {
      name: name,
      logo: logo_path
    };
  });
}

exports.get_info = get_info;
