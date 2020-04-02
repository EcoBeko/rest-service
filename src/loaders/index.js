import routeCollector from "./route-collector";
import serviceCollector from "./service-collector";
import expressLoader from "./express-loader";
import pipe from "@/pipe";
import config from "@/config";
import { init as pipeInit } from "@/pipe";
import { init as configsInit } from "@/config";
import { init as dbInit } from "./db-loader";

export default class Loaders {
  static async init(args) {
    // initializing configs
    configsInit();

    // initializing event-pipe
    pipeInit();

    // initializing mongodb connection
    await dbInit();

    // initializing express & middleware plugins
    const app = await expressLoader();

    // collecting services
    await serviceCollector();

    // collecting routes
    const ignore = [];

    // if production, ignore all these routes
    if (config.isProduction) {
      ignore.push("test.js");
    }
    app.use("/api", await routeCollector("routes", ignore));
    

    pipe.emit("system::setup");

    return { app };
  }
}
