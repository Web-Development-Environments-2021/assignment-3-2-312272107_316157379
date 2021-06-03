var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const bcrypt = require("bcryptjs");
const { role_to_role_name } = require("./utils/users_utils");
const fs = require("fs");
const { deprecate } = require("util");
const logStream = fs.createWriteStream("log.txt", { flags: "a" });

router.post("/register", async (req, res, next) => {
  try {
    const { username, password, first_name, last_name, email, profile_pic } =
      req.body;

    // username exists
      await DButils.execQuery(
      `SELECT * FROM dbo.users WHERE username='${username}'`
    ).then((q_user_name) => {
      if (q_user_name.length > 0) {
        throw {
          status: 409,
          message: "user could not be added, name taken.\n",
        };
      }
    });

    //hash the password
    let hash_password = bcrypt.hashSync(
      req.body.password,
      parseInt(process.env.bcrypt_saltRounds)
    );
    req.body.password = hash_password;

    // add the new username
    const user_id = await DButils.execQuery(
      `INSERT INTO dbo.users (username, password,first_name,last_name,email,profile_pic,last_search) 
       OUTPUT inserted.user_id 
      VALUES ('${username}', '${hash_password}','${first_name}','${last_name}','${email}','${profile_pic}','')`
    ).then(user_id_as_obj => user_id_as_obj[0].user_id);
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
    let user = await DButils.execQuery(
      `SELECT * FROM users WHERE username = '${req.body.username}'`
    ); // user = user[0];
    user=user[0];
    // check that username exists & the password is correct
    if (!user || !bcrypt.compareSync(req.body.password, user.password)) {
      throw { status: 401, message: "Invalid username/password" };
    }

    // Set cookie
    req.session.user_id = user.user_id;
    let user_roles = await DButils.execQuery(
      `SELECT user_role FROM dbo.user_roles WHERE user_id = ${user.user_id}`
    );

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
