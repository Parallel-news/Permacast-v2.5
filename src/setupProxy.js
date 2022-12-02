import { createProxyMiddleware, fixRequestBody, responseInterceptor } from 'http-proxy-middleware';
import {express} from 'express';

const app = express();
const proxyMiddleware = createProxyMiddleware({
  target: 'https://api.exm.dev',
  changeOrigin: true,
});

app.use( '/*', proxyMiddleware );