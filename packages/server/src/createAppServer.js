import dotenv from "dotenv";
import express from "express";
import compression from "compression";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import { createProxyMiddleware } from "http-proxy-middleware";

dotenv.config();

export const DEFAULTS = { port: 3000, webpack: false, start: true };

export default function createAppServer(options) {
  const { port, webpack, start } = { ...DEFAULTS, ...options };

  const app = express();
  app.use(express.json({ strict: false }));

  if (process.env.NODE_ENV !== "test") {
    app.use(morgan("combined"));
  }

  if (process.env.NODE_ENV === "production") {
    const limiter = rateLimit({
      windowMs: 5 * 60 * 1000, // 5 minutes
      max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
      standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
      legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    });

    app.use(limiter);
    app.use(compression());
    app.use(helmet());
  }

  if (
    webpack !== false &&
    process.env.NODE_ENV !== "production" &&
    process.env.NODE_ENV !== "test"
  ) {
    app.get(
      "/*.js",
      createProxyMiddleware({
        target: webpack,
        changeOrigin: true,
      })
    );

    app.get(
      "/",
      createProxyMiddleware({
        target: webpack,
        changeOrigin: true,
      })
    );

    app.get(
      "/ws",
      createProxyMiddleware({
        target: webpack,
        changeOrigin: true,
        ws: true,
      })
    );
  } else if (webpack !== false) {
    app.use(express.static("./dist"));
  }

  app.get("/health", (req, res) => {
    res.json({
      success: true,
    });
  });

  // If we're set to start. Btw we never start in test.
  if (start && process.env.NODE_ENV !== "test") {
    const server = app.listen(port);

    /* eslint-disable no-console */
    console.log("Starting in %s mode", process.env.NODE_ENV);
    console.log(
      "Listening at http://%s:%s",
      server.address().address === "::"
        ? "localhost"
        : server.address().address,
      server.address().port
    );
  }

  return app;
}
