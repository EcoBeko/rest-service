import config from "./config";
import { setConfig } from "./config";
import Loaders from "./loaders";
import Logger from "@/services/logger";

/**
 * Entry point of the system
 *
 * Initializing configurations & loaders
 */
async function main(args) {
  const { app, connection } = await Loaders.init(args);

  const server = app.listen(config.port, () => Logger.log(`Server started at port ${config.port}`));

  setConfig("server", server);
  setConfig("connection", connection);
}

main(process.argv);
