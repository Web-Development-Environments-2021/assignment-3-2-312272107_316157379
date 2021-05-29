var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const users_utils = require("./utils/users_utils");
const players_utils = require("./utils/players_utils");
let fs = require('fs');
let logStream = fs.createWriteStream('log.txt', {flags: 'a'});

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

/**
 * This path gets body with playerId and save this player in the favorites list of the logged-in user
 */

router.post("/favorites/:category_name", async (req, res, next) => {
  try {
    const category_name = req.params.category_name;
    await users_utils.verify_category(category_name);
    const user_id = req.session.user_id;
    // const user_id = req.body.user_id;
    const favorite_id = req.body.favorite_id;
    await DButils.execQuery(`INSERT INTO dbo.favorite_${category_name}es VALUES (${user_id},${favorite_id})`);
    const success_message = `The ${category_name} was successfully saved as a favorite`; 
    res.status(201).send(success_message);
    logStream.end(success_message);
  } catch (error) {
    next(error);
  }
});



// router.post("/favorites/players", async (req, res, next) => {
//   try {
//     const user_id = req.session.user_id;
//     const playerid = req.body.player_id;
//     await users_utils.markPlayerAsFavorite(user_id, player_id);
//     res.status(201).send("The player successfully saved as favorite");
//   } catch (error) {
//     next(error);
//   }
// });

/**
 * This path returns the favorites players that were saved by the logged-in user
 */
router.get("/favorites/:category_name", async (req, res, next) => {
  try {
    category_name = req.params.category_name;
    await users_utils.verify_category(category_name);
    // const user_id = req.session.user_id;
    const user_id = req.body.user_id;
    let favorites_ids = await DButils.execQuery(
      `SELECT ${category_name}_id FROM dbo.favorite_${category_name}es WHERE user_id=${user_id}`
    );
    favorites_ids = Object.keys(favorites_ids).map(k => favorites_ids[k]['match_id']);
    let favorites;
    if (category_name == users_utils.favorite_categories.PLAYER){
       favorites = await players_utils.getPlayersInfo(favorites_ids);  
    }
    else if(category_name == users_utils.favorite_categories.MATCH){
      favorites_ids = favorites_ids.join();
      favorites = await DButils.execQuery(
        `SELECT match_date,hour,home_team,away_team,venue FROM dbo.matches WHERE match_id IN 
        (${favorites_ids})`
      );
    }
    else{ // team
      // return some team details for favorites - custom choice
    } 
    res.status(200).send(favorites);
  } catch (error) {
    next(error);
  }
});






module.exports = router;
