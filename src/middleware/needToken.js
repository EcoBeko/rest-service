import TokenService from "@/services/token";

export default (req, res, next) => {
  const authHeader = req.headers["authorization"];

  // has token
  if (authHeader) {
    const parsed = TokenService.bearerParser(authHeader);
    const token = TokenService.validate(token);

    // token is valid
    if (token) {
      const { ip, role_level, phone } = token;
    }

    // token is invalid
    return res.sendStatus(403);
  }

  // no token
  return res.sendStatus(401);
};
