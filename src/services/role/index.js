import userRole from "./user-role";
import adminRole from "./admin-role";

const roles = [userRole, adminRole];

class RoleService {
  static authorize(role_level, api) {
    const role = roles[role_level];

    if (role) {
      for (const action of role.actions) {
        const regexp = action
          .replace(/\//g, "\\/")
          .replace(/\*/g, "([0-9a-z:\\-]*)");

        const test = new RegExp(regexp, "i");

        if (test.test(api)) return true;
      }
    }

    return false;
  }

  static rolesNames() {
    return roles.map((item) => item.name);
  }

  static getLevel(name) {
    for (const role of roles) {
      if (role.name === name) return role.level;
    }
    return -1;
  }
}

export default RoleService;
