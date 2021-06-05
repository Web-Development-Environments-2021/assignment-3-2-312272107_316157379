const axios = require("axios");
const DButils = require("./DButils");
const LEAGUE_ID = 271; // SuperLiga
// const season_id = 17328; // SuperLiga
const api_domain = "https://soccer.sportmonks.com/api/v2.0";
const matches_utils = require("./matches_utils");
const CURRENT_SEASON = 18334;

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


async function get_stage_by_id(stage_id) {
  try{
    let stages = await axios.get(
      `${api_domain}/stages/season/${CURRENT_SEASON}`,
      {
        params: {
          api_token: process.env.api_token,
        },
      }
    );
  const stage_by_id = stages.data.data.find( (stage) => stage.id == stage_id);
  return stage_by_id;
  }
  catch{
    throw{
      status:400,
      message:'Something went wrong when trying to get stage by id'
    }
  }
}


async function getLeagueDetails() {
  const league = await get_league_by_id(LEAGUE_ID);
  // const stage_id = league.stage_id;
  const stage_id = 77453565; // random stage in season in SuperLiga because league.stage_id is null
  const stage = await get_stage_by_id(stage_id)
  let stage_name = null;
  if (stage) {
    stage_name = stage.name;
  }
  const next_match = matches_utils.get_next_match_in_league();
  return {
    league_name: league.name,
    current_season_name: league.season.data.name,
    current_stage_name: stage_name,
    next_match_details: next_match,
  };
}

exports.getLeagueDetails = getLeagueDetails;
exports.get_stage_by_id = get_stage_by_id;
