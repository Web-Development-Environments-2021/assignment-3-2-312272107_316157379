var express = require("express");
var router = express.Router();
const DButils = require("../routes/utils/DButils");
const bcrypt = require("bcryptjs");
const { role_to_role_name } = require("./utils/users_utils");
let fs = require('fs');
let logStream = fs.createWriteStream('log.txt', {flags: 'a'});

router.post("/register", async (req, res, next) => {
  try {
    let {username,password,first_name,last_name,email,profile_pic} = req.body;

    // parameters exists - username and password required - clientside
    // if (!username || !password)
    //   throw { status: 400, message: "username or password weren't sent" };


    // username exists
    const user_name_exists = await DButils.execQuery(
      `SELECT * FROM dbo.users WHERE username='${req.body.username}'`
    );
      if (user_name_exists === 'undefined') //need to verify what is returned when select doesnt find anything
        throw { status: 409, message: "user could not be added, name taken." };


    //hash the password
    let hash_password = bcrypt.hashSync(
      req.body.password,
      parseInt(process.env.bcrypt_saltRounds)
    );
    req.body.password = hash_password;

    // add the new username
    await DButils.execQuery(
      `INSERT INTO dbo.users (username, password,first_name,last_name,email,profile_pic) 
      VALUES ('${username}', '${hash_password}','${first_name}','${last_name}','${email}','${profile_pic}')`
      
    );
    // add permissions of subscriber to new user.

    await DButils.execQuery(
      `INSERT INTO dbo.user_roles (user_id,role) VALUES
      ((SELECT user_id FROM dbo.users WHERE username='${username}'), '${role_to_role_name.SUBSCRIBER}')`
    );

    const user_creation_message = `user '${username}' succesfully added`;
    res.status(201).send(user_creation_message);
    logStream.end(user_creation_message);
  } catch (error) {
    // logStream.end(error.message); TODO need to return to this later
    next(error);
  }
});




router.post("/login", async (req, res, next) => {
  try {
    const user = (
      await DButils.execQuery(
        `SELECT * FROM dbo.users WHERE username = '${req.body.username}'`
      )
    )[0];   // user = user[0];
    // console.log(user);

    // check that username exists & the password is correct
    if (!user || !bcrypt.compareSync(req.body.password, user.password)) {
      throw { status: 401, message: "Invalid username/password" };
    }

    // Set cookie
    req.session.user_id = user.user_id;
    // return cookie
    user_login_message = `user '${req.body.username}' successful logged in`;
    let user_roles = await (
      DButils.execQuery(
      `SELECT role FROM dbo.user_roles WHERE user_id = ${user.user_id}`
      )
    );
    res.status(200).send(
      {
        message: user_login_message,
        roles: user_roles,
      });

    logStream.end(user_login_message);
  } catch (error) {
    // logStream.end(user_creation_message); return to this later
    next(error);
  }
});

router.post("/logout", function (req, res) {
  req.session.reset(); // reset the session info --> send cookie when  req.session == undefined!!
  res.send({ success: true, message: "logout succeeded" });
  logStream.end("logout succeeded");
});

module.exports = router;