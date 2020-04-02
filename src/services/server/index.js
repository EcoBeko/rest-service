import pipe from "@/pipe";
import config from "@/config";

class ServerService {
  static closeServer(server) {
    server?.close();
  }
}

pipe.on("server::close", () => {
  ServerService.closeServer(config.server);
});

pipe.on("system::setup", () => {
  console.info("| ServerService is ready");
});

export default ServerService;
