export default {
  level: 1,
  name: "admin",
  actions: [
    // test routes
    "/api/token/test/need-token",
    "/api/token/test/params/*",
    "/api/token/test/*/between",
    "/api/token/test/*/multiple/*",
  ],
  modules: {
    name: "admin",
  },
};
