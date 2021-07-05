const axios = require("axios");
const api_domain = "https://soccer.sportmonks.com/api/v2.0";
const fs = require("fs");
function get_teams_names() {
  axios
    .get(`${api_domain}/teams/season/17328`, {
      params: {
        api_token:
          "8WXQVM67elNbwjkRJUPZ6gR5cFASYoVUekUTkmugcVkKkbBcYHgez4z31pGN",
      },
    })
    .then((teams) => {
      return teams.data.data.map((team) => team.name);
    })
    .then((teams_names) =>
      fs.writeFile("teams_names.txt", teams_names.toString(), (err) => {
        // In case of a error throw err.
        if (err) throw err;
      })
    )
    .catch((err) => console.log(err));
}

get_teams_names();
