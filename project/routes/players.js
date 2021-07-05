var express = require("express");
var router = express.Router();
const players_utils = require("./utils/players_utils");
const users_utils = require("./utils/users_utils");

// gets player preview information based on player_id from external API
router.get("/:player_id", async (req, res, next) => {
  try {
    let player_info = await players_utils.get_info([req.params.player_id]);

    player_info[0].in_favorites = await players_utils.in_favorites(req.params.player_id,req.session.user_id);

    res.status(200).send(player_info);
  } catch (error) { 
    next({
      status: 404,
      message: "invalid player id",
    });
  }
});

module.exports = router;
