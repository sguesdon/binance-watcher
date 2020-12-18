"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Triggers = exports.Watcher = exports.BINANCE_WEBSOCKET_BASEURL = void 0;
const ws_1 = __importDefault(require("ws"));
const binance_api_node_1 = __importDefault(require("binance-api-node"));
exports.BINANCE_WEBSOCKET_BASEURL = 'wss://stream.binance.com:9443/ws';
;
class Watcher {
    constructor(symbol) {
        this.trades = new Array(Watcher.tradesHistoryLen).fill(undefined);
        this.symbol = symbol;
        this.client = binance_api_node_1.default(Watcher.config);
        this.triggers = new Triggers(this);
    }
    async start() {
        this.ws = new ws_1.default(`${exports.BINANCE_WEBSOCKET_BASEURL}/${this.symbol.toLowerCase()}@trade`);
        this.ws.on('message', (str) => {
            this.addTrade(str);
            this.triggers.check(this.trades);
        });
    }
    addTrade(rawData) {
        const data = JSON.parse(rawData);
        this.trades.unshift({ time: data.t, price: parseFloat(data.p) });
        while (this.trades.length > Watcher.tradesHistoryLen) {
            this.trades.pop();
        }
    }
}
exports.Watcher = Watcher;
Watcher.tradesHistoryLen = 25;
class Triggers {
    constructor(watcher) {
        this.watcher = watcher;
        this.triggers = [];
    }
    async check(trades) {
        for (const trigger of this.triggers) {
            await trigger.check.apply(trigger, [trades, this]);
        }
    }
    add(trigger) {
        this.triggers.unshift(trigger);
    }
    remove(trigger) {
        this.triggers.splice(this.triggers.indexOf(trigger), 1);
    }
}
exports.Triggers = Triggers;
//# sourceMappingURL=binance.js.map