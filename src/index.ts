import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes";
import chatRoutes from "./routes/chatRoutes";
import messageRoutes from "./routes/messageRoutes";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";

const app = express();

dotenv.config();

app.use(express.json()); //to accept JSON data

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

app.use(cookieParser());

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server Run on PORT ${PORT}`);
});

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
  },
});

io.on("connection", (socket) => {
  console.log("New Socket connected");
  socket.on("setup", (userData) => {
    socket.join(userData.id);
    socket.emit("connected");
    console.log("User connected" + userData.id);
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room: " + room);
  });

  socket.on("new message", (newMessageReceived) => {
    const chat = newMessageReceived.chat;

    if (!chat.users) return console.log("Chat User not defined");

    chat.users.map((user: any) => {
      if (user.id === newMessageReceived.sender.id) {
        return;
      }
      console.log(newMessageReceived);
      console.log(user.id);
      socket.to(user.id).emit("message received", newMessageReceived);
    });
  });

  socket.on("disconnect", () => {
    console.log("A user Disconnected");
  });
});
