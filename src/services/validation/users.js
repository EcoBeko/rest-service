import RoleService from "@/services/role";

const usersValidation = {
  birthday: (data) => Number.isNaN(Date.parse(birthday)),
  phone: (data) => /[0-9]{10}/i.test(phone),
  gender: (data) => [0, 1].includes(gender),
  role: (data) => RoleService.rolesNames().includes(role),
  password: (data) => /^(?=.*[A-Za-z])(?=.*d)[A-Za-zd]{8,}$/.test(password),
  name: (data) => /[a-z\-]+/i.test(surname),
  surname: (data) => /[a-z\-]+/i.test(surname),
};

export default usersValidation;
