const { onUserDisconnect } = require("./disconnect");
const { onUserReconnect } = require("./reconnect");
const { onUserLogin } = require("./login");
const { onUserMessage, onWelcomeMessage } = require("./message");

module.exports = {
  eventHandlers: [
    onUserDisconnect,
    onUserLogin,
    onUserMessage,
    onWelcomeMessage,
    onUserReconnect,
  ],
};
