const DButils = require("./DButils");
const info_include_param = "";
const event_types = {
  home_team_goal: "Home-Goal",
  away_team_goal: "Away-Goal",
  match_over: "End-Match",
  offside: "Offside",
  foul: "Foul",
  redcard: "Red-Card",
  yellowcard: "Yellow-Card",
  injury: "Injury",
  sub: "Substitution",
  other: "Other",
};

function filter_by_league(matches, league_id) {
  return matches;
}

async function get_info(matches_ids, category, league_id) {
  const matches_ids_as_string = matches_ids.join();
  const favorites = await DButils.execQuery(
    `SELECT * FROM dbo.matches WHERE match_id IN 
      (${matches_ids_as_string})`
  );
  return favorites;
}
async function get_next_match_in_league() {
  const next_match = await DButils.execQuery(
    // TODO doesn't reference any league or season
    `
    SELECT TOP 1 *
    FROM dbo.matches
    WHERE matches.match_date_time  >  GETDATE() 
    ORDER BY dbo.matches.match_date_time ASC
    `
  );
  return next_match;
}
async function verify_active_match(match_id) {
  try{
    const active_match = await DButils.execQuery(
      `SELECT match_id FROM dbo.matches WHERE is_over=0 AND match_id=${match_id}`
    );
    if (active_match.length == 0) {
      throw
    }
  }catch{
      throw {
        status: 400,
        message:
          "can't add event to match since it was over or does not exist or due to bad input",
      };
  }
}

async function insert_new_event(
  match_id,
  minute_in_game,
  event_type,
  event_description
) {
  let event_type_name = Object.values(event_types).find(
    (valid_event_type) => valid_event_type === event_type
  );
  let away_scores = 0;
  let home_scores = 0;
  let is_over = 0;

  switch (event_type_name) {
    case undefined:
      event_type_name = event_types.other;
      break;
    case event_types.match_over:
      is_over = 1;
      break;
    case event_types.home_team_goal:
      home_scores = 1;
      break;
    case event_types.away_team_goal:
      away_scores = 1;
      break;
    default:
      break;
  }
  try{
    await DButils.execQuery(
      `
          INSERT INTO dbo.matches_event_log(match_id,event_date_time,minute_in_game,event_type,description)
          VALUES (${match_id}, GETDATE(),${minute_in_game},'${event_type_name}','${event_description}');
          `
    );
    await DButils.execQuery(
      `
      UPDATE matches SET
      is_over=${is_over},home_team_goals = home_team_goals+${home_scores} ,away_team_goals = away_team_goals+${away_scores}
          `
    );
  }
  catch{
    throw{
      status:400,
      message: 'Something went wrong when inserting new event to event log '
    }
  }

  return event_type_name;
}

async function check_add_match_depenedecies(
  home_team_name,
  away_team_name,
  date_time
) {
  try{
    const teams_plays_today = await DButils.execQuery(
      `
      DECLARE @date_time_as_date AS DATE
      SET @date_time_as_date = '${date_time}'
  
      SELECT match_id from matches WHERE 
      ((home_team = '${home_team_name}' or away_team= '${home_team_name}') OR (home_team = '${away_team_name}' or away_team= '${away_team_name}')) AND
  
      ( datediff(day, @date_time_as_date, CAST(match_date_time AS DATE) ) == 0)     
        `
    );
    const free_referees = await DButils.execQuery(
      `
      DECLARE @date_time_as_date AS DATE
      SET @date_time_as_date = '${date_time}'
  
      SELECT user_id  FROM user_roles WHERE user_role = '${users_utils.role_to_role_name.REFEREE}' AND user_id NOT IN
      ( 
        SELECT referee_id from matches WHERE
        (
           datediff(day,@date_time_as_date, CAST(match_date_time AS DATE)) !=0
        )
      )
      `
    );
    if (free_referees.length == 0 || teams_plays_today.length != 0) {
      throw
    }
    return free_referees[0].user_id;
  }catch{
    throw {
      status: 400,
      message: "can't add match due to unmatching depenedencies or bad input",
    };
  }
}

async function insert_new_match(date_time,home_team_name,away_team_name,venue_name,referee_id,stage_id) {
  try {
    const match_id = await DButils.execQuery(
      `
        INSERT INTO dbo.matches(match_date_time,home_team,away_team,venue,home_team_goals,away_team_goals,referee_id,is_over,stage)
        OUTPUT INSERTED.match_id
        VALUES (convert(varchar,'${date_time}', 20),'${home_team_name}','${away_team_name}','${venue_name}',0,0,${referee_id},0,${stage_id});
        `
    );
    return match_id;
  } catch (error) {
    throw {
      status: 400,
      message: "Something went wrong when trying to insert new match into DB.",
    };
  }
}

exports.event_types = event_types;
exports.get_favorites_info = get_info;
exports.info_include_param = info_include_param;
exports.verify_active_match = verify_active_match;
exports.insert_new_event = insert_new_event;
exports.insert_new_match = insert_new_match;
exports.check_add_match_depenedecies = check_add_match_depenedecies;
exports.get_next_match_in_league = get_next_match_in_league;
