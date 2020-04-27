import bcrypt from "bcrypt";

class CryptoService {
  static validatePasswords(password, passwordEncrypted) {
    return bcrypt.compareSync(password, passwordEncrypted);
  }

  static hashPassword(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
  }
}

export default CryptoService;
