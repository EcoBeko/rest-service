import pipe from "@/pipe";
import config from "@/config";
import Logger from "@/services/logger";
import events from "@/pipe/names";

class ServerService {
  static closeServer(server) {
    server?.close();
  }
}

pipe.on(events.server.close, () => {
  Logger.handled(events.server.close, "Server Service", "closing server...");
  ServerService.closeServer(config.server);
});

export default ServerService;
