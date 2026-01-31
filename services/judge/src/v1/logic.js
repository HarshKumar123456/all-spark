import "dotenv/config";
import { kafka } from "../../config/v1/kafka.js";
import { publishToRedisPubSub } from "../../utils/v1/redisPublisher.js";
import { _systemDeleteContestProblemSubmissionsFromTheExecutionEngine, _systemDeletePracticeProblemSubmissionsFromTheExecutionEngine, _systemExecuteSubmissionOfContestProblem, _systemExecuteSubmissionOfPracticeProblem, _systemGetUpdatesOfTheSubmissionOfContestProblem, _systemGetUpdatesOfTheSubmissionOfPracticeProblem } from "./handlers/_system.js";


const CURR_SERVICE_NAME = "judge-service";


// PLEASE NOTE: CACHING is YET TO BE IMPLEMENTED


const handleUnknownEvent = async (data, metadata) => {
    await publishToRedisPubSub("unknown", JSON.stringify({ data: data, metadata: metadata }));
};




const consumeEvents = async () => {
    try {


        // List of All Topics to Consume to run this Service
        const listOfTopicsToConsume = [
            // Normal User Usage Events
            
            
            // Control Panel User Usage Events
            
            
            // Other Services' Event Update Events
            "judges.execution.practice.getUpdates",
            "judges.execution.contest.getUpdates",

            "judges.execution.practice.complete",
            "judges.execution.contest.complete",

            "judges.execution.practice.corrupt",
            "judges.execution.contest.corrupt",

            "problems.practiceSubmission.getTestCases.complete",
            "problems.contestSubmission.getTestCases.complete",
        ];




        // List of Functions that will be used for processing the events
        const handlingFunctions = {
            // Normal User Usage Events
            
            
            // Control Panel User Usage Events
            
            
            // Other Services' Event Update Events
            "judges.execution.practice.getUpdates": _systemGetUpdatesOfTheSubmissionOfPracticeProblem,
            "judges.execution.contest.getUpdates": _systemGetUpdatesOfTheSubmissionOfContestProblem,

            // "judges.execution.practice.complete": _systemDeletePracticeProblemSubmissionsFromTheExecutionEngine,
            // "judges.execution.contest.complete": _systemDeleteContestProblemSubmissionsFromTheExecutionEngine,

            // "judges.execution.practice.corrupt": _systemDeletePracticeProblemSubmissionsFromTheExecutionEngine,
            // "judges.execution.contest.corrupt": _systemDeleteContestProblemSubmissionsFromTheExecutionEngine,

            "problems.practiceSubmission.getTestCases.complete": _systemExecuteSubmissionOfPracticeProblem,
            "problems.contestSubmission.getTestCases.complete": _systemExecuteSubmissionOfContestProblem,
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