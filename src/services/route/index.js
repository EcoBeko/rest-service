import { Router } from "express";
import { isFalsy } from "@/utils";

class RouteService {
  constructor(req, res, next) {
    this.req = req;
    this.res = res;
    this.next = next;
    this.isDone = false;
    this.data = {};
  }

  static make() {
    return Router();
  }

  extract(fields) {
    const body = {};
    for (const field in fields) {
      const value = this.req.body[field];

      if (fields[field] && this.checkParameters(value)) break;
      body[field] = value;
    }

    return body;
  }

  checkParameters(...params) {
    return this.checkSync(
      () => isFalsy(...params),
      "Request conditions are not met",
      412
    );
  }

  checkValidation(stats) {
    return this.checkSync(
      () => "status" in stats && !stats.status,
      "Data validation error on " + stats?.field,
      406
    );
  }

  end(message, code) {
    return this.checkSync(() => true, message, code, true);
  }

  async action(callback) {
    if (this.isDone) return false;

    await callback();
    return true;
  }

  async check(condition, message, code, status = false) {
    if (this.isDone) return false;
    const result = await condition();

    return this.throwError(result, message, code, status);
  }

  checkSync(condition, message, code, status = false) {
    if (this.isDone) return false;
    const result = condition();

    return this.throwError(result, message, code, status);
  }

  throwError(result, message, code, status) {
    if (result) {
      this.res.status(code).json({
        status,
        message,
      });
      this.req.isRouteEnd = true;
      this.isDone = true;
      this.next(new Error("end"));
    }

    return result;
  }
}

export default RouteService;
