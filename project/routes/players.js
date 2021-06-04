var express = require("express");
var router = express.Router();
const users_utils = require("./utils/users_utils");
const players_utils = require("./utils/players_utils");
const LEAGUE_ID = 271;

router.get("/:player_id", async (req, res, next) => {
    try {
        const player_id = req.params.player_id;
        let player = users_utils.get_object_by_id([player_id]);
        player = players_utils.filter_by_league(player,LEAGUE_ID);
        const player_info = players_utils.get_info(player);
        res.status(200).send(player_info);
        logStream.end(`player information successfully retrieved when searching for ${player_id}`);
    } catch (error) {
      logStream.end(error.message);
      next({
        status:404,
        message:'invalid player id'
      });
    }
  });

module.exports = router;