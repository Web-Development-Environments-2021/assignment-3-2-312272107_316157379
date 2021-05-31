const api_domain = "https://soccer.sportmonks.com/api/v2.0";
const search_categories = {
    PLAYER: 'player',
    TEAM:  'team'
  } ;

async function search_by_category_and_query(category_name_as_plural,query){
  const res = await axios
  .get(
    `${api_domain}/${category_name_as_plural}/search/${query}`,
    {
      params: {
        api_token: process.env.api_token,
      },
    }
  )
  return res;
}

exports.search_by_category_and_query = search_by_category_and_query;