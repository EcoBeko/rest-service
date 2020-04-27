import express from "express";
import compression from "compression";
import cors from "cors";
import { json } from "body-parser";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import requestIp from "request-ip";
import fileUpload from "express-fileupload";
import config from "@/config";
import { join } from "path";
import { logger } from "@/middleware";

export default async () => {
  const app = express();

  app.use(cors());
  app.use(helmet());
  app.use(compression({ level: 1 }));
  app.use(cookieParser());
  app.use(json());
  app.use(requestIp.mw());
  app.use(
    fileUpload({
      useTempFiles: true,
      tempFileDir: config.tmpPath,
      debug: config.isProduction,
    })
  );
  app.use(express.static(join(config.rootPath, "static")));
  app.use(express.static("/assets", config.assetsPath));
  app.use(logger());

  return app;
};
