import "dotenv/config";
import express from "express";
import http from "http";

import initializeTopics from "./src/initializeTopics.js";


import cors from "cors";


const PORT = process.env.PORT || 9000;
const DEFAULT_PARTITIONS_OF_KAFKA_TOPICS = process.env.DEFAULT_PARTITIONS_OF_KAFKA_TOPICS || 4;

const app = express();
const server = http.createServer(app);



// Middlewares -----------------------

// For Cross Origin Resource Sharing
app.use(cors());

// To access req.body
app.use(express.json());


// By Default Send this index.html as a response if no routes above matched 
app.get("/", async (req, res) => {
    res.status(200).json({
        message: "Hello I am Queue Used For ADMIN Operations",
        success: true,
    })
});

app.get("/new", async (req, res) => {
    res.status(200).json({
        message: "Main Hoon ek udta robot jiska naam hai doraemon",
        success: true,
    })
});


server.listen(PORT, async () => {

    console.log("QUEUE: Listening on the Port: ", PORT, `http://localhost:${PORT}`);
    await initializeTopics();

});