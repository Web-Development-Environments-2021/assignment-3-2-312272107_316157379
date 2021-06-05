var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const users_utils = require("./utils/users_utils");
let fs = require("fs");
let logStream = fs.createWriteStream("log.txt", { flags: "a" });

router.use(async function (req, res, next) {
  try{
    if (req.session && req.session.user_id) {
      await DButils.execQuery("SELECT user_id FROM dbo.users")
        .then((users) => {
          if (users.find((x) => x.user_id === req.session.user_id)) {
            req.user_id = req.session.user_id;
            next();
          }
        })
    } else {
      res.sendStatus(401);
    }
  }
  catch(error){
    next(error);
  }
});

router.post("/favorites/:category_name", async (req, res, next) => {
  try {
    const category_name = req.params.category_name;
    const user_id = req.session.user_id;
    const favorite_id = req.body.favorite_id;
    
    await users_utils.verify_category(category_name,users_utils.favorite_categories);
    await users_utils.insert_new_favorite(category_name,user_id,favorite_id);

    const success_message = `The ${category_name} was successfully saved as a favorite`;
    res.status(201).send(success_message);
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
    const user_id = req.session.user_id;

    await users_utils.verify_category(category_name,users_utils.favorite_categories);

    // get the favorite "category_name" ids from the local db 
    
    const favorites_ids = await users_utils.get_favorites_ids(category_name,user_id);

    // get and use the correct function to get the favorites using the ids extracted based on the category.
    const favorites_utils = await users_utils.get_utils_by_category(category_name);

    const favorites_info = await favorites_utils.get_info(favorites_ids,'favorites');// get info to display based on category

    res.status(200).send(favorites_info);
    logStream.end("successfully returned favorites");
  } catch (error) {
    logStream.end(error.message);
    next(error);
  }
});

module.exports = router;
