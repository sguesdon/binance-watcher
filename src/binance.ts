import WebSocket from 'ws';
import Binance from 'binance-api-node';

export const BINANCE_WEBSOCKET_BASEURL='wss://stream.binance.com:9443/ws';

export interface Config {
  apiKey: string,
  apiSecret: string
};

export interface Trigger {
  check: Function
}

export interface Trade {
    price: number,
    time: number
}

export class Watcher {

  private client: any;
  private ws: WebSocket;
  private symbol: string;
  readonly triggers: Triggers;

  static config: Config;
  static tradesHistoryLen: number = 25;
  private trades: Trade[] = new Array(Watcher.tradesHistoryLen).fill(undefined);

  constructor(symbol : string) {
    this.symbol = symbol;
    this.client = Binance(Watcher.config);
    this.triggers = new Triggers(this);
  }

  async start() {
    this.ws = new WebSocket(`${BINANCE_WEBSOCKET_BASEURL}/${this.symbol.toLowerCase()}@trade`);
    this.ws.on('message', (str) => {
      this.addTrade(str);
      this.triggers.check(this.trades);
    });
  }

  private addTrade(rawData: string) {
    const data = JSON.parse(rawData);
    this.trades.unshift(<Trade>{ time: data.t, price: parseFloat(data.p)});
    while(this.trades.length > Watcher.tradesHistoryLen) {
      this.trades.pop();
    }
  }
}

export class Triggers {

  private watcher: Watcher;
  private triggers: Trigger[];

  constructor(watcher: Watcher) {
    this.watcher = watcher;
    this.triggers = [];
  }

  async check(trades: Trade[]) {
    for(const trigger of this.triggers) {
      await trigger.check.apply(trigger, [trades, this]);
    }
  }

  add(trigger: Trigger) {
    this.triggers.unshift(trigger);
  }

  remove(trigger: Trigger) {
    this.triggers.splice(this.triggers.indexOf(trigger), 1);
  }
}
