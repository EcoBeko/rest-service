import { Logger } from "@/services";
import { Router } from "express";
import { isFalsy } from "@/utils";

class RouteService {
  constructor(res) {
    this.res = res;
  }

  static make() {
    return Router();
  }

  static wrapper() {
    return (req, res, next) => {
      try {
        return next();
      } catch (err) {
        if (err.message !== "end")
          Logger.error("api/users/register-user route", err);
      }
    };
  }

  checkParameters(...params) {
    this.check(
      isFalsy(name, surname, password, birthday),
      "Request conditions are not met",
      412
    );
  }

  checkValidation(stats) {
    this.check(
      "status" in stats && !stats.status,
      "Data validation error on " + user.field,
      406
    );
  }

  end(message, code) {
    this.check(true, message, code, true);
  }

  check(condition, message, code, status = false) {
    if (condition) {
      this.res.status(code).json({
        status,
        message,
      });
      throw new Error("end");
    }
  }
}

export default RouteService;
