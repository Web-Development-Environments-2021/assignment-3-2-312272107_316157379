const api_domain = "https://soccer.sportmonks.com/api/v2.0";
const axios = require("axios");
let info_include_param = "league";
const users_utils = require("./users_utils");
const players_utils = require("./players_utils");
const DButils = require("./DButils");

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
    const { id, name, logo_path, venue_id } = team_info;
    return {
      id: id,
      name: name,
      logo: logo_path,
      venue_id: venue_id,
    };
  });
}

function filter_by_league(teams_objects, league_id) {
  let teams_in_league = [];
  let teams = teams_objects.data.data;
  if (typeof teams !== Array) {
    teams = [teams_objects];
  }
  teams.map((team_leagues) => {
    if (team_leagues.data.data.league.data.id == league_id) {
      teams_in_league.push(team_leagues);
    }
  });
  return teams_in_league;
}
async function get_favorites_info(teams_ids, category, league_id) {
  const teams_objects = await users_utils.get_object_by_id(teams_ids, category);
  return get_info(teams_objects, league_id);
}

async function get_teams_matches(matches_query) {
  const event_log_info_query = await DButils.execQuery(
    `SELECT * FROM dbo.matches_event_log WHERE match_id IN (SELECT match_id FROM dbo.matches WHERE is_over=1) ORDER BY match_id,minute_in_game`
  );
  let matches_info = await DButils.execQuery(matches_query);


  let event_logs_grouped_by_id = event_log_info_query.reduce(
    (some_obj, match) => {

      some_obj[match.match_id] = [...(some_obj[match.match_id] || []), match];
      return some_obj;
    },
    {}
  );
  matches_info.map(
    match => match.event_log = Object.values(event_logs_grouped_by_id).find(
        event_log => match.match_id === event_log[0].match_id));

  return matches_info;
}

async function get_player_and_team_info(team_id, league_id = 271) {
  let player_ids = [];
  let team_with_players = await axios.get(`${api_domain}/teams/${team_id}`, {
    params: {
      include: "squad,league",
      api_token: process.env.api_token,
    },
  });
  team_with_players = filter_by_league(team_with_players, league_id);

  team_with_players[0].data.data.squad.data.map((player) =>
    player_ids.push(player.player_id)
  );

  const tmp_include_param = players_utils.info_include_param;
  players_utils.info_include_param = ""; // not taking any additional information atm

  const players = await users_utils.get_object_by_id(player_ids, "players");

  players_utils.info_include_param = tmp_include_param;

  const player_info =
    players_utils.extract_relevant_information_for_team_page(players);
  const team_name = team_with_players[0].data.data.name;
  return {
    team_name: team_name,
    players_info: player_info,
  };
}

exports.get_info = get_info;
exports.info_include_param = info_include_param;
exports.get_favorites_info = get_favorites_info;
exports.get_teams_matches = get_teams_matches;
exports.get_player_and_team_info = get_player_and_team_info;
