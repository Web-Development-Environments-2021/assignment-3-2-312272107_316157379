const DButils = require("./DButils");
const {plural} = require('pluralize'); // requires testing

const role_to_role_name = {
    SUBSCRIBER: 'subscriber',
    REFEREE: 'referee',
    PLAYER:  'player',
    UNION_REP: 'union_representative',
} ;
const favorite_categories = {
  MATCH: 'match',
  PLAYER: 'player',
  TEAM:  'team'
} ;

// get favorites ids based on category name - query to db and then process input
async function get_favorites_ids(category_name,user_id){
  const favorites_ids = await DButils.execQuery(
    `SELECT ${category_name}_id FROM dbo.favorite_${plural(category_name)}es WHERE user_id=${user_id}`
  ).then((favorites_ids) =>
    Object.keys(favorites_ids).map(
      (k) => favorites_ids[k][`${category_name}_id`]
    )
  );
  return favorites_ids;
}

async function verify_category(category_name,categories){
  if(
    Object.values(categories).find
  ( (possible_category) => possible_category === category_name)
   === 'undefined'){
    throw { status: 400, message: "invalid category name" };
  }
}


 function get_info_handler(category_name){
  const utils = require(`./${plural(category_name)}_utils`);
  return utils.get_info;
 }


 

exports.role_to_role_name = role_to_role_name;
exports.favorite_categories = favorite_categories;
exports.verify_category = verify_category;
exports.get_info_handler = get_info_handler;
exports.get_favorites_ids = get_favorites_ids;


