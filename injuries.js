const fetch = require('node-fetch');
const CLEAR_KEY = 'sk_live_Bsj-nITf7h_brX-IKkw_9Vk0f9tjtsoDMtul211zzq8';

module.exports = async (req, res) => {
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }
  const { sport } = req.query;
  if (!sport) { res.status(400).json({ error: 'sport required' }); return; }
  try {
    const url = `https://api.clearsportsapi.com/v1/${sport}/injuries`;
    const response = await fetch(url, {
      headers: { 'Authorization': `Bearer ${CLEAR_KEY}` }
    });
    const data = await response.json();
    res.json(data);
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
};
