var express = require("express");
var router = express.Router();
const matches_utils = require("./utils/matches_utils");
const fs = require("fs");
const logStream = fs.createWriteStream("log.txt", { flags: "a" });

// returns all matches' info in current stage, past games also include their event logs.
router.get("/:stage_name", async (req, res, next) => {
  try {
    const matches_in_stage_query = `SELECT * from dbo.matches WHERE stage=${req.params.stage_name}`;
    const matches_in_stage = await matches_utils.get_matches_by_query(
      matches_in_stage_query
    );
    res.status(200).send(matches_in_stage);
    logStream.end(
      `matches retrieved successfully when searching for matches by stage id`
    );
  } catch (error) {
    logStream.end(error.message);
    next(error);
  }
});

module.exports = router;
