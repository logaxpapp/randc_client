// roleCheckMiddleware.js
const roleCheckMiddleware = (allowedRoles) => {
    return async (req, res, next) => {
      try {
        // Assuming `req.user` is populated from previous authentication middleware
        const user = req.user;
  
        if (!user) {
          return res.status(401).json({ message: "Authentication required" });
        }
  
        const hasRequiredRole = allowedRoles.includes(user.role);
  
        if (!hasRequiredRole) {
          return res.status(403).json({ message: "Forbidden: Insufficient permissions" });
        }
  
        next();
      } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
      }
    };
  };
  
  export default roleCheckMiddleware;
  