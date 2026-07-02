const fetch = require('node-fetch');
const ODDS_KEY = '88d0cf7db995b9525317e3d0b34449e9';
const BOOKS = ['draftkings','fanduel','betmgm','caesars','pointsbet','williamhill_us','barstool','bovada'];
const MARKETS = ['h2h','spreads','totals'];

module.exports = async (req, res) => {
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }
  const { sport, regions } = req.query;
  if (!sport) { res.status(400).json({ error: 'sport required' }); return; }
  try {
    const r = regions || 'us';
    const url = `https://api.the-odds-api.com/v4/sports/${sport}/odds/?apiKey=${ODDS_KEY}&regions=${r}&markets=${MARKETS.join(',')}&oddsFormat=american&bookmakers=${BOOKS.join(',')}`;
    const response = await fetch(url);
    const data = await response.json();
    res.setHeader('x-requests-remaining', response.headers.get('x-requests-remaining') || '');
    res.setHeader('x-requests-used', response.headers.get('x-requests-used') || '');
    res.json(data);
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
};
