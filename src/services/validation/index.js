import usersValidation from "./users";

const validations = {
  users: usersValidation,
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
