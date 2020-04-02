import { readdirSync, statSync } from "fs";
import { join } from "path";
import { Router } from "express";

/**
 * Collects the routes from @origin directory
 *
 * @param origin - directory to collect from
 * @param ignore - array of ignored folders or files
 * @param router - express.Router to be attached with
 *
 * @returns express.Router containing all the routes from given origin
 */
export default async function collector(origin, ignore = [], router = Router(), root = origin) {
  const base = join(__dirname, "../", origin);
  const items = readdirSync(base);

  items.forEach(item => {
    let pathToItem = join(origin, item);

    const status = statSync(join(base, item));

    if (status.isDirectory()) collector(pathToItem, ignore, router, root);
    else if (status.isFile()) {
      const sliced = origin.replace(root, "");
      const isIgnoring = ignore.find(i => new RegExp(i, "ig").test(pathToItem));

      if (!isIgnoring) {
        router.use(sliced, require(join(base, item)).default);
      }
    }
  });

  return router;
}
