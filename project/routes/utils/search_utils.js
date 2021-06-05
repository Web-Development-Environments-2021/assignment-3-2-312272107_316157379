const api_domain = "https://soccer.sportmonks.com/api/v2.0";
const search_categories = {
  PLAYER: "player",
  TEAM: "team",
};
const { plural } = require("pluralize");
const users_utils = require("./users_utils");
const axios = require("axios");

async function search_by_category_and_query(category_name, name_query) {
  try{
    const utils = users_utils.get_utils_by_category(category_name);
    const search_results = await axios.get(
      `${api_domain}/${plural(category_name)}/search/${name_query}`,
      {
        params: {
          api_token: process.env.api_token,
          include: utils.info_include_param,
        },
      }
    );
    return search_results;
  }
  catch{
    throw{
      status:400,
      message: 'Something went wrong when trying to search in external API'
    }
  }

}

exports.search_by_category_and_query = search_by_category_and_query;
exports.search_categories = search_categories;
