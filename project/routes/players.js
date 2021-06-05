var express = require("express");
var router = express.Router();
const users_utils = require("./utils/users_utils");
const players_utils = require("./utils/players_utils");
const LEAGUE_ID = 271;

router.get("/:player_id", async (req, res, next) => {
    try {
        const player_info = players_utils.get_info(req.params.player_id,'get_player_by_id');
        res.status(200).send(player_info);
        logStream.end(`player information successfully retrieved when searching for ${player_id}`);
    } catch (error) {
      logStream.end(error.message);
      next(error);
    }
  });

module.exports = router;