var express = require("express");
var router = express.Router();
const DButils = require("../routes/utils/DButils");
const api_domain = "https://soccer.sportmonks.com/api/v2.0";
let fs = require('fs');
let logStream = fs.createWriteStream('log.txt', {flags: 'a'});


router.post("/", async (req, res, next) => {
try {
    // verify user has role of union rep

    let {date,hour,home_team_name,away_team_name} = req.body;

    const home_team = await axios.get(`${api_domain}/teams/search/${home_team_name}`, {
        params: {
          api_token: process.env.api_token,
        },
      });
    const away_team = await axios.get(`${api_domain}/teams/search/${away_team_name}`, {
        params: {
          api_token: process.env.api_token,
        },
      });
    
    if (!home_team || !away_team)
        throw { status: 400, message: "match could not be added" };


    // testing 
    console.log(home_team.data.venue_id);

    const venue = await axios.get(`${api_domain}/venues/${home_team.data.venue_id}`, {
        params: {
          api_token: process.env.api_token,
        },
      });
    await DButils.execQuery(
        `
        DECLARE @date date = '2021-05-27';
        DECLARE @time time = '03:30:12';
        INSERT INTO dbo.matches(match_date, hour,home_team,away_team,venue)
        VALUES (@date,@time ,'Avichai United','Tom Divided','Bet Ha-Student');
        `
      );
    
    





    



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

    const user_creation_message = `user '${username}' succesfully added`;
    res.status(201).send(user_creation_message);
    logStream.end(user_creation_message);
  } catch (error) {
    // logStream.end(error.message); TODO need to return to this later
    next(error);
  }
});