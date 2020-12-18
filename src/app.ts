import {Watcher, Config, Trigger} from './binance';

Watcher.config = <Config>{
    apiKey: process.env.BIN_APIKEY,
    apiSecret: process.env.BIN_APISECRET
};

const watcher = new Watcher('BTCUSDT');

watcher.triggers.add(<Trigger>{
  targetPrice: 23033,
  check: function([first, second, ... history], triggers) {
    console.log('checkTrigger');
    if(first.price > this.targetPrice) {
      console.log('ahhhhhhhhhhhhhhhhhhhhhh');
      triggers.remove(this);
    }
  }
});

watcher.start();
