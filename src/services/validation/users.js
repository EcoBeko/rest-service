import RoleService from "@/services/role";

const usersValidation = {
  birthday: (data) => !Number.isNaN(Date.parse(data)),
  phone: (data) => /[0-9]{10}/i.test(data),
  gender: (data) => [0, 1].includes(data),
  role: (data) => RoleService.rolesNames().includes(data),
  password: (data) => /[a-zA-Z0-9@\.]{8,}/.test(data),
  name: (data) => /[a-z\-]+/i.test(data),
  surname: (data) => /[a-z\-]+/i.test(data),
};

export default usersValidation;
