const { dbUsers } = require("../db/users");
const { getConnectedUsers } = require("../tools/socket");

const onUserReconnect = (socket, io) => {
  // I should add the user massage history - but that another feature to think and handle (no time)
  socket.on("reconnect-user", async (user) => {
    let foundUser;
    try {
      foundUser = await dbUsers().getUserById(user.id);
    } catch (error) {
      // taking chance here, if users name taken while he was disconnected
      foundUser = await dbUsers().addUser(user);
    }
    socket.emit("user-data", foundUser);

    socket.data.user = foundUser;

    io.emit("connected-users", getConnectedUsers(io));
  });
};

module.exports = {
  onUserReconnect,
};
