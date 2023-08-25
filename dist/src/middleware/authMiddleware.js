"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authentication = void 0;
const client_1 = require("@prisma/client");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authentication = async (req, res, next) => {
    const secretKey = process.env.JWT_SECRET;
    let token;
    const UserClient = new client_1.PrismaClient().user;
    if (req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
        //decode token id\
        try {
            if (secretKey !== undefined) {
                const decoded = jsonwebtoken_1.default.verify(token, secretKey);
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
                    }
                    else {
                        return res.status(400).json({ error: "User not authorized" });
                    }
                }
                next();
            }
        }
        catch (error) {
            return res.status(400).json(error);
        }
    }
    if (!token) {
        res.status(401);
        throw new Error("Not authorized, no token");
    }
};
exports.authentication = authentication;
