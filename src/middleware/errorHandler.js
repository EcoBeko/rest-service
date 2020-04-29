import Logger from "@/services/logger";

export default function (options) {
  return (err, req, res, next) => {
    if (req.isRouteEnd) return;

    Logger.error(req.originalUrl, err);
    return res.sendStatus(500);
  };
}
