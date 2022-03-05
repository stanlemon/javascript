import dotenv from "dotenv";
import express from "express";
import compression from "compression";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import { createProxyMiddleware } from "http-proxy-middleware";

dotenv.config();

export default function createAppServer(
  options = { port: 3000, webpack: false }
) {
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

  if (options.webpack !== false && process.env.NODE_ENV === "production") {
    app.get(
      "/*.js",
      createProxyMiddleware({
        target: options.webpack,
        changeOrigin: true,
      })
    );

    app.get(
      "/",
      createProxyMiddleware({
        target: options.webpack,
        changeOrigin: true,
      })
    );
  } else if (options.webpack !== false) {
    app.use(express.static("./dist"));
  }

  app.get("/health", (req, res) => {
    res.json({
      success: true,
    });
  });

  const server = app.listen(options.port);

  /* eslint-disable no-console */
  console.log("Starting in %s mode", process.env.NODE_ENV);
  console.log(
    "Listening at http://%s:%s",
    server.address().address === "::" ? "localhost" : server.address().address,
    server.address().port
  );

  return app;
}
