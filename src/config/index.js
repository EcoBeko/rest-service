import { config } from "dotenv";
import Logger from "@/services/logger";
import { Server } from "http";

const configs = {
  port: 3000,
  isProduction: false,
  secretAlgorithm: "HS256",
  secretKey: "default",
  db_username: "",
  db_password: "",
  db_connectionString: "",
  server: Server,
  rootPath: "",
  assetsPath: "",
  tmpPath: "",
};

export function setConfig(key, value) {
  if (key && value) {
    Logger.log(
      `Configuration update at ${key} by: ${typeof configs[key]} --> ${typeof value}`
    );
    configs[key] = value;
  }
}

export function init() {
  config();

  setConfig("port", +process.env.PORT);
  setConfig("isProduction", process.env.ENV_MODE === "prod");
  setConfig("secretKey", process.env.USER_TOKEN_SECRET);
  setConfig("secretAlgorithm", process.env.TOKEN_ALGORITHM);
  setConfig("db_username", process.env.NODE_ORACLEDB_USER);
  setConfig("db_password", process.env.NODE_ORACLEDB_PASSWORD);
  setConfig("db_connectionString", process.env.NODE_ORACLEDB_CONNECTIONSTRING);
}

export default configs;
