import routeCollector from "./route-collector";
import serviceCollector from "./service-collector";
import expressLoader from "./express-loader";
import pipe from "@/pipe";
import events from "@/pipe/names";
import config from "@/config";
import Logger from "@/services/logger";
import { init as pipeInit } from "@/pipe";
import { init as configsInit } from "@/config";
import { init as dbInit } from "./db-loader";

export default class Loaders {
  static async init(args) {
    // initializing configs
    Logger.log("Configs initializing....");
    configsInit();
    Logger.log("Configs Done");

    // initializing event-pipe
    Logger.log("EventPipe initializing....");
    pipeInit();
    Logger.log("EventPipe Done");

    pipe.emit(events.server.setup);

    // initializing mongodb connection
    Logger.log("MongoDB initializing....");
    const connection = await dbInit();
    Logger.log("MongoDB Done");

    // initializing express & middleware plugins
    Logger.log("Express initializing....");
    const app = await expressLoader();
    Logger.log("Express Done");

    // collecting services
    Logger.log("Services initializing....");
    await serviceCollector();
    Logger.log("Services Done");

    // collecting routes
    const ignore = [];

    // if production, ignore all these routes
    if (config.isProduction) {
      ignore.push("test.js");
    }
    Logger.log("Routes initializing....");
    app.use(
      "/api",
      (req, res, next) => {
        // Send to the logger
        Logger.route(req);
        next();
      },
      await routeCollector("routes", ignore)
    );
    Logger.log("Routes Done");

    return { app, connection };
  }
}
