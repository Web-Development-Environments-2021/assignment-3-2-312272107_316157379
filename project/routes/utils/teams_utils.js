const api_domain = "https://soccer.sportmonks.com/api/v2.0";
const axios = require("axios");

// async function get_info(teams_ids) {
//     let player_ids_list = await getPlayerIdsByTeam(team_id);
//     let players_info = await get_players_info(player_ids_list);
//     return players_info;
//   }

async function get_info(teams_ids,league_id) {
  let promises = [];
  teams_ids.map((id) =>
    promises.push(
      axios.get(`${api_domain}/teams/${id}`, {
        params: {
          api_token: process.env.api_token,
          include: "league"
        },
      })
    )
  );
  const teams_objects = await Promise.all(promises);
  const teams_in_league = filter_by_league(teams_objects,league_id); 
  return extract_relevant_data(teams_in_league);
}
function extract_relevant_data(teams_info) {
  return teams_info.map( (team_info) => {
    const { id,name,logo_path } = team_info;
    return {
      id: id,
      name: name,
      logo: logo_path
    };
  });
}
function extract_ids(teams_objects){
  return teams_objects.map((team_object) => team_object.team_id);
}


function filter_by_league(teams_objects,league_id){
  teams_in_league = [];
  teams_objects.map( (team_leagues) => {
    if (team_leagues.data.data.league.data.id == league_id){
      teams_in_league.push(team_leagues.data.data);
    }
  });
  return teams_in_league;
}


exports.get_info = get_info;
exports.extract_ids = extract_ids;
exports.filter_by_league = filter_by_league;
