"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.groupRemoveUser = exports.groupAddUser = exports.groupUpdate = exports.createGroup = exports.fetchChats = exports.accessChat = void 0;
const client_1 = require("@prisma/client");
const chatClient = new client_1.PrismaClient().chat;
//Access Chat or Create new Chat
const accessChat = async (req, res) => {
    const { userId } = req.body;
    if (typeof userId === "string") {
        if (!userId) {
            return res
                .status(400)
                .json({ error: "UserId param not sent with request" });
        }
        const isChat = await chatClient.findMany({
            where: {
                isGroupChat: false,
                usersId: { hasEvery: [req.user.id, userId] },
            },
            select: {
                id: true,
                chatName: true,
                isGroupChat: true,
                users: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        image: true,
                        createdAt: true,
                        updatedAt: true,
                    },
                },
                latestMessage: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        if (isChat.length > 0) {
            return res.status(200).json(isChat[0]);
        }
        try {
            const createdChat = await chatClient.create({
                data: {
                    chatName: "sender",
                    isGroupChat: false,
                    users: {
                        connect: [
                            {
                                id: req.user.id,
                            },
                            {
                                id: userId,
                            },
                        ],
                    },
                },
            });
            const FullChat = await chatClient.findMany({
                where: {
                    id: createdChat.id,
                },
                select: {
                    id: true,
                    chatName: true,
                    isGroupChat: true,
                    users: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            image: true,
                            createdAt: true,
                            updatedAt: true,
                        },
                    },
                    createdAt: true,
                    updatedAt: true,
                },
            });
            return res.status(200).json(FullChat[0]);
        }
        catch (error) {
            return res
                .status(401)
                .json({ error: "Error Happens !! Chat not created" });
        }
    }
    else {
        return res.status(400).json({ error: "Please give only string value" });
    }
};
exports.accessChat = accessChat;
//Fetch Chats
const fetchChats = async (req, res) => {
    try {
        const isChat = await chatClient.findMany({
            where: {
                usersId: { has: req.user.id },
            },
            orderBy: {
                updatedAt: "asc",
            },
            select: {
                id: true,
                chatName: true,
                isGroupChat: true,
                users: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        image: true,
                        createdAt: true,
                        updatedAt: true,
                    },
                },
                latestMessage: {
                    select: {
                        id: true,
                        sender: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                image: true,
                            },
                        },
                        content: true,
                        chat: {
                            select: {
                                id: true,
                            },
                        },
                        createdAt: true,
                        updatedAt: true,
                    },
                },
                groupAdmin: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        image: true,
                    },
                },
                createdAt: true,
                updatedAt: true,
            },
        });
        return res.status(200).json(isChat);
    }
    catch (error) {
        return res.status(400).json({ error: "Error Happens" });
    }
};
exports.fetchChats = fetchChats;
//Create Group
const createGroup = async (req, res) => {
    const { name, description, groupImage, users } = req.body;
    if (!name || !users) {
        return res.status(400).json({ error: "Please Fill all the fields" });
    }
    if (typeof name === "string" &&
        typeof description === "string" &&
        typeof groupImage === "string") {
        if (users.length < 1) {
            return res
                .status(400)
                .json({ error: "1 users are required to form a group chat" });
        }
        users.push(req.user.id);
        try {
            const groupChat = await chatClient.create({
                data: {
                    chatName: name,
                    isGroupChat: true,
                    description,
                    groupImage,
                    users: {
                        connect: users.map((usersId) => ({ id: usersId })),
                    },
                    groupAdmin: {
                        connect: { id: req.user.id },
                    },
                },
            });
            const FullChat = await chatClient.findMany({
                where: {
                    id: groupChat.id,
                },
                select: {
                    id: true,
                    chatName: true,
                    isGroupChat: true,
                    users: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            image: true,
                            createdAt: true,
                            updatedAt: true,
                        },
                    },
                    groupAdmin: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            image: true,
                            createdAt: true,
                            updatedAt: true,
                        },
                    },
                    createdAt: true,
                    updatedAt: true,
                },
            });
            return res.status(200).json(FullChat[0]);
        }
        catch (error) {
            console.log(error);
            return res
                .status(400)
                .json({ error: "Error Happened!! Group not created Error Happened" });
        }
    }
    else {
        return res.status(400).json({ error: "Please give only string value" });
    }
};
exports.createGroup = createGroup;
// Group Update
const groupUpdate = async (req, res) => {
    const { chatId, name, description, groupImage, groupAdmin } = req.body;
    if (!chatId || !name || !description || !groupImage || !groupAdmin) {
        return res.status(400).json({ error: "Please Fill all the fields" });
    }
    if (typeof chatId === "string" &&
        typeof name === "string" &&
        typeof description === "string" &&
        typeof groupImage === "string" &&
        typeof groupAdmin === "string") {
        console.log(chatId, name, groupImage, groupAdmin);
        try {
            const isChat = await chatClient.update({
                where: {
                    id: chatId,
                },
                data: {
                    chatName: name,
                    description,
                    groupImage,
                    groupAdmin: {
                        connect: { id: groupAdmin },
                    },
                },
                select: {
                    id: true,
                    chatName: true,
                    isGroupChat: true,
                    users: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            image: true,
                            createdAt: true,
                            updatedAt: true,
                        },
                    },
                    groupAdmin: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            image: true,
                            createdAt: true,
                            updatedAt: true,
                        },
                    },
                    createdAt: true,
                    updatedAt: true,
                },
            });
            return res.status(200).json(isChat);
        }
        catch (error) {
            return res.status(200).json({ error: "Error Happened! Update failed" });
        }
    }
    else {
        return res.status(400).json({ error: "Please give only string value" });
    }
};
exports.groupUpdate = groupUpdate;
//Group Add User
const groupAddUser = async (req, res) => {
    const { chatId, userId } = req.body;
    if (!chatId || !userId) {
        return res.status(400).json({ error: "Please Fill all the fields" });
    }
    if (typeof chatId === "string" && typeof userId === "string") {
        try {
            const addUser = await chatClient.update({
                where: {
                    id: chatId,
                },
                data: {
                    users: {
                        connect: {
                            id: userId,
                        },
                    },
                },
                select: {
                    id: true,
                    chatName: true,
                    isGroupChat: true,
                    users: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            image: true,
                            createdAt: true,
                            updatedAt: true,
                        },
                    },
                    groupAdmin: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            image: true,
                            createdAt: true,
                            updatedAt: true,
                        },
                    },
                    createdAt: true,
                    updatedAt: true,
                },
            });
            return res.status(200).json(addUser);
        }
        catch (error) {
            return res.status(404).json({ error: "Error Happened! Update failed" });
        }
    }
    else {
        return res.status(400).json({ error: "Please give only string value" });
    }
};
exports.groupAddUser = groupAddUser;
//Group Remove User
const groupRemoveUser = async (req, res) => {
    const { chatId, userId } = req.body;
    if (!chatId || !userId) {
        return res.status(400).json({ error: "Please Fill all the fields" });
    }
    if (typeof chatId === "string" && typeof userId === "string") {
        try {
            const removeUser = await chatClient.update({
                where: {
                    id: chatId,
                },
                data: {
                    users: {
                        disconnect: {
                            id: userId,
                        },
                    },
                },
                select: {
                    id: true,
                    chatName: true,
                    isGroupChat: true,
                    users: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            image: true,
                            createdAt: true,
                            updatedAt: true,
                        },
                    },
                    groupAdmin: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            image: true,
                            createdAt: true,
                            updatedAt: true,
                        },
                    },
                    createdAt: true,
                    updatedAt: true,
                },
            });
            return res.status(200).json(removeUser);
        }
        catch (error) {
            return res.status(404).json({ error: "Error Happened! Update failed" });
        }
    }
    else {
        return res.status(400).json({ error: "Please give only string value" });
    }
};
exports.groupRemoveUser = groupRemoveUser;
