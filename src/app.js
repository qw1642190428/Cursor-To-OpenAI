// 引入代理模块
const HttpsProxyAgent = require('https-proxy-agent');

// 代理信息配置
const proxyHost = '代理地址';  // 用变量填入
const proxyPort = '代理端口';  // 用变量填入
const proxyUsername = '代理用户名';  // 用变量填入
const proxyPassword = '代理密码';  // 用变量填入

// 创建代理 URL
const proxyUrl = `socks5://${proxyUsername}:${proxyPassword}@${proxyHost}:${proxyPort}`;

// 设置代理
const agent = new HttpsProxyAgent(proxyUrl);

// 引入其他模块
const express = require('express');
const morgan = require('morgan');
const app = express();
const config = require('./config/config');
const routes = require('./routes');

// 设置全局的 fetch 使用代理
global.fetch = require('node-fetch').default;
global.fetch = (url, options = {}) => {
  options.agent = agent; // 使用代理
  return global.fetch(url, options);
};

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.use(morgan(process.env.MORGAN_FORMAT ?? 'tiny'));

app.use("/", routes);

app.listen(config.port, () => {
    console.log(`The server listens port: ${config.port}`);
});
