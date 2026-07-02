const fetch = require('node-fetch');

const SPORT_MAP = {
  'americanfootball_nfl':'nfl','americanfootball_ncaaf':'ncaaf',
  'basketball_nba':'nba','basketball_ncaab':'ncaab',
  'baseball_mlb':'mlb','icehockey_nhl':'nhl',
  'soccer_epl':'soccer','soccer_uefa_champs_league':'soccer','soccer_fifa_world_cup':'soccer'
};

module.exports = async (req, res) => {
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }
  const { sport } = req.query;
  const anSport = SPORT_MAP[sport];
  if (!anSport) { res.json({}); return; }
  try {
    const today = new Date().toISOString().split('T')[0];
    const url = `https://api.actionnetwork.com/web/v1/games?sport=${anSport}&date=${today}&limit=100`;
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json',
        'Referer': 'https://www.actionnetwork.com/',
        'Origin': 'https://www.actionnetwork.com'
      }
    });
    if (!response.ok) { res.json({ error: response.status, games: [] }); return; }
    const data = await response.json();
    const games = data.games || data || [];
    const result = {};
    games.forEach(game => {
      const away = game.away_team?.full_name || game.teams?.away?.full_name;
      const home = game.home_team?.full_name || game.teams?.home?.full_name;
      if (!away || !home) return;
      const key = `${away}_${home}`;
      result[key] = { away, home, markets: {} };
      ['moneyline','spread','total'].forEach(mktKey => {
        const mkt = game[mktKey] || game.markets?.[mktKey];
        if (!mkt) return;
        const ourKey = mktKey==='moneyline'?'h2h':mktKey==='spread'?'spreads':'totals';
        result[key].markets[ourKey] = {
          away: { bets_pct: mkt.away_bets_pct||null, money_pct: mkt.away_money_pct||null },
          home: { bets_pct: mkt.home_bets_pct||null, money_pct: mkt.home_money_pct||null },
          over:  { bets_pct: mkt.over_bets_pct||null,  money_pct: mkt.over_money_pct||null },
          under: { bets_pct: mkt.under_bets_pct||null, money_pct: mkt.under_money_pct||null }
        };
      });
    });
    res.json(result);
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
};
