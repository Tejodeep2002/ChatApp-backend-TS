"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetLink = exports.forgetPassword = exports.userInfo = exports.searchUser = exports.loginUser = exports.registerUser = void 0;
const client_1 = require("@prisma/client");
const hasher_1 = require("../config/passwordHasher/hasher");
const token_1 = require("../config/token/token");
const nodemailer_1 = __importDefault(require("nodemailer"));
const UserClient = new client_1.PrismaClient().user;
//register User
const registerUser = async (req, res) => {
    const { name, email, password, image } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ error: "Please Enter all fields" });
    }
    if (typeof name === "string" &&
        typeof email === "string" &&
        typeof password === "string") {
        const userExist = await UserClient.findUnique({
            where: {
                email,
            },
        });
        if (userExist) {
            return res.status(400).json({ error: "User already Exist" });
        }
        const hashedPassword = await (0, hasher_1.passwordHasher)(password);
        const user = await UserClient.create({
            data: {
                name,
                email,
                password: hashedPassword,
                image
            },
        });
        if (user) {
            return res.status(200).json({ success: " User Created" });
        }
        else {
            return res.status(400).json({ error: "failed to create User" });
        }
    }
    else {
        return res.status(400).json({ error: "Please give only string value" });
    }
};
exports.registerUser = registerUser;
//Login User
const loginUser = async (req, res) => {
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
        if (user && (await (0, hasher_1.passwordCompare)(password, user.password))) {
            return res.status(400).json({
                id: user.id,
                email: user.email,
                name: user.name,
                images: user.image,
                accessToken: (0, token_1.generateJwtToken)(user.id),
            });
        }
        else {
            return res.status(400).json({ error: "User Not found" });
        }
    }
    else {
        return res.status(400).json({ error: "Please give only string value" });
    }
};
exports.loginUser = loginUser;
// Search User
const searchUser = async (req, res) => {
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
                image: true,
            },
        });
        console.log(users);
        return res.status(200).json(users);
    }
    catch (error) {
        return res.status(400).json({ error: "Error happens" });
    }
};
exports.searchUser = searchUser;
//Get User Info
const userInfo = async (req, res) => {
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
                image: true,
            },
        });
        return res.status(200).json(user);
    }
    catch (error) {
        return res.status(400).json({ error: "UserInfo Error happens" });
    }
};
exports.userInfo = userInfo;
//Forget Password
const forgetPassword = async (req, res) => {
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
        const token = await (0, token_1.resetJwtToken)(user.id);
        try {
            //Connect SMPT
            const transporter = await nodemailer_1.default.createTransport({
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
        }
        catch (error) {
            return res.status(200).json(error);
        }
    }
    else {
        return res.status(200).json({ error: "Please give any string value" });
    }
};
exports.forgetPassword = forgetPassword;
//Reset Password Link
const resetLink = async (req, res) => {
    const { userId, password } = req.body;
    if (!password) {
        return res.status(400).json({ error: "Please Enter field" });
    }
    if (typeof password === "string") {
        const decoded = await (0, token_1.verifyJwtToken)(userId);
        try {
            const user = await UserClient.update({
                where: {
                    id: decoded.id,
                },
                data: {
                    password: await (0, hasher_1.passwordHasher)(password),
                },
            });
            return res.status(200).json(user);
        }
        catch (error) {
            console.log(error);
            return res.status(400).json({ error: "Password not Updated" });
        }
    }
    else {
        return res.status(400).json({ error: "Please give only string value" });
    }
};
exports.resetLink = resetLink;
