"use strict";

import config from "./config";
import { setConfig } from "./config";
import Loaders from "./loaders";
import Logger from "@/services/logger";
import { join } from "path";

/**
 * Entry point of the system
 *
 * Initializing configurations & loaders
 */
async function main(args) {
  const { app, connection } = await Loaders.init(args);

  const server = app.listen(config.port, () =>
    Logger.log(`Server started at port ${config.port}`)
  );

  setConfig("server", server);
  setConfig("connection", connection);
  setConfig("rootPath", join(__dirname, "../"));
  setConfig("assetsPath", join(__dirname, "../assets"));
  setConfig("tmpPath", join(__dirname, "../tmp"));
}

main(process.argv);
