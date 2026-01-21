const url = 'https://games-news-api.p.rapidapi.com/news/%7BgameName%7D';
const options = {
	method: 'GET',
	headers: {
		'x-rapidapi-key': '2425c1e765msh926f80408dce236p158dc9jsnc51d76e6c4e9',
		'x-rapidapi-host': 'games-news-api.p.rapidapi.com'
	}
};

try {
	const response = await fetch(url, options);
	const result = await response.text();
	console.log(result);
} catch (error) {
	console.error(error);
}