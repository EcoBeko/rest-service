import jwt from "jsonwebtoken";
import config from "@/config";
import pipe from "@/pipe";

class TokenService {
  static create(data = {}, lifeTime = "1h") {
    return jwt.sign(data, config.secret.user, {
      expiresIn: lifeTime,
      algorithm: config.secret.algorithm
    });
  }

  static validate(token) {
    try {
      return jwt.verify(token, config.secret.user);
    } catch (err) {
      return false;
    }
  }

  static middle(req, res, next) {
    const header = req.headers["authorization"];

    if (header) {
      req.token = this.bearerParser(header);
      next();
    }
    res.sendStatus(403);
  }

  static bearerParser(header) {
    const bearer = header.split(" ");
    const token = bearer[1];

    return token ?? "";
  }
}

pipe.on("system::setup", () => {
  console.info("| TokenService ready");
});

export default TokenService;
