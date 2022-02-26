const { Client } = require("@elastic/elasticsearch");

class EsClient {
  static _instance;

  client;

  constructor() {
    if (EsClient._instance) {
      return EsClient._instance;
    }

    try {
      const ES_NODE = process.env.ES_PORT
        ? `http://localhost:${process.env.ES_PORT}`
        : "http://localhost:9200";

      console.log(`elasticsearch node url at ${ES_NODE}`);

      const options = {
        node: ES_NODE,
        auth: {
          username: "elastic", // default user name
          password: process.env.ELASTIC_PASSWORD, // I changed it cause the default wasn't working
        },
      };

      if (process.env.NODE_ENV === "development")
        options.tls = {
          rejectUnauthorized: false,
        };

      this.client = new Client(options);
      EsClient._instance = this;
    } catch (error) {
      console.error("elasticsearch client initialization failed", error);
    }
  }
}

module.exports = {
  EsClient,
};
