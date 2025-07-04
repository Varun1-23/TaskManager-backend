// middlewares/verifyAdmin.js
import jwt from 'jsonwebtoken';
import { ApiError } from '../utils/ApiError.js';

export const verifyAdmin = (req, res, next) => {
  const token = req.cookies.adminToken;

  if (!token) {
    console.log("❌ No adminToken in cookies");
    return next(new ApiError(403, "Forbidden: Admin token missing"));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== 'admin') {
      console.log("❌ Token found but not admin role");
      return next(new ApiError(403, "Forbidden: Admin access only"));
    }

    req.user = decoded; // set the decoded token to req.user
    console.log("✅ Admin verified:", decoded.email);
    next();
  } catch (err) {
    console.log("❌ Error verifying token:", err.message);
    return next(new ApiError(403, "Forbidden: Invalid admin token"));
  }
};
