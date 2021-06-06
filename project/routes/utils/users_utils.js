const DButils = require("./DButils");
const { plural } = require("pluralize"); // requires testing
const axios = require("axios");
const api_domain = "https://soccer.sportmonks.com/api/v2.0";

const role_to_role_name = {
  SUBSCRIBER: "subscriber",
  REFEREE: "referee",
  PLAYER: "player",
  UNION_REP: "union_representative",
};
const favorite_categories = {
  MATCH: "match",
  PLAYER: "player",
  TEAM: "team",
};

// get favorites ids based on category name - query to db and then process input
async function get_favorites_ids(category_name, user_id) {
  const favorites_ids = await DButils.execQuery(
    `SELECT ${category_name}_id FROM dbo.favorite_${plural(
      category_name
    )} WHERE user_id=${user_id}`
  ).then((favorites_ids) =>
    Object.keys(favorites_ids).map(
      (k) => favorites_ids[k][`${category_name}_id`]
    )
  );
  return favorites_ids;
}

async function verify_category(category_name, categories) {
  const category_match = Object.values(categories).find(
    (possible_category) => possible_category === category_name
  );
  if (typeof category_match === "undefined") {
    throw { status: 400, message: "invalid category name" };
  }
}

function get_utils_by_category(category_name) {
  const utils = require(`./${plural(category_name)}_utils`);
  return utils;
}

async function get_object_by_id(ids, category_name) {
  try {
    const utils = get_utils_by_category(category_name);
    let promises = [];
    ids.map((id) =>
      promises.push(
        axios.get(`${api_domain}/${plural(category_name)}/${id}`, {
          params: {
            api_token: process.env.api_token,
            include: utils.info_include_param,
          },
        })
      )
    );
    const objects = await Promise.all(promises);
    return objects;
  } catch {
    throw {
      status: 400,
      message: "Something went wrong when trying to query external API",
    };
  }
}

async function validate_role(user_id, role) {
  const users = await DButils.execQuery(
    `SELECT * FROM dbo.user_roles WHERE user_id='${user_id}' AND user_role = '${role}'`
  );
  if (users.length == 0) {
    throw { status: 400, message: `user doesn't have permission of ${role}` };
  }
}

async function insert_new_favorite(category_name, user_id, favorite_id) {
  try {
    const category_name_as_plural = plural(category_name);
    const favorite = await DButils.execQuery(
      `SELECT * FROM dbo.favorite_${category_name_as_plural} WHERE (user_id='${user_id}') AND (${category_name}_id= '${favorite_id}')`
    );

    if (favorite.length > 0) throw "";

    await DButils.execQuery(
      `INSERT INTO dbo.favorite_${category_name_as_plural} VALUES (${user_id},${favorite_id})`
    );
  } catch {
    throw {
      status: 400,
      message:
        "already in favorites or bad input when trying to insert to favorites",
    };
  }
}

exports.validate_role = validate_role;
exports.role_to_role_name = role_to_role_name;
exports.favorite_categories = favorite_categories;
exports.verify_category = verify_category;
exports.get_utils_by_category = get_utils_by_category;
exports.get_favorites_ids = get_favorites_ids;
exports.get_object_by_id = get_object_by_id;
exports.insert_new_favorite = insert_new_favorite;
