const { generateID } = require("../tools/uuid");
const { EsClient } = require("./elasticsearch");
const { INDICES } = require("./indices");

const mapDocument = (document) => ({
  id: document._id,
  text: document._source.text,
  timestamp: document._source.timestamp,
  type: document._source.type,
  answeredMessageId: document._source.answeredMessageId,
  user: document._source.user,
});

const dbMessages = () => {
  const esClient = new EsClient().client;
  const index = INDICES.MESSAGES;

  return {
    async getMessageById(id) {
      const messageDocument = await esClient.get({
        index,
        id,
      });

      if (messageDocument) return mapDocument(messageDocument);
    },

    async addMessage(message) {
      // I would use Joi package to validate data before inserting it to persistent storage.
      const docId = generateID();
      await esClient.index({
        index,
        id: docId,
        document: { ...message, timestamp: new Date() },
        refresh: true,
      });

      const newMessage = await this.getMessageById(docId);
      if (newMessage.type === "answer") {
        newMessage.answeredQuestion = await this.getMessageById(
          newMessage.answeredMessageId
        );
      }

      return newMessage;
    },

    async searchMessage(match, filter) {
      let query = { bool: { must: [{ match }] } };

      if (filter) {
        query.bool.filter = [{ term: filter }];
      }

      const res = await esClient.search({
        index,
        query,
      });

      // I added bigger then 2 cause it was hitting any score (e.g. containing one ward),
      // yet the same word search will generate different score, would investigate it, but in another time.
      // And I would do "like system" as my chat gives the ability to do more then one answer
      // for each question, so this can be a nice additional score system (text + likes).
      const highMatch = res.hits.hits.find(
        (hit) => hit._score === res.hits.max_score && hit._score > 2
      );

      if (highMatch) return mapDocument(highMatch);
    },
  };
};

module.exports = { dbMessages };
