import { readdirSync } from "fs";
import { join } from "path";

/**
 * Collects the services from @origin directory
 *
 * @param ignore - array of ignored folders or files
 */
export default async function collector(ignore = []) {
  try {
    const base = join(__dirname, "../services");
    const services = readdirSync(base);

    services.forEach(service => {
      const path = join(base, service);
      require(path);
    });
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
