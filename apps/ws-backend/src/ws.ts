import { WebSocketServer, WebSocket } from "ws";
import jwt, { JwtPayload } from "jsonwebtoken";
import { prismaClient } from "@repo/db/db";

const wss = new WebSocketServer({ port: 8080 });

interface users {
  rooms: string[];
  ws: WebSocket;
  userId: string;
}
const users: users[] = [];
wss.on("connection", async function connection(ws, request) {
  const url = request.url;
  if (!url) {
    return;
  }
  const queryparams = new URLSearchParams(url.split("?")[1]);
  const token = queryparams.get("token") || "";
  const decoded = jwt.verify(token, "hello") as JwtPayload;
  if (!decoded || !decoded.userId) {
    ws.close();
    return;
  }
  const userId = decoded.userId as string;
  users.push({
    userId,
    rooms: [],
    ws,
  });
  ws.on("message", async function message(data) {
    let parsedData: any;
    try {
      if (typeof data === "string") {
        parsedData = JSON.parse(data);
      } else {
        parsedData = JSON.parse(data.toString());
      }
    } catch (error) {
      console.error("Failed to parse message:", error);
      return;
    }

    if (!parsedData || !parsedData.type) {
      return;
    }

    if (parsedData.type === "join_room") {
      const user = users.find((x) => x.ws === ws);
      if (user && parsedData.roomId) {
        user.rooms.push(parsedData.roomId);
      }
    }
    if (parsedData.type === "leave_room") {
      const user = users.find((x) => x.ws === ws);
      if (user && parsedData.room) {
        user.rooms = user.rooms.filter((x) => x !== parsedData.room);
      }
    }
    const roomId = parsedData.roomId;
    const message = parsedData.message;

    await prismaClient.chat.create({
      data: {
        roomId: roomId,
        message,
        userId,
      },
    });
    users.forEach((user) => {
      if (user.rooms.includes(roomId)) {
        user.ws.send(
          JSON.stringify({
            type: "chat",
            message,
            roomId,
          })
        );
      }
    });
  });
});
