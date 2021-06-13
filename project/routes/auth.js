var express = require("express");
var router = express.Router();
const bcrypt = require("bcryptjs");
const fs = require("fs");
const auth_utils = require("./utils/auth_utils");
const logStream = fs.createWriteStream("log.txt", { flags: "a" });

router.post("/register", async (req, res, next) => {
  try {
    const { username, first_name, last_name, email,country } = req.body;

    await auth_utils.validate_username_unique(username);

    const hash_password = bcrypt.hashSync(
      req.body.password,
      parseInt(process.env.bcrypt_saltRounds)
    );
    req.body.password = hash_password;

    const insert_user_output = await auth_utils.insert_new_user(
      username,
      hash_password,
      first_name,
      last_name,
      email,
      country
    );

    // const user_id = insert_user_output[0].user_id;

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
    // search and return user based on username and password
    const user = await auth_utils.validate_user(
      req.body.username,
      req.body.password
    );

    // find user's roles, if there are any
    req.session.user_id = user.user_id;
    const user_roles = await auth_utils.get_roles_by_id(user.user_id);

    const user_login_message = `user '${req.body.username}' successfully logged in`;
    res.status(200).send({
      roles: user_roles,
    });

    logStream.end(user_login_message);
  } catch (error) {
    logStream.end(error.message);
    next(error);
  }
});

router.get("/logout", function (req, res) {
  const user_id = req.session.user_id;
  req.session.reset(); // reset the session info --> send cookie when  req.session == undefined!!
  const success_message = "user succesfully logged out";
  res.status(200).send(success_message);
  logStream.end(`user ${user_id} succesfully logged out`);
});

module.exports = router;
