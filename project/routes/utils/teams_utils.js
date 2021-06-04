const api_domain = "https://soccer.sportmonks.com/api/v2.0";
const axios = require("axios");
let info_include_param = "league";
const users_utils = require("./users_utils");
const players_utils = require("./players_utils");
const DButils = require("./DButils");
const { get } = require("../roles/union_rep");


function get_info(teams_info) {
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
  if (!(teams instanceof Array)) {
    teams = [teams_objects];
  }
  teams.map((team_leagues) => {
    if (team_leagues.data) {
      team_leagues = team_leagues.data.data;
    }
    if (team_leagues.league.data.id == league_id) {
      teams_in_league.push(team_leagues);
    }
  });
  return teams_in_league;
}


async function get_teams_matches(matches_query) {
  const event_log_info_query = await DButils.execQuery(
    `SELECT * FROM dbo.matches_event_log WHERE match_id IN (SELECT match_id FROM dbo.matches WHERE is_over=1) ORDER BY match_id,minute_in_game`
  );
  let matches_info = await DButils.execQuery(matches_query);
  matches_info = add_event_log_to_matches_info(
    event_log_info_query,
    matches_info
  );

  return matches_info;
}

function add_event_log_to_matches_info(event_log_info_query, matches_info) {
  // make an object of arrays, each array mapping match_id to event log (events)
  let event_logs_grouped_by_id = event_log_info_query.reduce(
    (match_id_to_event_log_acc, match) => {
      match_id_to_event_log_acc[match.match_id] = [
        ...(match_id_to_event_log_acc[match.match_id] || []),
        match,
      ];
      return match_id_to_event_log_acc;
    },
    {}
  );

  // add each event log array to matches_info as additional property
  return matches_info.map(
    (match) =>
      (match.event_log = Object.values(event_logs_grouped_by_id).find(
        (event_log) => match.match_id === event_log[0].match_id
      ))
  );
}

async function get_player_and_team_info(team_id, league_id = 271) {
  let player_ids = [];
  let team_with_players = await axios.get(`${api_domain}/teams/${team_id}`, {
    params: {
      include: "squad,league",
      api_token: process.env.api_token,
    },
  });
  const team_name = team_with_players[0].data.data.name;

  team_with_players = filter_by_league(team_with_players, league_id);

  team_with_players[0].data.data.squad.data.map((player) =>
    player_ids.push(player.player_id)
  );

  const players = await users_utils.get_object_by_id(player_ids, "players");
  const player_info = players_utils.extract_relevant_data(players);
  
  return {
    team_name: team_name,
    players_info: player_info,
  };
}

async function get_team_in_league(team_name, league_id = LEAGUE_ID) {
  let teams_matching_name = await search_utils.search_by_category_and_query(
    "teams",
    team_name,
    league_id
  );
  const team_in_league = get_info(teams_matching_name, league_id);
  if (team_in_league.length != 1) {
    throw {
      status: 400,
      message: `could not match ${team_name} to a team in the given league`,
    };
  }
  return team_in_league;
}

// ************************** fix catch
async function get_venue(venue_id) {
  try {
    return await axios.get(`${api_domain}/venues/${venue_id}`, {
      params: {
        api_token: process.env.api_token,
      },
    });
  } catch (error) {
    throw {
      status: 404,
      message: "couldn't find venue for team",
    };
  }
}

exports.get_venue = get_venue;
exports.get_team_in_league = get_team_in_league;
exports.get_info = get_info;
exports.info_include_param = info_include_param;
exports.get_favorites_info = get_favorites_info;
exports.get_teams_matches = get_teams_matches;
exports.get_player_and_team_info = get_player_and_team_info;
