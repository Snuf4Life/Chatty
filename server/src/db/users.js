const { generateID } = require("../tools/uuid");
const { EsClient } = require("./elasticsearch");
const { INDICES } = require("./indices");
const { ConflictError } = require("./errors");

const mapDocument = (document) => ({
  id: document._id,
  username: document._source.username,
  type: document._source.type,
});

const dbUsers = () => {
  const esClient = new EsClient().client;
  const index = INDICES.USERS;

  return {
    async getUserById(id) {
      const userDocument = await esClient.get({
        index,
        id,
      });

      if (userDocument) return mapDocument(userDocument);
    },

    async getUsers() {
      const searchResult = await esClient.search({
        index,
        query: { match_all: {} },
      });

      const userDocuments = searchResult.hits.hits;
      return userDocuments.map(mapDocument);
    },

    async removeUserById(id) {
      await esClient.delete({
        index,
        id: id,
        refresh: true,
      });
    },

    async addUser(user) {
      if (user.username.toLowerCase().includes("chatty"))
        // well, he is one of a kind!)
        throw new ConflictError(`Don't use my name please ©Chatty!`);

      // I would use Joi package to validate data before inserting it to persistent storage.
      const result = await esClient.search({
        index,
        query: {
          term: {
            "username.keyword": {
              value: user.username,
            },
          },
        },
      });

      if (!result.hits.hits.length) {
        const docId = generateID();
        await esClient.index({
          index,
          id: docId,
          document: { ...user, type: "user" },
          refresh: true,
        });
        const newUser = await this.getUserById(docId);

        return newUser;
      } else {
        throw new ConflictError("Username already exists");
      }
    },
  };
};

module.exports = { dbUsers };
