const DButils = require("./DButils");
const bcrypt = require("bcryptjs");

/**
 *
 *
 * @param {*} username: username to validate against db
 */
async function validate_username_unique(username) {
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
/**
 *inserts new user to the local DB
 *
 * @param {*} username
 * @param {*} hash_password: password that has been hashed
 * @param {*} first_name
 * @param {*} last_name
 * @param {*} email
 * @param {*} profile_pic: url for user's profile picture
 */
async function insert_new_user(
  username,
  hash_password,
  first_name,
  last_name,
  email,
  country,
  profile_pic
) {
  try {
    await DButils.execQuery(
      `INSERT INTO dbo.users
      VALUES ('${username}','${hash_password}','${first_name}','${last_name}','${email}','${country}','${profile_pic}')`
    );
  } catch {
    throw {
      status: 400,
      message: "Something went wrong when trying to insert new user to system",
    };
  }
}
/**
 * validate username and password from user against the local DB
 * input from user:
 * @param {*} username
 * @param {*} password
 * @return {*}: user's record in DB
 */

async function validate_user(username, password) {
  try {
    let user = await DButils.execQuery(
      `SELECT * FROM users WHERE username = '${username}'`
    ); // user = user[0];
    user = user[0];
    // check that username exists & the password is correct
    if (!user || !bcrypt.compareSync(password, user.password)) {
      throw "";
    }
    return user;
  } catch {
    throw { status: 401, message: "Invalid username/password" };
  }
}

async function get_roles_by_id(user_id) {
  try {
    const user_roles = await DButils.execQuery(
      `SELECT user_role FROM dbo.user_roles WHERE user_id = ${user_id}`
    );
    return user_roles;
  } catch {
    throw {
      status: 404,
      message: "Something went wrong when trying to get roles of user",
    };
  }
}

exports.validate_username_unique = validate_username_unique;
exports.insert_new_user = insert_new_user;
exports.validate_user = validate_user;
exports.get_roles_by_id = get_roles_by_id;
