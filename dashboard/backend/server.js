require('dotenv').config();
const express = require('express');
const { google } = require('googleapis');
const axios = require('axios');
const app = express();

app.use(express.json());
app.use((_, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
});

/** 1) Kalender-Endpoint **/
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);
// TODO: OAuth-Flow implementieren...
app.get('/api/calendar', async (req, res) => {
  // Beispiel: Termine der nächsten 7 Tage
  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
  const now = (new Date()).toISOString();
  const week = (new Date(Date.now() + 7*24*60*60*1000)).toISOString();
  const events = await calendar.events.list({
    calendarId: 'primary',
    timeMin: now,
    timeMax: week,
    singleEvents: true,
    orderBy: 'startTime'
  });
  res.json(events.data.items);
});

/** 2) News-Endpoint **/
app.get('/api/news', async (req, res) => {
  const url = `https://newsapi.org/v2/top-headlines?country=de&apiKey=${process.env.NEWS_API_KEY}`;
  const news = await axios.get(url);
  res.json(news.data.articles.slice(0, 5));
});

app.listen(3000, () => console.log('Backend auf Port 3000 läuft'));
