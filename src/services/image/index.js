import { join } from "path";
import config from "@/config";
import { Logger } from "@/services";

class ImageService {
  static async add(file) {
    try {
      const extension = file.name.substr(file.name.lastIndexOf("."));
      const fileName = `${file.name.replace(extension, "")}-[${
        file.md5
      }]${extension}`;

      await file.mv(join(config.assetsPath, fileName));

      return fileName;
    } catch (err) {
      Logger.error("Image Service", err);
    }
  }
}

export default ImageService;
