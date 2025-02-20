// 引入代理模块
const HttpsProxyAgent = require('https-proxy-agent');

// 代理信息配置
const proxyAddress = process.env.PROXY_ADDRESS || '';  // 从环境变量获取代理地址
const proxyPort = process.env.PROXY_PORT || '';        // 从环境变量获取代理端口
const proxyUsername = process.env.PROXY_USERNAME || ''; // 从环境变量获取代理用户名
const proxyPassword = process.env.PROXY_PASSWORD || ''; // 从环境变量获取代理密码

let agent = null;

// 如果代理信息存在，设置代理
if (proxyAddress && proxyPort && proxyUsername && proxyPassword) {
  const proxyUrl = `socks5://${proxyUsername}:${proxyPassword}@${proxyAddress}:${proxyPort}`;
  agent = new HttpsProxyAgent(proxyUrl);
} else {
  console.log("没有代理信息，直接使用默认网络连接。");
}

// 引入其他模块
const express = require('express');
const morgan = require('morgan');
const app = express();
const config = require('./config/config');
const routes = require('./routes');

// 设置全局的 fetch 使用代理（如果有代理）
global.fetch = require('node-fetch').default;
global.fetch = (url, options = {}) => {
  if (agent) {
    options.agent = agent; // 使用代理
  }
  return global.fetch(url, options);
};

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.use(morgan(process.env.MORGAN_FORMAT ?? 'tiny'));

app.use("/", routes);

app.listen(config.port, () => {
    console.log(`The server listens port: ${config.port}`);
});
