import TokenService from "@/services/token";
import RoleService from "@/services/role";

export default (req, res, next) => {
  const authHeader = req.headers["authorization"];

  // has token
  if (authHeader) {
    const parsed = TokenService.bearerParser(authHeader);
    const token = TokenService.validate(parsed);

    // token is valid
    if (token) {
      const { ip, role_level } = token;
      const clientIp = req.clientIp;

      // same ip source
      if (ip === clientIp) {
        const isAuthorized = RoleService.authorize(role_level, req.originalUrl);

        // resource is available for the role
        if (isAuthorized) {
          req.token = token;
          return next();
        }
      }
    }

    // token is invalid || ip is invalid || resource is unavailable
    return res.sendStatus(403);
  }

  // no token
  return res.sendStatus(401);
};
