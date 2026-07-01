# EdgeFinder API

Backend server for EdgeFinder betting tool. Deployed on Vercel.

## Endpoints

- `GET /api/odds?sport=baseball_mlb` — Live odds from The Odds API
- `GET /api/scores?sport=baseball_mlb` — Live scores
- `GET /api/injuries?sport=mlb` — Injury reports from ClearSports
- `GET /api/props?sport=baseball_mlb&eventId=xxx&markets=pitcher_strikeouts` — Player props from PropLine
- `GET /api/betting?sport=baseball_mlb` — Public betting % from ActionNetwork

## Deploy

1. Push to GitHub
2. Import to Vercel
3. Deploy
