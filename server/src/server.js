import http from "http";
import { Server } from "socket.io";
import app from "./app.js";
import { socketCorsOrigin } from "./config/cors.js";
import connectDB from "./config/db.js";
import { setIO } from "./config/socket.js";

const port = process.env.PORT || 5000;
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: socketCorsOrigin,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"]
  }
});

setIO(io);

io.on("connection", (socket) => {
  socket.on("join", (userId) => {
    if (userId) socket.join(userId);
  });
});

connectDB().then(() => {
  server.listen(port, () => {
    console.log(`Smart Home API running on port ${port}`);
  });
});
