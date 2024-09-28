import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

// Extend Express Request interface to include userId
declare global {
  namespace Express {
    interface Request {
      userId: string;
    }
  }
}

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies["auth_token"];
  
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  
  try {
    // Decode token and extract userId from the payload
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string);
    
    // Type guard for decoded token type
    if (typeof decoded === "object" && "userId" in decoded) {
      req.userId = (decoded as jwt.JwtPayload).userId as string; // Ensure decoded is treated as JwtPayload
      next();
    } else {
      return res.status(401).json({ message: "Unauthorized" });
    }
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" }); // Consistent error message
  }
};

export default verifyToken;
