const axios = require("axios");
const LEAGUE_ID = 271; // SuperLiga
const api_domain = "https://soccer.sportmonks.com/api/v2.0";

async function get_team_in_league(team_name,league_id=LEAGUE_ID) {
    let teams_matching_name = await axios.get(`${api_domain}/teams/search/${team_name}`, {
        params: {
          api_token: process.env.api_token,
        },
      });
    teams_matching_name = teams_matching_name.data.data;
    let i = 0;
    let team;
    while(i < teams_matching_name.length){
        let team_leagues = await axios.get(`${api_domain}/teams/${teams_matching_name[i].id}/current`, {
          params: {
            api_token: process.env.api_token,
          },
        });
        team_leagues = team_leagues.data.data; 
        team = team_leagues.find((team_league) => team_league.league_id === LEAGUE_ID); 
        if(typeof team !== 'undefined'){
            return teams_matching_name[i];
        } 
        i++;
    }
}

const event_types = {
  goal: 'Goal',
  offside: 'Offside',
  foul:  'Foul',
  redcard: 'Red-Card',
  yellowcard: 'Yellow-Card',
  injury: 'Injury',
  sub: 'Substitution',
  other: 'Other',
} ;


exports.get_team_in_league = get_team_in_league;
exports.event_types = event_types;