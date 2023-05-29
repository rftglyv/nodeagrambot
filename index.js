const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Hello World!');
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

const token = '6255755263:AAEVCsFwKBk23UGBn9Udzlmu9XuuaCeFT2s';

const bot = new TelegramBot(token, { polling: true });
bot.onText(/\/eval (.+)/, (msg, match) => {
    // 'msg' is the received Message from Telegram
    // 'match' is the result of executing the regexp above on the text content
    // of the message

    const chatId = msg.chat.id;
    const resp = match[1]; // the captured "whatever"

    // send back the matched "whatever" to the chat
    bot.sendMessage(chatId, eval(resp));
});

bot.onText(/\/start/, (msg) => {
    // 'msg' is the received Message from Telegram
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, `Hello World!`);
});

bot.onText(/\/weather (.+)/, async (msg, match) => {
    const chatId = msg.chat.id,
    userInput = match[1];

  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${userInput}&appid=ea05f0b6617d998492f421c4335d3bba`
    );
    const data = response.data;
    const weather = data.weather[0].description;
    const temperature = data.main.temp - 273.15;
    const city = data.name;
    const humidity = data.main.humidity;
    const pressure = data.main.pressure;
    const windSpeed = data.wind.speed;
    const message = `The weather in ${city} is ${weather} with a temperature of ${temperature.toFixed(2)}°C.\nThe humidity is ${humidity}%, the pressure is ${pressure}hPa, and the wind speed is ${windSpeed}m/s.`;

    bot.sendMessage(chatId, message);
  } catch (error) {
    bot.sendMessage(chatId, "City doesn't exist.");
  }
});

// Listen for any kind of message. There are different kinds of
// messages.
bot.on('message', (msg) => {
});