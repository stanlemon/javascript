import dotenv from "dotenv";
import express, { Router } from "express";
import cookieParser from "cookie-parser";
import compression from "compression";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import { createProxyMiddleware } from "http-proxy-middleware";
import path from "path";

dotenv.config();

const NODE_ENV = process.env.NODE_ENV ?? "development";

export const DEFAULTS = { port: 3000, webpack: false, start: true };

/**
 * @typedef {object} AppAddons
 * @property {function} start Start the server
 * @property {function} catch404s Enable the 404 handler, only call this after you have added all of your routers.
 *
 * @typedef {import("express").Express & AppAddons} AppServer
 */

/**
 * Create an express application server.
 * @param {object} options
 * @param {number} options.port Port to listen on
 * @param {boolean} options.webpack Whether or not to create a proxy for webpack
 * @param {boolean} options.start Whether or not to start the server
 * @returns {AppServer} Pre-configured express app server with extra helper methods
 */
// eslint-disable-next-line max-lines-per-function
export default function createAppServer(options) {
  const { port, webpack, start } = { ...DEFAULTS, ...options };

  const useWebpack =
    webpack !== false && NODE_ENV !== "production" && NODE_ENV !== "test";

  const app = express();
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use(cookieParser());

  if (NODE_ENV !== "test") {
    app.use(morgan("combined"));
  }

  if (NODE_ENV === "production") {
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

  app.get("/ping", (req, res) => {
    res.json({
      success: true,
    });
  });

  if (useWebpack) {
    // eslint-disable-next-line no-console
    console.info("Proxying webpack dev server");

    app.get(
      "/static/*",
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

  app.start = () => {
    const server = app.listen(port);

    // eslint-disable-next-line no-console
    console.info("Starting in %s mode on port %s", NODE_ENV, port);
    // eslint-disable-next-line no-console
    console.info(
      "Listening at http://%s:%s",
      server.address().address === "::"
        ? "localhost"
        : server.address().address,
      server.address().port
    );
  };

  app.spa = () => {
    if (useWebpack) {
      app.get(
        "*",
        createProxyMiddleware({
          target: webpack,
          changeOrigin: true,
        })
      );
    } else {
      app.get(`*`, function (req, res, next) {
        res.sendFile(path.resolve("./", "dist", "index.html"));
      });
    }
  };

  app.catch404s = (path = "/*") => {
    const router = Router();
    router.use((req, res, next) => {
      res.status(404).json({ error: "Not Found" });
    });
    app.use(path, router);
  };

  // If we're set to start. Btw we never start in test.
  if (start && NODE_ENV !== "test") {
    app.start();
  }

  return app;
}
