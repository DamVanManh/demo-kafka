const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

const { Kafka } = require("kafkajs");

const kafka = new Kafka({
  clientId: "my-app2",
  brokers: ["localhost:9092"],
});

// test chung groupId
const consumer = kafka.consumer({ groupId: "test-group" });

// // test khác groupId
// const consumer = kafka.consumer({ groupId: "test-group2" });

// lắng nghe
const consumerSetup = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: "Test" });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log("nhận dc", {
        value: JSON.parse(message.value.toString()),
      });
    },
  });
};
consumerSetup().catch((e) => {
  console.log("error setup consumer", e);
});

const consumerPartitionerSetup = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: "partitioner" });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log("topic", {
        value: topic,
      });
      console.log("partition", {
        value: partition,
      });
      console.log("message", {
        value: message,
      });
    },
  });
};
consumerPartitionerSetup().catch((e) => {
  console.log("error setup consumer", e);
});

app.listen(3001, () => {
  console.log(`Server is running on port 3001.`);
});
