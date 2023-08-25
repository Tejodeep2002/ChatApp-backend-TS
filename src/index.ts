import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes";
import chatRoutes from "./routes/chatRoutes";
import messageRoutes from "./routes/messageRoutes";
import cookieParser from "cookie-parser";

const app = express();

dotenv.config();

app.use(express.json()); //to accept JSON data

app.use(
  "*",
  cors({
    origin: " http://localhost:3000",
    credentials: true,
  })
);

app.use(cookieParser());

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server Run on PORT ${PORT}`);
});
