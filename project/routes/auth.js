var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const bcrypt = require("bcryptjs");
const { role_to_role_name } = require("./utils/users_utils");
const fs = require("fs");
const { deprecate } = require("util");
const { get_roles_by_id } = require("./utils/auth_utils");
const logStream = fs.createWriteStream("log.txt", { flags: "a" });

router.post("/register", async (req, res, next) => {
  try {
    const { username, password, first_name, last_name, email, profile_pic } =
      req.body;

    // username exists
    await heck_free_usermane(username);
    //hash the password
    let hash_password = bcrypt.hashSync(
      req.body.password,
      parseInt(process.env.bcrypt_saltRounds)
    );

    req.body.password = hash_password;

    // add the new username
    let insert_user_output = await insert_new_user(username,hash_password,first_name,last_name,email,profile_pic);

    user_id = insert_user_output[0].user_id;
    // add permissions of subscriber to new user.

    // @deprecate
    // await DButils.execQuery(
    //   `INSERT INTO dbo.user_roles (user_id,user_role) VALUES
    //   (${user_id}, '${role_to_role_name.SUBSCRIBER}')`
    // );

    const user_creation_message = `user '${username}' succesfully added\n`;
    res.status(201).send(user_creation_message);
    logStream.end(user_creation_message);
  } catch (error) {
    logStream.end(error.message);
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const user =await validate_user(req.body.username,password,req.body.password)

    // Set cookie
    req.session.user_id = user.user_id;
    let user_roles = get_roles_by_id(user.user_id) ;

    user_login_message = `user '${req.body.username}' successful logged in`;
    res.status(200).send({
      message: user_login_message,
      roles: user_roles,
    });

    logStream.end(user_login_message);
  } catch (error) {
    logStream.end(error.message);
    next(error);
  }
});

router.post("/logout", function (req, res) {
  req.session.reset(); // reset the session info --> send cookie when  req.session == undefined!!
  res.send({ success: true, message: "logout succeeded" });
  logStream.end("logout succeeded");
});

module.exports = router;
