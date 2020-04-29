import usersValidation from "./users";
import postsValidation from "./posts";

const validations = {
  users: usersValidation,
  posts: postsValidation,
};

class ValidationService {
  static run(validationName, data) {
    const validation = validations[validationName];
    const result = {
      status: true,
      field: "",
    };

    for (const testName in validation) {
      // if no test, skip
      if (!data[testName]) continue;

      result.field = testName;
      result.status = validation[testName](data[testName]);

      if (!result.status) break;

      result.field = "";
    }

    return result;
  }
}

export default ValidationService;
