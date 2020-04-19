import jwt from "jsonwebtoken";
import config from "@/config";

class TokenService {
  static create(data = {}, lifeTime = "1h") {
    return jwt.sign(data, config.secretKey, {
      expiresIn: lifeTime,
      algorithm: config.secretAlgorithm
    });
  }

  static validate(token) {
    try {
      return jwt.verify(token, config.secretKey);
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

export default TokenService;
