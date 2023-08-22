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

const UserClient = new PrismaClient().user;

//register User
export const registerUser = async (req: Request, res: Response) => {
  const { name, email, password, pic } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "Please Enter all fields" });
  }
  if (
    typeof name === "string" &&
    typeof email === "string" &&
    typeof password === "string"
  ) {
    const userExist = await UserClient.findUnique({
      where: {
        email,
      },
    });

    if (userExist) {
      return res.status(400).json({ error: "User already Exist" });
    }

    const hashedPassword = await passwordHasher(password);
    const user = await UserClient.create({
      data: {
        name,
        email,
        password: hashedPassword,
        pic,
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
    const user = await UserClient.findUnique({
      where: {
        email,
      },
    });

    if (user && (await passwordCompare(password, user.password))) {
      return res.status(400).json({
        id: user.id,
        email: user.email,
        name: user.name,
        images: user.pic,
        token: generateJwtToken(user.id),
      });
    } else {
      return res.status(400).json({ error: "User Not found" });
    }
  } else {
    return res.status(400).json({ error: "Please give only string value" });
  }
};

// Search User
export const searchUser = async (req: Request, res: Response) => {
  const query = req.query.search;

  if (typeof query !== "string" || query === "") {
    return res.status(400).json({ error: "Please give only string value" });
  }

  try {
    const users = await UserClient.findMany({
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
        pic: true,
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
    const user = await UserClient.findUnique({
      where: {
        id: req.user.id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        pic: true,
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
    const user = await UserClient.findUnique({
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
      const user = await UserClient.update({
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
