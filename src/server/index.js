const serve = require("koa-static-server");
const koa = require("koa");
const app = new koa();
const http = require("http");
const readline = require("readline");
const socketIO = require('socket.io');

stack = [];
let roomPatterns = {};

app.use(serve({ rootDir: "../../dist" }));

app.use(async (ctx, next) => {
  if (ctx.path !== "/") {
    await next();
  }
});

const server = http.createServer(app.callback());


const io = require("socket.io")(server);
let activeroom = null;
let usernames = [];

function initializeRoomPattern(roomName) {
  if (!roomPatterns[roomName]) {
    roomPatterns[roomName] = null;  // No pattern selected initially
  }
}
//Handling Sockets
io.on("connection", function(socket) {
  console.log('A user connected');
  socket.on('login', function({ username, room }) {
    socket.join(room);
    socket.room = room;
    initializeRoomPattern(room);  // Ensure the room is initialized
    console.log(`[Server] login: ${username} -> ${room}`);
    io.to(room).emit("users.login", { username, room });
  });

  socket.on("requestPattern", function({ pattern }) {
    if (socket.room) {
      roomPatterns[socket.room] = pattern;  // Update the room pattern
      io.to(socket.room).emit("patternUpdate", pattern);  // Broadcast the pattern to the room
      console.log(`[Server] Pattern updated in room ${socket.room}: ${JSON.stringify(pattern)}`);
    }
  });

  // Logs user out gracefully
  socket.on("logout", function() {
    console.log(`[Server] logout: ${socket.id}`);
    socket.leave(socket.room);
  });
  socket.on("disconnect", function() {
    console.log(`[Server] disconnected: ${socket.id} disconnect!`);
    socket.leave(socket.room);
  });

  // Search for all rooms
  socket.on("getRooms", function() {
    const rooms = Object.keys(roomPatterns).map(roomName => ({
      name: roomName,
      pattern: roomPatterns[roomName]
    }));
    socket.emit("rooms.list", { rooms });
  });
});


const port = 3000;
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
