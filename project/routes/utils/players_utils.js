let info_include_param = `team,stats,position`;


function extract_relevant_data(players) {
  return players.map((player_info) => {
    const { player_id,common_name,nationality,birthdate,birthcountry,height,weight, fullname, image_path } =
      player_info;
    const team_name = player_info.team.data;
    const player_position = player_info.position.data.name;

    return {
      id: player_id,
      name: fullname,
      common_name: common_name,
      nationality: nationality,
      country: birthcountry,
      birth_date: birthdate,
      height: height,
      weight: weight,  
      image: image_path,
      position: player_position,
      team_name: team_name,
    };
  });
}

function filter_by_league(players_objects,LEAGUE_ID) {
  let players_in_league = [];
  let players = players_objects.data.data;
  if (!(players instanceof Array)) {
    players = [players];
  }
  players.data.data.map((player) => {
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
  if(caller == 'favorites'){
    players_as_objects = await users_utils.get_object_by_id(players,'player');
  }
  else{ // favorites already as objects
    players_as_objects = teams;
  }
  const players_in_league = filter_by_league(players_as_objects,LEAGUE_ID);
  const players_info = extract_relevant_data(players_in_league);
  return players_info;
}


exports.get_info = get_info;
exports.info_include_param = info_include_param;
exports.filter_by_league = filter_by_league;
