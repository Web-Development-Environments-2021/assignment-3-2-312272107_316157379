var express = require("express");
var router = express.Router();
const DButils = require("../routes/utils/DButils");
const bcrypt = require("bcryptjs");
const { role_to_role_name } = require("./utils/users_utils");
var fs = require('fs');

router.post("/register", async (req, res, next) => {
  try {
    let {username,password,first_name,last_name,email,profile_pic} = req.body;

    // parameters exists - username and password required
    if (!username || !password)
      throw { status: 400, message: "username or password weren't sent" };


    // username exists
    const users = await DButils.execQuery(
      "SELECT * FROM dbo.users"
      );
      if (users.find((x) => x.username === username))
        throw { status: 409, message: "user could not be added, name taken." };

    // const user_name_exists = await DButils.execQuery(
    //   `SELECT user_name FROM dbo.users WHERE user_name==${req.body.username}`
    // );
    //   if (user_name_exists === 'undefined') //need to verify what is returned when select doesnt find anything
    //     throw { status: 409, message: "user could not be added, name taken." };


    

    // valid parameters - clientside in our case, so nothing done here


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

    // await DButils.execQuery(
    //   `INSERT INTO user_roles (username,role) VALUES ('${username}', '${role_to_role_name.SUBSCRIBER}')`
    // );

    await DButils.execQuery(
      `INSERT INTO dbo.user_roles (user_id,role) VALUES
      ((SELECT user_id FROM dbo.users WHERE username='${username}'), '${role_to_role_name.SUBSCRIBER}')`
    );


    res.status(201).send(user_creation_message);
    fs.appendFile('log.txt',`user ${username} successfully registered`);
  } catch (error) {
    fs.appendFile('log.txt',error,function (err) {
      console.log('error when trying to write to log file');
      next(error);
    });
    next(error);
};

router.post("/login", async (req, res, next) => {
  try {
    const user = (
      await DButils.execQuery(
        `SELECT * FROM dbo.users WHERE username = '${req.body.username}'`
      )
    )[0];
    // user = user[0];
    console.log(user);

    // check that username exists & the password is correct
    if (!user || !bcrypt.compareSync(req.body.password, user.password)) {
      throw { status: 401, message: "Username or Password incorrect" };
    }

    // Set cookie
    req.session.user_id = user.user_id;

    // return cookie
    res.status(200).send("login succeeded");
  } catch (error) {
    next(error);
  }
});

router.post("/logout", function (req, res) {
  req.session.reset(); // reset the session info --> send cookie when  req.session == undefined!!
  res.send({ success: true, message: "logout succeeded" });
});

module.exports = router;
