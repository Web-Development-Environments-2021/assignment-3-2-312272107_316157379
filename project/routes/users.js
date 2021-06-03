var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const users_utils = require("./utils/users_utils");
let fs = require("fs");
let logStream = fs.createWriteStream("log.txt", { flags: "a" });
const {plural} = require('pluralize'); // requires testing

/**
 * Authenticate all incoming requests by middleware
 */
router.use(async function (req, res, next) {
  if (req.session && req.session.user_id) {
    DButils.execQuery("SELECT user_id FROM dbs.users")
      .then((users) => {
        if (users.find((x) => x.user_id === req.session.user_id)) {
          req.user_id = req.session.user_id;
          next();
        }
      })
      .catch((err) => next(err));
  } else {
    res.sendStatus(401);
  }
  next();
});

router.post("/favorites/:category_name", async (req, res, next) => {
  try {
    const category_name = req.params.category_name;
    await users_utils.verify_category(category_name,users_utils.favorite_categories);

    //testing purposes only
    // const user_id = req.session.user_id;
    const user_id = req.body.user_id;
    const favorite_id = req.body.favorite_id;
    const category_name_as_plural = plural(category_name);

    const favorite = await DButils.execQuery(
      `SELECT * FROM dbo.favorite_${category_name_as_plural} WHERE (user_id='${user_id}') AND (${category_name}_id= '${favorite_id}')`
    );

    if (favorite.length > 0 )
      throw { status: 409, message: "game already in favorites" };


    await DButils.execQuery( 
      `INSERT INTO dbo.favorite_${category_name_as_plural} VALUES (${user_id},${favorite_id})`
    );
    const success_message = `The ${category_name} was successfully saved as a favorite`;
    res.status(201).send(favorite_id);
    logStream.end(success_message);
  } catch (error) {
    logStream.end(error.message);
    next(error);
  }
});

router.get("/favorites/:category_name", async (req, res, next) => {
  try {
    const LEAGUE_ID = 271; // SuperLiga, generally could be receieved as query param

    const category_name = req.params.category_name;
    await users_utils.verify_category(category_name,users_utils.favorite_categories);

    // for testing purposes only
    // const user_id = req.session.user_id;
    const user_id = req.body.user_id;

    // get the favorite "category_name" ids from the local db 
    const favorites_ids = await users_utils.get_favorites_ids(category_name,user_id);

    // get objects from ids
    

    // get and use the correct function to return information based on category, using the ids extracted
    const favorites_utils = await users_utils.get_utils_by_category(category_name);
    const favorites_info = await favorites_utils.get_favorites_info(favorites_ids,category_name,LEAGUE_ID);

    res.status(200).send(favorites_info);
    logStream.end("successfully returned favorites");
  } catch (error) {
    logStream.end(error.message);
    next(error);
  }
});

module.exports = router;
