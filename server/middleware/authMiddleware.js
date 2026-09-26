import jwt from 'jsonwebtoken';
import { config } from '../config/config.js';

/**
 * Authenticates JWT bearer token from Authorization header
 */
export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'UNAUTHORIZED',
      message: 'Access denied. Missing bearer authorization token.'
    });
  }

  jwt.verify(token, config.jwtSecret, (err, decoded) => {
    if (err) {
      return res.status(403).json({
        success: false,
        error: 'INVALID_TOKEN',
        message: 'Provided authentication token is expired or invalid.'
      });
    }
    req.user = decoded;
    next();
  });
};

/**
 * Enforces Role-Based Access Control (RBAC)
 * @param  {...string} allowedRoles Allowed role names (e.g., 'USPTO', 'JPO', 'ADMIN')
 */
export const requireRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'UNAUTHORIZED',
        message: 'Authentication required prior to role evaluation.'
      });
    }

    const userRole = (req.user.role || '').toUpperCase();
    const normalizedAllowed = allowedRoles.map(r => r.toUpperCase());

    // Admin has superuser override access
    if (userRole === config.roles.ADMIN || normalizedAllowed.includes(userRole)) {
      return next();
    }

    return res.status(403).json({
      success: false,
      error: 'FORBIDDEN',
      message: `Access denied. Role '${userRole}' does not hold required privileges: [${allowedRoles.join(', ')}]`,
      requiredRoles: allowedRoles,
      userRole
    });
  };
};

/**
 * Optional authentication middleware for public endpoints with personalization
 */
export const optionalAuth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token) {
    jwt.verify(token, config.jwtSecret, (err, decoded) => {
      if (!err && decoded) {
        req.user = decoded;
      }
      next();
    });
  } else {
    next();
  }
};
