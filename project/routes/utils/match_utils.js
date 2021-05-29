const DButils = require("./DButils");

async function get_matches_info(favorites_ids_as_array){
    const favorites_ids_as_string = favorites_ids_as_array.join();
    const favorites = await DButils.execQuery(
      `SELECT match_date,hour,home_team,away_team,venue FROM dbo.matches WHERE match_id IN 
      (${favorites_ids_as_string})`
    );
    return favorites;
}

exports.get_matches_info = get_matches_info;