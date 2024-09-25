module.exports = allowRole = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.headers.role)) {
      return res
        .status(403)
        .json({ message: "Access Denied: Insufficient permissions" });
    }
    next();
  };
};
