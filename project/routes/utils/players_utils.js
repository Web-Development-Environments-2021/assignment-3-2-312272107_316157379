const info_include_param = `team,stats,position`;
const LEAGUE_ID = 271;
const users_utils = require("./users_utils");
/**
 *
 *
 * @param {*} player: player object with information extracted from external API
 * @return {Object} containing display information of player
 */
function get_basic_info(player) {
  return {
    id: player.player_id,
    full_name: player.fullname,
    common_name: player.common_name,
    nationality: player.nationality,
    country: player.birthcountry,
    birth_date: player.birthdate,
    height: player.height,
    weight: player.weight,
    image: player.image_path,
  };
}
/**
 * display information of player, plus team name and player's position.
 * @param {*} players
 * @return {*}
 */
function get_full_info(players) {
  const players_full_info = players.map((player) => {
    let player_info = get_basic_info(player);
    player_info.team_name = player.team.data.name;
    player_info.player_position = player.position.data.name;
    return player_info;
  });
  return players_full_info;
}
/**
 * filters players based on league
 *
 * @param {*} players: players object from different leagues
 * @param {*} [league_id=LEAGUE_ID] SuperLiga
 * @return {*} players in league of league_id
 */
function filter_by_league(players, league_id = LEAGUE_ID) {
  if (!(players instanceof Array)) {
    players = [players];
  }
  let players_in_league = [];
  players.map((player) => {
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
/**
 * processes players ids or objects input, returning relevant information only for players in the SuperLiga.
 *
 * @param {*} players: player objects with information or player ids extracted from external API.
 * @param {*} caller: function that has called this function. different callers have different inputs for the function and therefore require different handling.
 * @return {*}
 */
async function get_info(players, caller) {
  let players_as_objects;
  if (caller != "search") {
    //favorites, get_player_by_id
    players_as_objects = await users_utils.get_object_by_id(players, "player");
    players_as_objects = players_as_objects.map((player) => player.data.data);
  } else {
    // search results already as objects
    players_as_objects = players.data.data;
  }
  const players_in_league = filter_by_league(players_as_objects, LEAGUE_ID);
  const players_info = get_full_info(players_in_league);
  return players_info;
}

exports.info_include_param = info_include_param;
exports.get_info = get_info;
exports.filter_by_league = filter_by_league;
exports.get_basic_info = get_basic_info;
