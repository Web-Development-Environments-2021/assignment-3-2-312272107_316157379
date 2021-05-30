const DButils = require("./DButils");

async function get_info(matches_ids){
    const favorites_ids_as_string = matches_ids.join();
    const favorites = await DButils.execQuery(
      `SELECT match_date,hour,home_team,away_team,venue FROM dbo.matches WHERE match_id IN 
      (${favorites_ids_as_string})`
    ); //check if output needs further processing
    return favorites;
}

exports.get_info = get_info;