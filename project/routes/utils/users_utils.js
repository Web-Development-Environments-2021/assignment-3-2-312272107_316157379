const DButils = require("./DButils");
// const { getPlayersInfo } = require("./players_utils");
const players_utils = require("./players_utils");
const match_utils = require("./match_utils");

const role_to_role_name = {
    SUBSCRIBER: 'subscriber',
    REFEREE: 'referee',
    PLAYER:  'player',
    UNION_REP: 'union_representative',
} ;
const favorite_categories = {
  MATCH: 'match',
  PLAYER: 'player',
  TEAM:  'team'
} ;

async function markPlayerAsFavorite(user_id, player_id) {
  await DButils.execQuery(
    `insert into FavoritePlayers values ('${user_id}',${player_id})`
  );
}

async function getFavoritePlayers(user_id) {
  const player_ids = await DButils.execQuery(
    `select player_id from FavoritePlayers where user_id='${user_id}'`
  );
  return player_ids;
}

async function verify_category(category_name){
  if(
    Object.values(favorite_categories).find
  ( (possible_category) => possible_category === category_name)
   === 'undefined'){
    throw { status: 400, message: "invalid category name" };
  }
}


 function get_favorites_handler(category_name){
  if (category_name == favorite_categories.PLAYER){
    return players_utils.getPlayersInfo;
 }
 else if(category_name == favorite_categories.MATCH){
    return match_utils.get_matches_info;
 }
 else{ // teams
      return players_utils.getPlayersByTeam;
 }
}
 


exports.markPlayerAsFavorite = markPlayerAsFavorite;
exports.getFavoritePlayers = getFavoritePlayers;
exports.role_to_role_name = role_to_role_name;
exports.favorite_categories = favorite_categories;
exports.verify_category = verify_category;
exports.get_favorites_handler = get_favorites_handler;


