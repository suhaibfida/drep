import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}
interface CustomJwtPayload extends JwtPayload {
  userId: string;
}
const middleware = (req: Request, res: Response, next: NextFunction) => {
  const secret = "json";
  const token = req.headers["authorization"] ?? "";
  const check = jwt.verify(token, secret) as CustomJwtPayload;
  if (check) {
    req.userId = check.userId;
    next();
  }
};
export default middleware;
