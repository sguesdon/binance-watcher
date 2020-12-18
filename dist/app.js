"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const binance_1 = require("./binance");
// import { Watcher, BinanceConfigInterface } from './binance';
// const configuration : BinanceConfigInterface = {
//   apiKey: process.env.BIN_APIKEY,
//   apiSecret: process.env.BIN_APISECRET,
//   symbols: ['BTCUSDT']
// };
//
// const watcher = new Watcher(configuration);
//
// const test = async () => {
//   await watcher.test();
// };
//
// test();
binance_1.Watcher.config = {
    apiKey: process.env.BIN_APIKEY,
    apiSecret: process.env.BIN_APISECRET
};
const watcher = new binance_1.Watcher('BTCUSDT');
watcher.triggers.add({
    targetPrice: 23033,
    check: function ([first, second, ...history], triggers) {
        console.log('checkTrigger');
        if (first.price > this.targetPrice) {
            console.log('ahhhhhhhhhhhhhhhhhhhhhh');
            triggers.remove(this);
        }
    }
});
watcher.start();
//# sourceMappingURL=app.js.map