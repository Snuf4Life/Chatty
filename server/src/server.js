const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(
  server,
  process.env.NODE_ENV === "production"
    ? {}
    : {
        cors: {
          origin: "*",
        },
      }
);

// app.use("/", express.static(path.join(__dirname, "/dist")));
// app.get("/", (req, res) => {
//   res.sendFile(path.join(__dirname, "/dist/index.html"));
// });

module.exports = {
  app,
  server,
  io,
};
