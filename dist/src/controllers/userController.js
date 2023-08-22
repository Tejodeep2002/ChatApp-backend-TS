"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.registerUser = void 0;
const client_1 = require("@prisma/client");
const hasher_1 = require("../config/passwordHasher/hasher");
const token_1 = require("../config/token/token");
const UserClient = new client_1.PrismaClient().user;
//register User
const registerUser = async (req, res) => {
    const { name, email, password, pic } = req.body;
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
                pic,
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
            return {
                id: user.id,
                email: user.email,
                name: user.name,
                images: user.pic,
                password: user.password,
                token: (0, token_1.generateJwtToken)(user.id),
            };
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
//Get All User
// export const getUsers = async (req: Request, res: Response) => {
//   const query = req.query.search;
//   console.log(query);
//   if (typeof query !== "string") {
//     return res.status(400).json({ error: "Please give only string value" });
//   }
//   try {
//     const users = await UserClient.findMany({
//       where: {
//         OR: [
//           {
//             name: {
//               contains: query,
//               notIn: [session.user.name],
//             },
//           },
//           {
//             email: {
//               contains: query,
//               notIn: [session.user.email],
//             },
//           },
//         ],
//       },
//       select: {
//         id: true,
//         name: true,
//         email: true,
//         pic: true,
//       },
//     });
//     return NextResponse.json(users, { status: 200 });
//   } catch (error) {
//     return NextResponse.json(error, { status: 400 });
//   }
// };
//Get User Info
//Forget Password
//Reset Password Link
