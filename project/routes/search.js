var express = require("express");
var router = express.Router();
const users_utils = require("./utils/users_utils");
const { search_categories } = require("./utils/search_utils");
const fs = require("fs");
const logStream = fs.createWriteStream("log.txt", { flags: "a" });
const { plural } = require("pluralize"); // requires testing
const search_utils = require('./utils/search_utils');



// league_id in body
router.get("/:category_name/:name_query", async (req, res, next) => {
  try {
    const category_name = req.params.category_name;
    await users_utils.verify_category(category_name, search_categories);
    const category_name_as_plural = plural(category_name);

    // verification of name_query is in clientside

    // supports either only first name or last name or full name, but has to be a valid.
    // returns object based on category name and name query
    let search_results_ids_for_name = await search_utils.search_by_category_and_query(category_name_as_plural,req.params.name_query);
    
    // ids can be with category name or without so unique method is created for each participant
    const extraction_handler_function = users_utils.get_id_extraction_handler(category_name);
    const info_getter_function = users_utils.get_info_handler(category_name);

    search_results_ids_for_name = extraction_handler_function(search_results_ids_for_name.data.data);
    const search_results_information = await info_getter_function(search_results_ids_for_name,req.body.league_id);

    res.status(200).send(search_results_information);
    logStream.end(`search for ${category_name_as_plural} was successful`);
  } catch (error) {
    logStream.end(error.message); 
    next(error);
  }
});

module.exports = router;
