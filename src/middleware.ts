import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

interface AuthRequest extends Request {
  user?: jwt.JwtPayload;
}
export const verifyToken =(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) : void => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      res.status(401).json({ message: "Authorization header missing" });
      return;
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      res.status(401).json({ message: "Token missing" });
      return;
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined in environment variables");
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET) as jwt.JwtPayload;
    req.user = decode;

    next();
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Error while verifying token",
    });
    return;
  }
}
