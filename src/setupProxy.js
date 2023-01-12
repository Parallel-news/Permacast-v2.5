const { createProxyMiddleware } = require('http-proxy-middleware');
 
module.exports = function (app) {
  app.use(
    createProxyMiddleware('/exm', {
      target: 'https://api.exm.dev', // API endpoint 1
      changeOrigin: true,
      pathRewrite: {
        "^/exm": "",
      },
      headers: {
        Connection: "keep-alive"
      }
    })
  );
  app.use(
    createProxyMiddleware('/ans', {
      target: 'https://ans-testnet.herokuapp.com/', // API endpoint 2
      changeOrigin: true,
      pathRewrite: {
        "^/ans": "",
      },
      headers: {
        Connection: "keep-alive"
      }
    })
  );
}