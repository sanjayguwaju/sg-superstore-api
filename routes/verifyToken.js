const jwt = require("jsonwebtoken");
const util = require('util');

// Promisify jwt.verify()
const verify = util.promisify(jwt.verify);

// Common error message
const errorMessage = "You do not have sufficient permissions to perform this action!";

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.slice(7, authHeader.length).trimLeft(); // Extract token
    try {
      req.user = await verify(token, process.env.JWT_SEC);
      next();
    } catch (err) {
      return res.status(403).json({ message: "Invalid token!" });
    }
  } else {
    return res.status(401).json({ message: "Authentication required!" });
  }
};

const verifyTokenAndAuthorization = async (req, res, next) => {
  await verifyToken(req, res, () => {
    if (req.user.id === req.params.id || req.user.isAdmin) {
      next();
    } else {
      return res.status(403).json({ message: errorMessage });
    }
  });
};

const verifyTokenAndAdmin = async (req, res, next) => {
  await verifyToken(req, res, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      return res.status(403).json({ message: errorMessage });
    }
  });
};

const verifyUserRole = async (req, res, next) => {
  await verifyToken(req, res, () => {
    const allowedRoles = req.route.allowedRoles || []; // get the allowed roles for the current route, or use an empty array if not set
    const userRole = req.user.role; // get the role of the authenticated user
    if (allowedRoles.length === 0 || allowedRoles.includes(userRole)) { // check if the user's role is allowed for the current route
      next();
    } else {
      return res.status(403).json({ message: errorMessage });
    }
  });
};

module.exports = {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
  verifyUserRole
};
