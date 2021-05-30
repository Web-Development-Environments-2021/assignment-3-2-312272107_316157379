var express = require("express");
var router = express.Router();
const users_utils = require("./utils/users_utils");
const DButils = require("./utils/DButils");
const { search_categories } = require("./utils/search_utils");
const fs = require('fs');
const logStream = fs.createWriteStream('log.txt', {flags: 'a'});
const api_domain = 'https://soccer.sportmonks.com/api/v2.0';
const {plural} = require('pluralize'); // requires testing

router.get("/:category_name/:name_query", async (req, res, next) => {
  try {
    const category_name = req.params.category_name;
    await users_utils.verify_category(category_name,search_categories);
    const category_name_as_plural = plural(category_name);

    // verification of name_query is in clientside
    
    // supports either only first name or last name or full name, but has to be a valid. 
    const search_results_ids_for_name = await axios.get(
        `${api_domain}/${category_name_as_plural}/search/${req.params.name_query}`,
        {
          params: {
            api_token: process.env.api_token,
          },
        }
      ).then(map(search_result => search_result.id));
    const info_getter_function = users_utils.get_info_handler(category_name);
    search_results_information = info_getter_function(search_results_ids_for_name);
    
    res.send(search_results_information);
    logStream.end(`search for ${category_name_as_plural} was successful`);
  } catch (error) {
    logStream.end(error.message); // need to verify message is not null
    next(error);
  }
}); 



module.exports = router;
