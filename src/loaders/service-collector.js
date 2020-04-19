import { readdirSync } from "fs";
import { join } from "path";
import Logger from "@/services/logger";

/**
 * Collects the services from @origin directory
 *
 * @param ignore - array of ignored folders or files
 */
export default async function collector(ignore = []) {
  try {
    const base = join(__dirname, "../services");
    const services = readdirSync(base);

    services.forEach((service) => {
      const path = join(base, service);
      Logger.log(`${service} service is up`);
      require(path);
    });
  } catch (err) {
    Logger.error("Service Collector", err);
    process.exit(1);
  }
}
