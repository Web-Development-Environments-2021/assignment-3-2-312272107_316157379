var express = require("express");
var router = express.Router();
const users_utils = require("./utils/users_utils");
const axios = require("axios");
const { search_categories } = require("./utils/search_utils");
const fs = require("fs");
const logStream = fs.createWriteStream("log.txt", { flags: "a" });
const api_domain = "https://soccer.sportmonks.com/api/v2.0";
const { plural } = require("pluralize"); // requires testing

router.get("/:category_name/:name_query", async (req, res, next) => {
  try {
    const category_name = req.params.category_name;
    await users_utils.verify_category(category_name, search_categories);
    const category_name_as_plural = plural(category_name);

    // verification of name_query is in clientside

    // supports either only first name or last name or full name, but has to be a valid.
    // returns object based on category name and name query
    let search_results_ids_for_name = await teams_utils.search_team_by_name(category_name_as_plural,req.params.name_query);
    
    // ids can be with category name or without so unique method is created for each participant
    const extraction_handler_function = users_utils.get_id_extraction_handler(category_name);
    const info_getter_function = users_utils.get_info_handler(category_name);

    search_results_ids_for_name = extraction_handler_function(search_results_ids_for_name.data.data);
    const search_results_information = await info_getter_function(search_results_ids_for_name);

    res.status(200).send(search_results_information);
    logStream.end(`search for ${category_name_as_plural} was successful`);
  } catch (error) {
    logStream.end(error.message); // need to verify message is not null
    next(error);
  }
});

module.exports = router;
