import bcrypt from "bcrypt";

class UsersService {
  static validatePasswords(data, encrypted) {
    return bcrypt.compareSync(data, encrypted);
  }

  static hashPassword(p) {
    return bcrypt.hashSync(p, bcrypt.genSaltSync(8));
  }
}

export default UsersService;
