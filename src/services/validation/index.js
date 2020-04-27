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
      result.field = testName;
      result.status = validation[testName](data[testName]);

      if (!result.status) break;
    }

    return result;
  }
}

export default ValidationService;
