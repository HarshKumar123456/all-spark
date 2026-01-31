import "dotenv/config";
import express from "express";

// Importing the Runtime Configurations for API functioning Version 1
import { initializeTopics } from "./utils/v1/kafkaAdmin.js";
import { connectProducer } from "./utils/v1/kafkaProducer.js";
import consumeEvents from "./src/v1/logic.js";

const app = express();

const PORT = process.env.PORT || 3500;


const initialConfigurations = async () => {
  try {

    // Initialize the Kafka Topics
    await initializeTopics();

    // Connect the Producer
    await connectProducer();

    // Start Consuming the Events
    await consumeEvents();

  } catch (error) {
    console.log("Error:", error);
    console.log("Something went wrong while setting up the Initial Configurations....");
  }

};


// Health Check Route
app.get("/health", (req, res) => {
    res.status(200).json({
      success: true,
      message: "Successfully running Judge Service....",
    });
});


app.listen(PORT,async () => {
    console.log("Judge Service: Listening on the Port: ", PORT, `http://localhost:${PORT}`);
    await initialConfigurations();
});