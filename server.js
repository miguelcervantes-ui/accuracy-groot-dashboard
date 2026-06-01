require('dotenv').config();
const express = require('express');
const { google } = require('googleapis');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const SPREADSHEET_ID = process.env.SPREADSHEET_ID || '1-CLaIvryfo2cw9mPuqwJ1A_i2dBSBRfSt_b7FRYWITM';
const SHEET_NAME = process.env.SHEET_NAME || 'Datos';

async function getAuthClient() {
  if (process.env.GOOGLE_SERVICE_ACCOUNT_KEY) {
    const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);
    return new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });
  }
  return new google.auth.GoogleAuth({
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  });
}

app.get('/api/data', async (req, res) => {
  try {
    const auth = await getAuthClient();
    const sheets = google.sheets({ version: 'v4', auth });
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: SHEET_NAME,
    });
    const rows = response.data.values || [];
    const headers = rows.length > 0 ? rows.shift() : [];
    res.json({ headers, values: rows });
  } catch (error) {
    console.error('Error fetching sheet data:', error.message);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/userinfo', (req, res) => {
  const email = process.env.USER_EMAIL || '';
  if (!email) return res.json({ name: 'USUARIO', initials: 'U' });
  const rawName = email.split('@')[0].replace(/\./g, ' ');
  const formattedName = rawName
    .split(' ')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
  const parts = formattedName.split(' ');
  const initials = parts.length > 1 ? parts[0][0] + parts[parts.length - 1][0] : parts[0][0];
  res.json({ name: formattedName, initials: initials.toUpperCase() });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Dashboard corriendo en http://localhost:${PORT}`));
