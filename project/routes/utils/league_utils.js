const axios = require("axios");
const DButils = require("./DButils");
const LEAGUE_ID = 271; // SuperLiga
// const season_id = 17328; // SuperLiga

async function getLeagueDetails() {
  const league = await axios.get(
    `https://soccer.sportmonks.com/api/v2.0/leagues/${LEAGUE_ID}`,
    {
      params: {
        include: "season",
        api_token: process.env.api_token,
      },
    }
  );
  const stage = await axios.get(
    `https://soccer.sportmonks.com/api/v2.0/stages/${league.data.data.current_stage_id}`,
    {
      params: {
        api_token: process.env.api_token,
      },
    }
  );
  const next_match = await DButils.execQuery // TODO doesn't reference any league or season
  (
    `
    SELECT TOP 1 *
    FROM dbo.matches
    WHERE dbo.matches.match_date > (SELECT CAST( GETDATE() AS Date ))
    ORDER BY dbo.matches.match_date ASC
    `
  )

  


  return {
    league_name: league.data.data.name,
    current_season_name: league.data.data.season.data.name,
    current_stage_name: stage.data.data.name,
    next_match_details: next_match
  };
}
exports.getLeagueDetails = getLeagueDetails;
