export default {
  level: 0,
  actions: [
    // test routes
    "/api/token/test/need-token",
    "/api/token/test/params/*",
    "/api/token/test/*/between",
    "/api/token/test/*/multiple/*",
  ],
  modules: {
    name: "user",
  },
};
