export default async function handler(req, res) {
  const API_KEY = process.env.API_FOOTBALL_KEY;
  const { endpoint, ...params } = req.query;

  if (endpoint === 'debug') {
    return res.status(200).json({
      keyExists: !!API_KEY,
      keyLength: API_KEY ? API_KEY.length : 0,
      keyStartsWith: API_KEY ? API_KEY.slice(0, 4) : null
    });
  }

  const allowed = ['status', 'fixtures', 'standings', 'leagues'];
  if (!endpoint || !allowed.includes(endpoint)) {
    return res.status(400).json({ error: 'Missing or invalid endpoint' });
  }

  const query = new URLSearchParams(params).toString();
  const url = `https://v3.football.api-sports.io/${endpoint}${query ? '?' + query : ''}`;

  try {
    const response = await fetch(url, { headers: { 'x-apisports-key': API_KEY } });
    const data = await response.json();
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to reach the football data provider' });
  }
}
