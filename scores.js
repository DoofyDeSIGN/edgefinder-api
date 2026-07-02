const fetch = require('node-fetch');
const PROPLINE_KEY = '8554d857fc2b136c18a1239835727fa0';

module.exports = async (req, res) => {
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }
  const { sport, eventId, markets } = req.query;
  if (!sport) { res.status(400).json({ error: 'sport required' }); return; }
  try {
    const url = eventId
      ? `https://api.prop-line.com/v1/sports/${sport}/events/${eventId}/odds?markets=${markets||'player_points'}&apiKey=${PROPLINE_KEY}`
      : `https://api.prop-line.com/v1/sports/${sport}/events?apiKey=${PROPLINE_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
};
