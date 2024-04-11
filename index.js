require("dotenv").config();
const crypto = require("crypto");
const axios = require("axios");

const SYMBOL = process.env.SYMBOL;
const BUY_PRICE = process.env.BUY_PRICE;
const SELL_PRICE = process.env.SELL_PRICE;
const API_KEY = process.env.API_KEY;
const SECRET_KEY = process.env.SECRET_KEY;
const QUANTITY = process.env.QUANTITY;
const API_URL_HML = process.env.API_URL_HML;
const ENDPOINT_GET = process.env.ENDPOINT_GET;
const ENDPOINT_POST = process.env.ENDPOINT_POST;

let isOpened = false;

function smaCalculate(data){
	const close = data.map(candle => parseFloat(candle[4]));
	const sum = close.reduce((a,b) => a + b);
	return sum / data.length;
}

async function start() {
	const { data } = await axios.get(
		API_URL_HML + ENDPOINT_GET + SYMBOL
  	);

  	const candle = data[data.length - 1];
  	const price = parseFloat(candle[4]);
	const sma = smaCalculate(data);

  	console.clear();
  	console.log("Price: " + price);
	console.log("SMA: " + sma);
	console.log("Is Opened? " + isOpened)

	// buy
	if (price <= (sma * 0.9) && isOpened === false) {
		isOpened = true;
		newOrder(SYMBOL, QUANTITY, "buy");
	} // sell
	else if (price >= (sma * 1.1) && isOpened === true) {
		newOrder(SYMBOL, QUANTITY, "sell");
		isOpened = false;
	} // await
	else
		console.log("await");
}

async function newOrder(symbol, quantity, side) {
	const order = { symbol, quantity, side };
	order.type = "MARKET";
	order.timestamp = Date.now();

	const signature = crypto
		.createHmac("sha256", SECRET_KEY)
		.update(new URLSearchParams(order).toString())
		.digest("hex");

	order.signature = signature;

	try {
		const { data } = await axios.post(
			API_URL_HML + ENDPOINT_POST,
			new URLSearchParams(order).toString(),
			{ headers: { "X-MBX-APIKEY": API_KEY } }
		);
		
		console.log(data);
	} 
	catch (err) {
		console.log(err.response.data)
	}
}

setInterval(start, 3000);
start();
