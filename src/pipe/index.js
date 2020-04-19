import { EventEmitter2 } from "eventemitter2";
import Logger from "@/services/logger";
import config from "@/config";

const pipe = new EventEmitter2({
  wildcard: true,
  delimiter: "::",
});

// For development purposes
if (!config.isProduction) global.pipe = pipe;

export function init() {
  pipe.on("**", function () {
    Logger.fired(this.event);
  });
}

export default pipe;
