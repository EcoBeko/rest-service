import Logger from "@/services/logger";

export default function () {
  return (req, res, next) => {
    // Send to the logger
    Logger.route(req);
    return next();
  };
}
