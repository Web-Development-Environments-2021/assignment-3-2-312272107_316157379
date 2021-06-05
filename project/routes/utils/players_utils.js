let info_include_param = `team,stats,position`;
const LEAGUE_ID = 271;
function get_basic_info(player){
  return {
    id: player.player_id,
    name: player.common_name,
    nationality: player.nationality,
    country: player.birthcountry,
    birth_date: player.birthdate,
    height: player.height,
    weight: player.weight,  
    image: player.image_path,
  }
}


function get_full_info(players) {
  const players_full_info = players.map((player) => {
    let player_info  = get_basic_info(player);
    player_info.team_name = player.team.data.name;
    player_info.player_position = player.position.data.name;
    return player_info;
  });
  return players_full_info;
}

function filter_by_league(players_objects,league_id = LEAGUE_ID) {
  let players_in_league = [];
  let players = players_objects.data.data;
  if (!(players instanceof Array)) {
    players = [players];
  }
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


async function get_info(players,caller){
  let players_as_objects;
  if(caller != 'search'){ //favorites, get_player_by_id
    players_as_objects = await users_utils.get_object_by_id(players,'player');
  }
  else{ // search results already as objects
    players_as_objects = players;
  }
  const players_in_league = filter_by_league(players_as_objects,LEAGUE_ID);
  const players_info = get_full_info(players_in_league);
  return players_info;
}


exports.get_info = get_info;
exports.info_include_param = info_include_param;
exports.filter_by_league = filter_by_league;
exports.get_basic_info = get_basic_info;
