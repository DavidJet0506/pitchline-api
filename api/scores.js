export default async function handler(req, res) {
  const API_KEY = process.env.API_FOOTBALL_KEY;
  const { endpoint, ...params } = req.query;

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
