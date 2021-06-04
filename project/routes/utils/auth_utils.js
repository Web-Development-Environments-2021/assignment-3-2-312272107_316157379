var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const bcrypt = require("bcryptjs");
const { role_to_role_name } = require("./utils/users_utils");
const fs = require("fs");
const { deprecate } = require("util");
const { insert_new_event } = require("./matches_utils");
const logStream = fs.createWriteStream("log.txt", { flags: "a" });
 

async function check_free_usermane(username){
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
}

async function insert_new_user(username,hash_password,first_name,last_name,email,profile_pic){
  await DButils.execQuery(
    `INSERT INTO dbo.users (username, password,first_name,last_name,email,profile_pic,last_search) 
     OUTPUT inserted.user_id 
    VALUES ('${username}', '${hash_password}','${first_name}','${last_name}','${email}','${profile_pic}','')`
  );
}

async function validate_user(username,password){
  let user = await DButils.execQuery(
    `SELECT * FROM users WHERE username = '${username}'`
  ); // user = user[0];
  user=user[0];
  // check that username exists & the password is correct
  if (!user || !bcrypt.compareSync(password, user.password)) {
    throw { status: 401, message: "Invalid username/password" };
  }
  return user;
}
async function get_roles_by_id(user_id){
  const user_roles =  await DButils.execQuery(
    `SELECT user_role FROM dbo.user_roles WHERE user_id = ${user_id}`
  );
  return user_roles;
}

exports.check_free_usermane = check_free_usermane;
exports.insert_new_user=insert_new_user;
exports.validate_user=validate_user;
exports.get_roles_by_id = get_roles_by_id;