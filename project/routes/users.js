var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const users_utils = require("./utils/users_utils");
let fs = require("fs");
let logStream = fs.createWriteStream("log.txt", { flags: "a" });

/**
 * Authenticate all incoming requests by middleware
 */
router.use(async function (req, res, next) {
  next();
  // if (req.session && req.session.user_id) {
  //   DButils.execQuery("SELECT user_id FROM dbs.users")
  //     .then((users) => {
  //       if (users.find((x) => x.user_id === req.session.user_id)) {
  //         req.user_id = req.session.user_id;
  //         next();
  //       }
  //     })
  //     .catch((err) => next(err));
  // } else {
  //   res.sendStatus(401);
  // }
});

router.post("/favorites/:category_name", async (req, res, next) => {
  try {
    const category_name = req.params.category_name;
    await users_utils.verify_favorites_category(category_name,users_utils.favorite_categories);

    //testing purposes only
    // const user_id = req.session.user_id;
    const user_id = req.body.user_id;

    const favorite_id = req.body.favorite_id;
    await DButils.execQuery(
      `INSERT INTO dbo.favorite_${category_name}es VALUES (${user_id},${favorite_id})`
    );
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
    const category_name = req.params.category_name;
    await users_utils.verify_category(category_name,users_utils.favorite_categories);

    // for testing purposes only
    // const user_id = req.session.user_id;
    const user_id = req.body.user_id;

    const favorites_ids = await users_utils.get_favorites_ids(category_name,user_id);

    // get and use the correct function to return information based on category, using the ids extracted
    const favorites_handler_function =
      await users_utils.get_info_handler(category_name);
    const favorites = await favorites_handler_function(favorites_ids);

    res.status(200).send(favorites);
    logStream.end("successfully returned favorites");
  } catch (error) {
    logStream.end(error.message);
    next(error);
  }
});

module.exports = router;
