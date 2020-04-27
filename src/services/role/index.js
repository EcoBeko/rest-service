import userRole from "./user-role";

const roles = [userRole];

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
}

export default RoleService;
