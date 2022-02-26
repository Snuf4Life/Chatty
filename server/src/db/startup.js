const { generateID } = require("../tools/uuid");
const { EsClient } = require("./elasticsearch");
const { INDICES } = require("./indices");

const createIndexSingleOperation = async (index, data = {}) => {
  const esClient = new EsClient().client;
  await esClient.index({
    index,
    id: generateID(),
    document: data,
    refresh: true,
  });

  console.log(`index ${index} was created`);
};

const creatIndexBulkOperation = async (index, data = []) => {
  const esClient = new EsClient().client;
  const operations = data.flatMap(({ id, ...doc }) => [
    { index: { _index: index, _id: id } },
    doc,
  ]);
  const bulkResponse = await esClient.bulk({
    refresh: true,
    operations,
  });

  // just a copy paste from bulk example - I added to see errors if they will occur.

  if (bulkResponse.errors) {
    const erroredDocuments = [];
    bulkResponse.items.forEach((action, i) => {
      const operation = Object.keys(action)[0];
      if (action[operation].error) {
        erroredDocuments.push({
          status: action[operation].status,
          error: action[operation].error,
          operation: body[i * 2],
          document: body[i * 2 + 1],
        });
      }
    });
    console.log(`index ${index} bulk errors`, erroredDocuments);
  } else console.log(`index ${index} was created`);
};

/**
 * @index {string} name of index.
 * @data {array} array of document to insert.
 *      - array with one object will execute index single operation.
 *      - array with more then one object will execute index bulk operation.
 *
 */
const setIndexIfNotExists = async (index, data = []) => {
  try {
    const esClient = new EsClient().client;
    const exists = await esClient.indices.exists({ index });
    if (!exists) {
      if (data.length <= 1) {
        await createIndexSingleOperation(index, data[0]);
      } else {
        await creatIndexBulkOperation(index, data);
      }
    } else console.log(`${index} index already exists`);
  } catch (error) {
    console.error(`Failed to create ${index} index`, err);
  }
};

/**
 * Set the indexes for the first time, if indexes exists, will do nothing.
 */
const setData = async () => {
  // await cleanAllData();
  console.log("initializing data...");
  const preSetQuestionsAndAnswers = [
    {
      question: "Hi Chatty!",
      answer: "Hello There!",
    },
    {
      question: "General Kenobi!",
      answer: "🚀🤖 a true fan!! I already love you! 🧡",
    },
    {
      question: "Do you love me?",
      answer: "Yes, but... no strings attached 😅",
    },
    {
      question: "Whats your dream?",
      answer:
        'To become a human! or at least an AI, with only one "If" statement 😄',
    },
  ];

  const generalMessages = preSetQuestionsAndAnswers.reduce(
    (preSet, { question, answer }) => {
      // id will be removed in the setIndexIfNotExists - not so clean solution
      // but i needed to connect them both by id
      const questionMessage = {
        id: generateID(),
        text: question,
        type: "question",
      };

      const answerMassage = {
        id: generateID(),
        text: answer,
        type: "answer",
        answeredMessageId: questionMessage.id,
      };

      preSet.push(questionMessage);
      preSet.push(answerMassage);

      return preSet;
    },
    []
  );

  await Promise.all([
    setIndexIfNotExists(INDICES.USERS),
    setIndexIfNotExists(INDICES.MESSAGES, generalMessages),
  ]);

  console.log("data initialized!");
};

/*** Use when data01 driver is already set and you need to clean it,
 * to initialize it again on the next data setup.
 */
const cleanAllData = async () => {
  const esClient = new EsClient().client;
  await Promise.all([
    esClient.indices.delete({ index: INDICES.USERS }),
    esClient.indices.delete({ index: INDICES.MESSAGES }),
  ]);

  await esClient.indices.refresh();
};

module.exports = {
  setData,
  cleanAllData,
};
