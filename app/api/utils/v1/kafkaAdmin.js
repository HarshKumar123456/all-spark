import "dotenv/config";
import { kafka } from "../../config/v1/kafka.js";

/* 

This file is responsible for creating the Kafka Topics for more information read Kafkajs (Library We are using to connect, configure and play with Kafka) docs

. We have created topics in one go when connected to the Kafka Instance first time for now it is handled manually to configure topics in the Kafka 
. We are using by default 4 partitions as of now if the requirements goes up than it then we can always configure the partitions' count in specific topic and to know about how to do that head over to the Kafkajs docs

*/


const defaultNumberOfPartitions = process.env.DEFAULT_PARTITIONS_OF_KAFKA_TOPICS || 4;

const hasSubArrayElements = (masterArray, subArray) => {
    // console.log("Checking the Master and Sub Array: ", masterArray, " 007 ", subArray);
    
    for(let index = 0; index < subArray.length; index++) {
        if (masterArray.includes(subArray[index]) === false) {
            // console.log("Returning false as ",  subArray[index], " not in ", masterArray);
            
            return false;
        }
    }
    // console.log("Returning true");
    return true;
};

const initializeTopics = async () => {
    try {

        // List of Topics Should be present in the Kafka Queue to make sure the API Works Correctly
        const listOfTopicsNeeded = ["request", "__consumer_offsets"];

        const admin = kafka.admin();
        console.log("Kafka Admin connecting...");
        admin.connect();
        console.log("Kafka Admin Connection Success...");

        // If Topics are not there then do create them
        const allTopics = await admin.listTopics();
        // console.log("All Kafka Topics: ", allTopics.toString(), " 007 ", allTopics);
        
        const topicsExistsAlready = await hasSubArrayElements(allTopics, listOfTopicsNeeded);

        if (topicsExistsAlready === false) {

            console.log("Creating Topics [request, ]");
            await admin.createTopics({
                topics: [
                    {
                        topic: "request",
                        numPartitions: defaultNumberOfPartitions,
                    },
                ],
            });
            console.log("Topic Created Success [request, ]");
        }

        console.log("Disconnecting Kafka Admin..");
        await admin.disconnect();

    } catch (error) {
        console.log("Error: ", error);
        console.log("Something went wrong while creating topics in kafka");

    }
};

export { initializeTopics };
