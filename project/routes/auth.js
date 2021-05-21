var express = require("express");
var router = express.Router();
const DButils = require("../routes/utils/DButils");
const bcrypt = require("bcryptjs");

router.post("/register", async (req, res, next) => {
  try {
    const {username,password,firstname,lastname,email,profile_pic} = req.body

    // parameters exists - username and password required
    if (!username || !password)
      throw { status: 400, message: "username or password weren't sent" };


    // username exists
    const users = await DButils.execQuery(
      "SELECT * FROM dbo.users"
      // `SELECT user_name FROM dbo.users WHERE user_name==${req.body.username}`
    );

    if (users.find((x) => x.username === username))
      throw { status: 409, message: "Username taken" };

    

    // valid parameters - clientside in our case, so nothing done here


    //hash the password
    let hash_password = bcrypt.hashSync(
      password,
      parseInt(process.env.bcrypt_saltRounds)
    );
    password = hash_password;

    // add the new username
    await DButils.execQuery(
      `INSERT INTO dbo.users (username, password,first_name,last_name,email,profile_pic) 
      VALUES ('${username}', '${password}','${firstname}','${lastname}','${email}','${profile_pic}')`
    );
    res.status(201).send("user created");
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const user = (
      await DButils.execQuery(
        `SELECT * FROM dbo.users_tirgul WHERE username = '${req.body.username}'`
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

router.post("/Logout", function (req, res) {
  req.session.reset(); // reset the session info --> send cookie when  req.session == undefined!!
  res.send({ success: true, message: "logout succeeded" });
});

module.exports = router;
