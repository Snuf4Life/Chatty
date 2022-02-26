const { dbUsers } = require("../db/users");
const { createFakeChattyMessage } = require("../bot/message");
const { getConnectedUsers } = require("../tools/socket");

const onUserDisconnect = (socket, io) => {
  socket.on("disconnect", async () => {
    if (!socket.data.user) return;
    await dbUsers().removeUserById(socket.data.user.id);

    socket.broadcast.emit(
      "broadcast-message",
      createFakeChattyMessage(
        `${socket.data.user.username} disconnected from Chatty!😭`
      )
    );
    socket.data.user = null;
    socket.broadcast.emit("connected-users", getConnectedUsers(io));
  });
};

module.exports = {
  onUserDisconnect,
};
