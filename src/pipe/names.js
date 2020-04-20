import deepFreeze from "@/utils/deepFreeze";

export default deepFreeze({
  server: {
    close: "server::close",
    setup: "server::setup",
  },
  oracle: {
    connected: "oracle::connected",
  },
});
