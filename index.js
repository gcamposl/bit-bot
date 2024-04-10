const axios = require("axios");

const SYMBOL = "BTCUSDT";
const BUY_PRICE = 68500;
const SELL_PRICE = 69300;
let isOpened = false;

const API_URL_HML = "https://testnet.binance.vision";
//https://api.binance.com

async function start() {
  const { data } = await axios.get(
    API_URL_HML + "/api/v3/klines?limit=21&interval=15m&symbol=" + SYMBOL
  );
  const candle = data[data.length - 1];
  const price = parseFloat(candle[4]);
  console.clear();
  console.log("Price: " + price);

  if (price <= BUY_PRICE && isOpened === false) {
    console.log("buy");
    isOpened = true;
  } else if (price >= SELL_PRICE && isOpened === true) {
    console.log("sell");
    isOpened = false;
  }
  else
    console.log("await");
}

setInterval(start, 3000);

start();
