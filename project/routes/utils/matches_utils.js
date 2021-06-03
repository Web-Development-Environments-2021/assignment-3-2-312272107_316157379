const { get } = require("../teams");
const DButils = require("./DButils");
const info_include_param = '';

async function get_favorites_info(matches_ids,category,league_id){
    const favorites_ids_as_string = matches_ids.join();
    const favorites = await DButils.execQuery(
      `SELECT * FROM dbo.matches WHERE match_id IN 
      (${favorites_ids_as_string})`  
    ); 
    return favorites;
}
async function get_next_match_in_league(){
  const next_match =  await DButils.execQuery // TODO doesn't reference any league or season
  (
    `
    SELECT TOP 1 *
    FROM dbo.matches
    WHERE matches.match_date_time  >  GETDATE() 
    ORDER BY dbo.matches.match_date_time ASC
    `
  )
  return next_match;

}



exports.get_favorites_info = get_favorites_info;
exports.info_include_param = info_include_param;
exports.get_next_match_in_league = get_next_match_in_league;