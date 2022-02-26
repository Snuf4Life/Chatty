const { dbUsers } = require("../db/users");
const { ConflictError } = require("../db/errors");
const { createFakeChattyMessage } = require("../bot/message");
const { getConnectedUsers } = require("../tools/socket");

const onUserLogin = (socket, io) => {
  socket.on("user-login", async (username) => {
    try {
      const user = await dbUsers().addUser({
        username,
      });

      socket.data.user = user;

      socket.emit("user-data", user);
      const message = createFakeChattyMessage(
        `Welcome to Chatty!
        \nI'm new in town, but I'm a quick learner.
        \nYou can ask question by marking them as question (right side of text input), so I can learn to answer them in the future.
        \nAlso you can answer others questions by clicking the answer button, like in this message.
        \nTry it out!😃`,
        "welcome"
      );

      socket.emit("self-message", message);
      io.emit("connected-users", getConnectedUsers(io));

      socket.broadcast.emit(
        "broadcast-message",
        createFakeChattyMessage(
          `${user.username} has been connected! greet him with love!`
        )
      );
    } catch (error) {
      if (error instanceof ConflictError)
        socket.emit("user-login-failed", error.message);
      else throw error;
    }
  });
};

module.exports = {
  onUserLogin,
};
