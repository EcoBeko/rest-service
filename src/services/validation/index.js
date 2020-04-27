import RoleService from "@/services/role";

class ValidationService {
  static users_name(name) {
    return /[a-z\-]+/i.test(name);
  }

  static users_surname(surname) {
    return /[a-z\-]+/i.test(surname);
  }

  static users_password(password) {
    return /^(?=.*[A-Za-z])(?=.*d)[A-Za-zd]{8,}$/.test(password);
  }

  static users_role(role) {
    return RoleService.rolesNames().includes(role);
  }

  static users_gender(gender) {
    return [0, 1].includes(gender);
  }

  static users_phone(phone) {
    return /[0-9]{10}/i.test(phone);
  }

  static users_birthday(birthday) {
    return Number.isNaN(Date.parse(birthday));
  }
}

export default ValidationService;
