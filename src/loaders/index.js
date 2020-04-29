"use strict";

import routeCollector from "./route-collector";
import expressLoader from "./express-loader";
import config from "@/config";
import Logger from "@/services/logger";
import { init as configsInit } from "@/config";
import { init as dbInit } from "./db-loader";
import { errorHandler } from "@/middleware";

export default class Loaders {
  static async init(args) {
    // initializing configs
    Logger.log("Configs initializing....");
    configsInit();
    Logger.log("Configs Done");

    // initializing mongodb connection
    Logger.log("OracleDB initializing....");
    const connection = await dbInit();
    Logger.log("OracleDB Done");

    // initializing express & middleware plugins
    Logger.log("Express initializing....");
    const app = await expressLoader();
    Logger.log("Express Done");

    // collecting routes
    const ignore = [];

    // if production, ignore all these routes
    if (config.isProduction) {
      ignore.push("test.js");
    }
    Logger.log("Routes initializing....");
    app.use("/api", await routeCollector("routes", ignore));
    app.use(errorHandler());
    Logger.log("Routes Done");

    return { app, connection };
  }
}
