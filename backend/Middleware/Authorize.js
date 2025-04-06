const authorize = (...roles) => {
    return (req, res, next) => {
      try {
        if (!req.user) {
          return res.status(401).json({ message: "Unauthorized access" });
        }
        if (!roles.includes(req.user.role)) {
          return res.status(403).json({ message: "Access denied" });
        }
  
        next();
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
      }
    };
  };
  
  module.exports = authorize;
  