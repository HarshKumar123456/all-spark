import "dotenv/config";
import express from "express";
import http from "http";
import path, { resolve } from "path";
import { v4 as uuidv4 } from "uuid";

import cors from "cors";

// Importing the Runtime Configurations for API functioning Version 1
import { initializeTopics } from "./utils/v1/kafkaAdmin.js";
import { connectProducer, sendEvent } from "./utils/v1/kafkaProducer.js";
import { createRedisPubSubSubscribers } from "./utils/v1/redisSubscriber.js";
import { clientToWebSocketMap, createWebSocketServer } from "./utils/v1/webSocket.js";

// Importing the Routers for different Routes Access Version 1
import authRouter from "./routes/v1/auth.js";
import contestsRouter from "./routes/v1/contests.js";
import permissionsRouter from "./routes/v1/permissions.js";
import problemsRouter from "./routes/v1/problems.js";
import specialAccessRouter from "./routes/v1/special-access.js";
import submissionRouter from "./routes/v1/submissions.js";
import supportTicketsRouter from "./routes/v1/support-tickets.js";
import usersRouter from "./routes/v1/users.js";
import { clientConnectedOrNotMiddleware } from "./middlewares/v1/websocket.js";

const PORT = process.env.PORT || 8000;
const DEFAULT_PARTITIONS_OF_KAFKA_TOPICS = process.env.DEFAULT_PARTITIONS_OF_KAFKA_TOPICS || 4;

const app = express();
const server = http.createServer(app);


const initialConfigurations = async () => {
  try {

    // Initialize the Kafka Topics
    await initializeTopics();

    // Connect the Producer
    await connectProducer();

  } catch (error) {
    console.log("Error:", error);
    console.log("Something went wrong while setting up the Initial Configurations....");
  }

};




// Middlewares -----------------------

// For Cross Origin Resource Sharing
app.use(cors());

// To access req.body
app.use(express.json());

// To Make Sure Client Is Connected Via Websocket
app.use( "/api/v1", clientConnectedOrNotMiddleware);


// Web Socket Connection Configuration
// WS server
const wss = createWebSocketServer(server);
app.set("wss", wss);


// Create the Redis Pub/Sub Subscribers so that final response of the Query of REST API Endpoints can be sent
createRedisPubSubSubscribers(["response"], (channel, msg) => {
  console.log("Got message: ", msg, " from the channel: ", channel);

  const messageFromChannel = JSON.parse(msg);
  console.log("Got Parsed the Message: ", messageFromChannel);
  // const againParsedMessageFromChannel = JSON.parse(messageFromChannel);
  // console.log("Got Again Parsed the Message: ", againParsedMessageFromChannel);

  const { data, metadata } = messageFromChannel;
  console.log("We have got the data: ", data, "and the metadata: ", metadata);

  const { requestId, clientId } = metadata;

  const socket = clientToWebSocketMap.get(clientId);
  if (socket && socket.readyState === WebSocket.OPEN) {
    console.log("Client is Connected thus sending the response: ", JSON.stringify(({ requestId, data, metadata })));
    socket.send(JSON.stringify({ type: channel, data, metadata }));
  }
  else {
    console.log("Client is Not Connected thus not sending the response: ", JSON.stringify(({ requestId, data, metadata })));
  }

});



// Routes

// To access different Routes of Version 1
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/contests", contestsRouter);
app.use("/api/v1/permissions", permissionsRouter);
app.use("/api/v1/problems", problemsRouter);
app.use("/api/v1/special-access", specialAccessRouter);
app.use("/api/v1/submissions", submissionRouter);
app.use("/api/v1/support-tickets", supportTicketsRouter);
app.use("/api/v1/users", usersRouter);


// By Default Send this index.html as a response if no routes above matched 
app.get("/", async (req, res) => {
  res.sendFile(path.resolve("./index.html"));
});

// Just To Test Remove It
app.get("/default", async (req, res) => {
  try {
    const clientId = req.get("client-id");
    const requestId = uuidv4();
    const createdAt = (new Date()).toISOString();

    const data = {
      message: "The Default Route is Accessed Successfully....",
      success: true,
    };

    const metadata = {
      clientId: clientId,
      requestId: requestId,
      createdAt: createdAt,
      updatedAt: (new Date()).toISOString(),
    };

    const topicOnWhichToBePublished = "request";
    const partitionOnWhichToBePublished = (Math.floor(40 * (Math.random()))) % DEFAULT_PARTITIONS_OF_KAFKA_TOPICS;
    await sendEvent(topicOnWhichToBePublished, partitionOnWhichToBePublished, data, metadata);

    return res.status(202).json({
      success: true,
      message: "Success in accessing the Default Route....",
    });
  } catch (error) {
    console.log(error);
    console.log("Something went wrong while accessing the /default route....");

    return res.status(500).json({
      success: false,
      message: "Error in accessing the /default Route....",
    });
  }
});

server.listen(PORT, async () => {

  console.log("API GW: Listening on the Port: ", PORT, `http://localhost:${PORT}`);

  await initialConfigurations();

});