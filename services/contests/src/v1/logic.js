import "dotenv/config";
import { kafka } from "../../config/v1/kafka.js";
import { publishToRedisPubSub } from "../../utils/v1/redisPublisher.js";
import { controlCreateContest, controlDeleteContest, controlGetSpecificContestDetails, controlSearchContests, controlUpdateContest } from "./handlers/control.js";
import { getAllContests, getSpecificContestDetails, registerForContest, searchContests, startContest } from "./handlers/normal.js";



const DEFAULT_PARTITIONS_OF_KAFKA_TOPICS = process.env.DEFAULT_PARTITIONS_OF_KAFKA_TOPICS || 4;
const CURR_SERVICE_NAME = "contest-service";


// PLEASE NOTE: CACHING is YET TO BE IMPLEMENTED


const handleUnknownEvent = async (data, metadata) => {
    await publishToRedisPubSub("unknown", JSON.stringify({ data: data, metadata: metadata }));
};




const consumeEvents = async () => {
    try {


        // List of All Topics to Consume to run this Service
        const listOfTopicsToConsume = [
            // Normal User Usage Events
            "contests.search",
            "contests.getAllContests",
            "contests.getContest",
            "contests.register",
            "contests.startContest",

            // Control Panel User Usage Events
            "contests.control.search",
            "contests.control.getContest",
            "contests.control.create",
            "contests.control.update",
            "contests.control.delete",

            // Other Services' Event Update Events
        ];



        // List of Functions that will be used for processing the events
        const handlingFunctions = {
            // Normal User Usage Events
            "contests.search": searchContests,
            "contests.getAllContests": getAllContests,
            "contests.getContest": getSpecificContestDetails,
            "contests.register": registerForContest,
            "contests.startContest": startContest,

            // Control Panel User Usage Events
            "contests.control.search": controlSearchContests,
            "contests.control.getContest": controlGetSpecificContestDetails,
            "contests.control.create": controlCreateContest,
            "contests.control.update": controlUpdateContest,
            "contests.control.delete": controlDeleteContest,

            // Other Services' Event Update Events
        };

        const consumer = kafka.consumer({ groupId: CURR_SERVICE_NAME });
        await consumer.connect();

        await consumer.subscribe({ topics: listOfTopicsToConsume, });

        await consumer.run({
            eachMessage: async ({ topic, partition, message, heartbeat, pause }) => {
                console.log(
                    `${CURR_SERVICE_NAME}: [${topic}]: PART:${partition}:`,
                    message.value.toString()
                );

                const info = JSON.parse(message.value);
                const { data, metadata } = info;



                // Process the Event
                if (handlingFunctions[topic]) {
                    await handlingFunctions[topic](data, metadata);
                }
                else {
                    await handleUnknownEvent(data, metadata);
                }


                // // Handle Sending response back to the user


                // // Publish the Final Response to the Redis Pub/Sub and Then Redis Pub/Sub & Websocket will handle the delivery of the final result to the respective client
                // await publishToRedisPubSub("response", JSON.stringify({ data: data, metadata: metadata }));

            },
        });
    } catch (error) {
        console.log("Error: ", error);
        console.log("Something went wrong while consuming the Creating event....");
    }
};


export default consumeEvents;