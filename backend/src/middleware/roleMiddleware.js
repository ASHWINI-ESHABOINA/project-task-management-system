const authorizeRoles = (...roles) => {
    return (req, res, next) => {
      // Ensure user is authenticated first
      if (!req.user) {
        return res.status(401).json({
          message: "Not authenticated",
        });
      }
  
      // Normalize role safety (prevents casing issues like "Admin")
      const userRole = String(req.user.role || "").toLowerCase();
  
      // Validate role exists in system (extra safety layer)
      const allowedRoles = roles.map((r) => String(r).toLowerCase());
  
      if (!allowedRoles.includes(userRole)) {
        return res.status(403).json({
          message: "Access denied: insufficient permissions",
        });
      }
  
      next();
    };
  };
  
  module.exports = { authorizeRoles };