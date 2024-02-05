const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

const { Kafka, Partitioners } = require("kafkajs");

const kafka = new Kafka({
  clientId: "my-app",
  brokers: ["localhost:9092"],
});
const producer = kafka.producer();
const partitioner = Partitioners.DefaultPartitioner;
const consumer = kafka.consumer({ groupId: "test-group" });

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

// tạo ra
app.post("/send", async (req, res) => {
  console.log("gủi đi", req.body.message); // payload {"message": "ww"}
  await producer.connect();
  await producer.send({
    topic: "Test",
    messages: [{ value: JSON.stringify(req.body) }],
  });

  await producer.disconnect();
  res.send("send");
});

app.get("/partitioner", async (req, res) => {
  await producer.connect();
  await producer.send({
    topic: "partitioner",
    messages: [
      { key: "key1", value: "Hello World!" },
      { key: "key2", value: "Another message" },
    ],
    partitioner: partitioner,
  });

  await producer.disconnect();
  res.send("partitioner");
});

app.listen(3000, () => {
  console.log(`Server is running on port 3000.`);
});
