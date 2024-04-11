const axios = require("axios");

const SYMBOL = "BTCUSDT";
const BUY_PRICE = 70300;
const SELL_PRICE = 70500;
let isOpened = false;

const API_URL_HML = "https://testnet.binance.vision";
//https://api.binance.com

function smaCalculate(data){
	const close = data.map(candle => parseFloat(candle[4]));
	const sum = close.reduce((a,b) => a + b);
	return sum / data.length;
}

async function start() {
	const { data } = await axios.get(
		API_URL_HML + "/api/v3/klines?limit=21&interval=15m&symbol=" + SYMBOL
  	);
  	const candle = data[data.length - 1];
  	const price = parseFloat(candle[4]);
  	console.clear();
  	console.log("Price: " + price);

	const sma21 = smaCalculate(data);
	const sma13 = smaCalculate(data.slice(8));
	console.log("SMA (13): " + sma13);
	console.log("SMA (21): " + sma21);
	console.log("Is Opened? " + isOpened)

	if (sma13 > sma21 && isOpened === false) {
		console.log("buy");
		isOpened = true;
	} else if (sma21 < sma13 && isOpened === true) {
		console.log("sell");
		isOpened = false;
	} else
		console.log("await");
}

setInterval(start, 3000);

start();
