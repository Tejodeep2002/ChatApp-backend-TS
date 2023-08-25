import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const messageClient = new PrismaClient().message;
const chatClient = new PrismaClient().chat;

export const sendNewMessage = async (req: Request, res: Response) => {
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
    } catch (error) {
      return res.status(404).json({ error: "Message sent failed" });
    }
  } else {
    return res.status(400).json({ error: "Please give only string value" });
  }
};

export const fetchMessage = async (req: Request, res: Response) => {
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
    return res.status(200).json(allMessage);
  } catch (error) {
    return res.status(400).json(error);
  }
};
