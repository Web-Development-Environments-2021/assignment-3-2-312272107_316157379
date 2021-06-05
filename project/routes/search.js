var express = require("express");
var router = express.Router();
const users_utils = require("./utils/users_utils");
const { search_categories } = require("./utils/search_utils");
const fs = require("fs");
const logStream = fs.createWriteStream("log.txt", { flags: "a" });

const search_utils = require('./utils/search_utils');
const LEAGUE_ID = 271; // SUPERLIGA

router.get("/:category_name/:name_query", async (req, res, next) => {
  try {
    const category_name = req.params.category_name;
    await users_utils.verify_category(category_name, search_categories);

    // verification of name_query is in clientside

    // supports either only first name or last name or full name, but has to be a valid.
    // returns object based on category name and name query
    let search_results = await search_utils.search_by_category_and_query(category_name,req.params.name_query);
    
    const utils_by_category = users_utils.get_utils_by_category(category_name);

    const search_results_info = await utils_by_category.get_info(search_results,'search');

    res.status(200).send(search_results_info);
    logStream.end(`search for ${req.params.name_query} was successful`);
  } catch (error) {
    logStream.end(error.message); 
    next(error);
  }
});

module.exports = router;
