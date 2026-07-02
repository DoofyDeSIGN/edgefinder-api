const fetch = require('node-fetch');

const ODDS_KEY = process.env.ODDS_KEY || 'df1452c70e29f7574614ec97260cea27';

const PROP_MARKETS = {
  'baseball_mlb': 'batter_hits,batter_home_runs,batter_rbis,pitcher_strikeouts',
  'basketball_nba': 'player_points,player_rebounds,player_assists,player_threes',
  'icehockey_nhl': 'player_points,player_goals,player_shots_on_goal',
  'americanfootball_nfl': 'player_pass_yds,player_rush_yds,player_reception_yds,player_receptions',
  'soccer_epl': 'player_goal_scorer_anytime,player_shots_on_target',
  'soccer_fifa_world_cup': 'player_goal_scorer_anytime,player_shots_on_target'
};

module.exports = async (req, res) => {
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }
  const { sport, eventId } = req.query;
  if (!sport) { res.status(400).json({ error: 'sport required' }); return; }

  try {
    const markets = PROP_MARKETS[sport] || 'player_points';

    if (eventId) {
      // Fetch props for a specific event
      const url = `https://api.the-odds-api.com/v4/sports/${sport}/events/${eventId}/odds?apiKey=${ODDS_KEY}&regions=us&markets=${markets}&oddsFormat=american`;
      const response = await fetch(url);
      const data = await response.json();
      res.json(data);
    } else {
      // First get the list of events
      const eventsUrl = `https://api.the-odds-api.com/v4/sports/${sport}/events?apiKey=${ODDS_KEY}`;
      const eventsRes = await fetch(eventsUrl);
      const events = await eventsRes.json();
      res.json(Array.isArray(events) ? events : []);
    }
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
};
