import { join } from "path";
import config from "@/config";
import { Logger } from "@/services";

class ImageService {
  static async add(file) {
    try {
      const extension = file.name.substr(file.name.lastIndexOf("."));
      await file.mv(join(config.assetsPath, `${file.md5}${extension}`));
    } catch (err) {
      Logger.error("Image Service", err);
    }
  }
}

export default ImageService;
