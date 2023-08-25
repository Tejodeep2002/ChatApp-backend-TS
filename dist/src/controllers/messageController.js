"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchMessage = exports.sendNewMessage = void 0;
const client_1 = require("@prisma/client");
const messageClient = new client_1.PrismaClient().message;
const chatClient = new client_1.PrismaClient().chat;
const sendNewMessage = async (req, res) => {
    const { chatId, content } = req.body;
    if (!chatId || !content) {
        return res.status(400).json({ error: "Please Fill all the fields" });
    }
    if (typeof chatId === "string" && typeof content === "string") {
        try {
            const message = await messageClient.create({
                data: {
                    sender: {
                        connect: { id: req.user.id },
                    },
                    content,
                    chat: {
                        connect: { id: chatId },
                    },
                },
                select: {
                    id: true,
                    sender: {
                        select: {
                            id: true,
                            name: true,
                            image: true,
                        },
                    },
                    content: true,
                    createdAt: true,
                    updatedAt: true,
                },
            });
            const ChatUpdate = await chatClient.update({
                where: {
                    id: chatId,
                },
                data: {
                    latestMessage: {
                        connect: {
                            id: message.id,
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
                    latestMessage: {
                        select: {
                            id: true,
                        },
                    },
                    createdAt: true,
                    updatedAt: true,
                },
            });
            const response = { ...message, chat: ChatUpdate };
            return res.status(200).json(response);
        }
        catch (error) {
            return res.status(404).json({ error: "Message sent failed" });
        }
    }
    else {
        return res.status(400).json({ error: "Please give only string value" });
    }
};
exports.sendNewMessage = sendNewMessage;
const fetchMessage = async (req, res) => {
    const query = req.query.chatId;
    if (typeof query !== "string" || query === "") {
        return res.status(400).json({ error: "Please give only string value" });
    }
    try {
        const allMessage = await messageClient.findMany({
            where: {
                chatMessageId: query,
            },
            orderBy: {
                createdAt: "desc",
            },
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
        });
        return res.status(400).json(allMessage);
    }
    catch (error) {
        return res.status(400).json(error);
    }
};
exports.fetchMessage = fetchMessage;
