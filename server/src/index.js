// ### local entry point index file ###;
require("dotenv").config();
const path = require("path");

const { server, io, app } = require("./server");
const { eventHandlers } = require("./listeners");
const { EsClient } = require("./db/elasticsearch");
const { setData } = require("./db/startup");

const PORT = process.env.PORT || 3000;

const main = async () => {
  const { client: esClient } = new EsClient();

  try {
    await esClient.ping({ pretty: true });
    console.log("elasticsearch has connection!");
  } catch (error) {
    console.error("FATAL - elasticsearch has no connection", error);
    throw error; // do not continue the code, elasticsearch connection is mandatory to run the project
  }

  await setData();

  io.on("connection", (socket) => {
    eventHandlers.forEach((listener) => listener(socket, io));
  });

  server.listen(PORT, () => {
    console.log(`🚀 server listening on port: ${PORT}`);
  });

  server.on("close", async () => {
    console.log("closing elasticsearch connection...");
    await esClient.close();
    console.log("connection closed");
  });
};

if (require.main === module) main().catch(console.trace);
