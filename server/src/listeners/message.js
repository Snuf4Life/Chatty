const { dbMessages } = require("../db/messages");
const { createFakeChattyMessage } = require("../bot/message");
const { generateID } = require("../tools/uuid");

const onUserMessage = (socket, io) => {
  socket.on("user-message", async (message) => {
    const newMessage = await dbMessages().addMessage(message);
    io.emit("all-message", newMessage);
    searchForAnswer(io, newMessage);
  });
};

const searchForAnswer = async (io, message) => {
  if (message.type === "general" || message.type === "question") {
    const questionMessage = await dbMessages().searchMessage(
      { text: message.text },
      { type: "question" }
    );

    if (questionMessage) {
      const answerMessage = await dbMessages().searchMessage(
        { answeredMessageId: questionMessage.id },
        { type: "answer" }
      );

      // this is not a good solution, when I'll have more data (like millions of messages) it won't be quick as it now.
      // but for now lets do a delay, cause chatty answers instantly
      if (answerMessage)
        setTimeout(() => {
          io.emit(
            "all-message",
            createFakeChattyMessage(answerMessage.text, "answer")
          );
        }, 1000);
    }
  }
};

const onWelcomeMessage = (socket) => {
  socket.on("welcome-message", async (message) => {
    const newMessage = {
      ...message,
      id: generateID(),
      timestamp: new Date(),
    };
    socket.emit("self-message", newMessage);
  });
};

module.exports = {
  onUserMessage,
  onWelcomeMessage,
};
