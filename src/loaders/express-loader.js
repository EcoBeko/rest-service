import express from "express";
import cors from "cors";
import { json } from "body-parser";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import requestIp from "request-ip";
import fileUpload from "express-fileupload";
import config from "@/config";
import { join } from "path";

export default async () => {
  const app = express();

  app.use(cors());
  app.use(helmet());
  app.use(cookieParser());
  app.use(json());
  app.use(requestIp.mw());
  app.use(
    fileUpload({
      useTempFiles: true,
      tempFileDir: join(config.rootPath, "/tmp/"),
      debug: config.isProduction,
    })
  );

  return app;
};
