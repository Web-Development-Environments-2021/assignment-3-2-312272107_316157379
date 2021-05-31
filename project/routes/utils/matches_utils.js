const DButils = require("./DButils");
const info_include_param = '';

async function get_favorites_info(matches_ids,category,league_id){
    const favorites_ids_as_string = matches_ids.join();
    const favorites = await DButils.execQuery(
      `SELECT match_id,match_date,hour,home_team,away_team,venue FROM dbo.matches WHERE match_id IN 
      (${favorites_ids_as_string})`  
    ); 
    return favorites;
}



exports.get_favorites_info = get_favorites_info;
exports.info_include_param = info_include_param;