import dotenv from "dotenv";
import express from "express";
import compression from "compression";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import { createProxyMiddleware } from "http-proxy-middleware";

dotenv.config();

const DEVELOPMENT = "development";
const { NODE_ENV = DEVELOPMENT, WEBPACK_URL = "http://localhost:8080" } =
  process.env;

export default function createAppServer(opts = { port: 3000 }) {
  const app = express();
  app.use(express.json());

  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // X minutes
    max: 100, // limit each IP to Y requests per windowMs
  });

  app.use(limiter);

  if (process.env.NODE_ENV !== "test") {
    app.use(morgan("combined"));
  }

  if (process.env.NODE_ENV === "production") {
    app.use(compression());
    app.use(helmet());
  }

  if (NODE_ENV !== DEVELOPMENT) {
    app.use(express.static("./dist"));
  }

  if (NODE_ENV === DEVELOPMENT && WEBPACK_URL) {
    app.get(
      "/*.js",
      createProxyMiddleware({
        target: WEBPACK_URL,
        changeOrigin: true,
      })
    );

    app.get(
      "/",
      createProxyMiddleware({
        target: WEBPACK_URL,
        changeOrigin: true,
      })
    );
  }

  app.get("/health", (req, res) => {
    res.json({
      success: true,
    });
  });

  const server = app.listen(opts.port);

  /* eslint-disable no-console */
  console.log("Starting in %s mode", NODE_ENV);
  console.log(
    "Listening at http://%s:%s",
    server.address().address === "::" ? "localhost" : server.address().address,
    server.address().port
  );

  return app;
}
