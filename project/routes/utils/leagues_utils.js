const axios = require("axios");
const LEAGUE_ID = 271; // SuperLiga
const api_domain = "https://soccer.sportmonks.com/api/v2.0";
const matches_utils = require("./matches_utils");
const search_utils = require("./search_utils");
const CURRENT_SEASON = 18334;
const random_stage_in_superliga = 77453565;
const info_include_param = 'season';


/**
 *
 *
 * @param {*} league_id
 * @return {*} SuperLiga's information
 */
async function get_league_by_id(league_id) {
  let league = await axios.get(`${api_domain}/leagues/${LEAGUE_ID}`, {
    params: {
      include: "season",
      api_token: process.env.api_token,
    },
  });
  if (!league) {
    throw {
      status: 404,
      message: `could not find league with league id ${league_id}`,
    };
  }
  league = league.data.data;
  return league;
}

// async function get_stage_by_id(stage_id) {
//   let stage = null;
//   if (stage_id) {
//     stage = await axios.get(
//       `${api_domain}/stages/${stage_id}`,
//       {
//         params: {
//           api_token: process.env.api_token,
//         },
//       }
//     );
//   return stage;
//   }
// }

/**
 *
 *
 * @param {*} stage_id: represents current stage in league. currently given.
 * @return {*}
 */
async function get_stage_name_by_id(stage_id) {
  // const stage_id = 77453565; // random stage in season in SuperLiga because league.stage_id is null
  try {
    let stages = await axios.get(
      `${api_domain}/stages/season/${CURRENT_SEASON}`,
      {
        params: {
          api_token: process.env.api_token,
        },
      }
      );
      const stage = stages.data.data.find((stage) => stage.id == random_stage_in_superliga);
      if (!stage || !stage.name) {
        throw '';
      }
      return stage.name;
  } catch {
    throw {
      status: 400,
      message: "Something went wrong when trying to get stage name",
    };
  }
}

/**
 * finds SuperLiga's current stage,season based on external API.
 * retrieves next match from local DB.
 *
 * @return {Object}: league_name, season_name,stage_name,next_match_details
 */
async function getLeagueDetails(league_name) {
  let league_matching_name = await search_utils.search_by_category_and_query('league',league_name);
  league_matching_name = league_matching_name.data.data[0];
  const league_stage = await get_stage_name_by_id(league_matching_name.current_stage_id);
  const next_match = await matches_utils.get_next_match_in_league();
  return {
    league_id: league_matching_name.id,
    league_name: league_name,
    current_season_name: league_matching_name.season.data.name,
    current_stage_name: league_stage,
    next_match_details: next_match,
  };
}
function validate_league_name(league_name){
  if(typeof league_name === 'undefined' || !league_name.match(/^[a-zA-Z]+$/)){ // only letters
    throw {
      status: 400,
      message: 'league name should have letters only'
    } 
  }
}

exports.getLeagueDetails = getLeagueDetails;
exports.get_stage_by_id = get_stage_name_by_id;
exports.validate_league_name = validate_league_name;
exports.info_include_param = info_include_param;
