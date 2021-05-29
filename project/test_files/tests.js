const match_id_to_id = {
    'match_id' : 8
}
const match_id_to_id_2 = {
    'match_id' : 10
}
const stupid_sql_return_value = {
    0: match_id_to_id,
    1: match_id_to_id_2
}

var dataArray = Object.keys(stupid_sql_return_value).map(k => stupid_sql_return_value[k]['match_id']);
dataArray = dataArray.join(',');
console.log(dataArray);