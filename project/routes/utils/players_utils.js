const info_include_param = `team,stats,position`;
const LEAGUE_ID = 271;
const users_utils = require("./users_utils");
// const DBUtils = require("./DButils");
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
    birth_country: player.birthCountry,
    country: player.birthcountry,
    birth_date: player.birthdate,
    height: player.height,
    weight: player.weight,
    image: player.image_path,
    player_position: player.position_id,
  };
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
async function get_info(players, caller, user_id) {
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
  const players_info = get_full_info(players_in_league, user_id);
  return players_info;
}

async function get_full_info(players, user_id) {
  let favorite_players_ids;
  if (user_id) {
    favorite_players_ids = await users_utils.get_favorites_ids(
      "player",
      user_id
    );
    favorite_players_ids = new Set(favorite_players_ids);
  } else {
    favorite_players_ids = new Set();
  }

  let players_info = players.map((player) => {
    let player_details;
    if(player.player){
      player_details = player.player.data;
    }
    player_details = get_basic_info(player);
    if (player.team) {
      player.team_name = player.team.data.name;
    }
    player_details.in_favorites = favorite_players_ids.has(player_details.id);
    return player_details;
  });
  return players_info;
}

async function in_favorites(player_id, user_id) {
  if (!user_id) {
    return false;
  }
  let favorite_players_ids = await users_utils.get_favorites_ids(
    "player",
    user_id
  );
  favorite_players_ids = new Set(favorite_players_ids);
  return favorite_players_ids.has(parseInt(player_id));
}

exports.in_favorites = in_favorites;
exports.info_include_param = info_include_param;
exports.get_info = get_info;
exports.filter_by_league = filter_by_league;
exports.get_basic_info = get_basic_info;
