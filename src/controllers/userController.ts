import { PrismaClient } from "@prisma/client";
import {
  passwordCompare,
  passwordHasher,
} from "../config/passwordHasher/hasher";
import {
  generateJwtToken,
  resetJwtToken,
  verifyJwtToken,
} from "../config/token/token";
import { Request, Response } from "express";
import nodemailer from "nodemailer";

const prisma = new PrismaClient();

//register User
export const registerUser = async (req: Request, res: Response) => {
  const { name, email, password, image } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "Please Enter all fields" });
  }
  if (
    typeof name === "string" &&
    typeof email === "string" &&
    typeof password === "string"
  ) {
    const userExist = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (userExist) {
      return res.status(400).json({ error: "User already Exist" });
    }

    const hashedPassword = await passwordHasher(password);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        image,
      },
    });

    if (user) {
      return res.status(200).json({ success: " User Created" });
    } else {
      return res.status(400).json({ error: "failed to create User" });
    }
  } else {
    return res.status(400).json({ error: "Please give only string value" });
  }
};

//Login User

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Please Enter all fields" });
  }

  if (typeof email === "string" && typeof password === "string") {
    try {
      const user = await prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (user && (await passwordCompare(password, user.password))) {
        res.cookie("token", generateJwtToken(user.id), {});
        return res.status(200).json(generateJwtToken(user.id));
      } else {
        return res.status(400).json({ error: "User Not found" });
      }
    } catch (error) {
      return res.status(400).json({ error });
    } finally {
      await prisma.$disconnect();
    }
  } else {
    return res.status(400).json({ error: "Please give only string value" });
  }
};

//Logout User

export const logoutUser = (req: Request, res: Response) => {
  try {
    res.status(200).cookie("token", "", {
      httpOnly: true,
      expires: new Date(0),
    });
    return res.json({ message: "Logout Successful" });
  } catch (error) {
    return res.status(400).json({ error: "User Not found" });
  }
};

// Search User
export const searchUser = async (req: Request, res: Response) => {
  const query = req.query.search;

  if (typeof query !== "string" || query === "") {
    return res.status(400).json({ error: "Please give only string value" });
  }

  try {
    const users = await prisma.user.findMany({
      where: {
        OR: [
          {
            name: {
              contains: query,
              notIn: [req.user.name],
            },
          },
          {
            email: {
              contains: query,
              notIn: [req.user.email],
            },
          },
        ],
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
      },
    });

    console.log(users);
    return res.status(200).json(users);
  } catch (error) {
    return res.status(400).json({ error: "Error happens" });
  }
};

//Get User Info

export const userInfo = async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.user.id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        image: true,
      },
    });

    return res.status(200).json(user);
  } catch (error) {
    return res.status(400).json({ error: "UserInfo Error happens" });
  }
};

//Forget Password

export const forgetPassword = async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Please Enter field" });
  }

  if (typeof email === "string") {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(400).json({ error: "Email is not registered" });
    }

    const token = await resetJwtToken(user.id);

    try {
      //Connect SMPT
      const transporter = await nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          // TODO: replace `user` and `pass` values from <https://forwardemail.net>
          user: "tejodeepmitra@gmail.com",
          pass: "mnscfgbaxtsxcced",
        },
      });

      let info = await transporter.sendMail({
        to: email,
        subject: "Password Reset",
        text: "Your new password",
        html: `<h1>Your reset LInk</h1> <br><a href='http://localhost:3000/reset-password/${token}'><span>Reset LInk</span></a>`,
      });

      return res.status(200).json(info);
    } catch (error) {
      return res.status(200).json(error);
    }
  } else {
    return res.status(200).json({ error: "Please give any string value" });
  }
};

//Reset Password Link

export const resetLink = async (req: Request, res: Response) => {
  const { userId, password } = req.body;

  if (!password) {
    return res.status(400).json({ error: "Please Enter field" });
  }

  if (typeof password === "string") {
    const decoded: any = await verifyJwtToken(userId);

    try {
      const user = await prisma.user.update({
        where: {
          id: decoded.id,
        },
        data: {
          password: await passwordHasher(password),
        },
      });

      return res.status(200).json(user);
    } catch (error) {
      console.log(error);
      return res.status(400).json({ error: "Password not Updated" });
    }
  } else {
    return res.status(400).json({ error: "Please give only string value" });
  }
};
