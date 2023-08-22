"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authentication = void 0;
const token_1 = require("../config/token/token");
const client_1 = require("@prisma/client");
const authentication = async (req, res, next) => {
    let token;
    const UserClient = new client_1.PrismaClient().user;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(" ")[1];
            const decoded = (0, token_1.verifyJwtToken)(token);
            if (typeof decoded === "string") {
                const user = await UserClient.findUnique({
                    where: {
                        id: decoded,
                    },
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        pic: true,
                        createdAt: true,
                        updatedAt: true,
                    },
                });
                console.log(user);
            }
            //   return user;
        }
        catch (error) {
            return false;
        }
        //decode token id
        const decoded = (0, token_1.verifyJwtToken)(token);
    }
};
exports.authentication = authentication;
