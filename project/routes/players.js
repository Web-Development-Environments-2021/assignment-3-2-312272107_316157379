var express = require("express");
var router = express.Router();
const players_utils = require("./utils/players_utils");
const fs = require("fs");
const logStream = fs.createWriteStream("log.txt", { flags: "a" });


// gets player preview information based on player_id from external API
router.get("/:player_id", async (req, res, next) => {
  try {
    const player_info = await players_utils.get_info([req.params.player_id]);
    res.status(200).send(player_info);
    logStream.end(
      `player information successfully retrieved when searching for ${req.params.player_id}`
    );
  } catch (error) {
    logStream.end(error.message);
    next({
      status: 404,
      message: "invalid player id",
    });
  }
});

module.exports = router;
