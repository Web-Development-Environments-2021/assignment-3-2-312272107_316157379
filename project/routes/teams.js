var express = require("express");
var router = express.Router();
const players_utils = require("./utils/players_utils");


router.get("/teamFullDetails/:teamId", async (req, res, next) => {
  try {
    const team_details = await players_utils.getPlayersByTeam(
      req.params.teamId
    );
    //we should keep implementing team page.....
    res.send(team_details);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
