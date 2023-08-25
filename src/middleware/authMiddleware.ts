import { NextFunction, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      user: {
        id: string;
        name: string;
        email: string;
        image: string;
      }; // Add your custom property and its type here
    }
  }
}

export const authentication = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const secretKey = process.env.JWT_SECRET;
  let token;
  const UserClient = new PrismaClient().user;
  
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];

    //decode token id\

    try {
      if (secretKey !== undefined) {
        const decoded: any = jwt.verify(token, secretKey);

        if (decoded) {
          const user = await UserClient.findUnique({
            where: {
              id: decoded.id,
            },
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          });

          if (user) {
            req.user = user;
          } else {
            return res.status(400).json({ error: "User not authorized" });
          }
        }
        next();
      }
    } catch (error) {


      return res.status(400).json({ error: "Token Error",token:token });
    }
  }

  if (!token) {
    return res.status(400).json({ error: "User not authorized" });
  }
};
