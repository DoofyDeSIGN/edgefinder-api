const fetch = require('node-fetch');
const ODDS_KEY = '88d0cf7db995b9525317e3d0b34449e9';

module.exports = async (req, res) => {
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }
  const { sport } = req.query;
  if (!sport) { res.status(400).json({ error: 'sport required' }); return; }
  try {
    const url = `https://api.the-odds-api.com/v4/sports/${sport}/scores/?apiKey=${ODDS_KEY}&daysFrom=1`;
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
};
