const { generateID } = require("../tools/uuid");

const createFakeChattyMessage = (text, type = "general") => {
  const message = {
    timestamp: new Date(),
    id: generateID(),
    text,
    user: { username: "Chatty", type: "bot" },
    type,
  };

  return message;
};

module.exports = {
  createFakeChattyMessage,
};
