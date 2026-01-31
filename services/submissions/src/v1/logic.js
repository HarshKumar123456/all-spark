import "dotenv/config";
import { kafka } from "../../config/v1/kafka.js";
import { publishToRedisPubSub } from "../../utils/v1/redisPublisher.js";
import { createSubmissionOfContestProblem, createSubmissionOfPracticeProblem, getAllSubmissionsForProblemByUser, getSpecificSubmissionDetails } from "./handlers/normal.js";
import { _systemSendResponseToClientThatSomethingWrongWhileGettingPracticeProblemTestCases, _systemSendResponseToClientThatContestProblemSubmissionCannotBeExecuted, _systemSendResponseToClientThatSomethingWrongWhileGettingContestProblemTestCases, _systemSendResponseToClientThatPracticeProblemSubmissionCannotBeExecuted, _systemUpdateSubmissionDetailsOfContestProblemSubmission, _systemUpdateSubmissionDetailsOfPracticeProblemSubmission } from "./handlers/_system.js";


const CURR_SERVICE_NAME = "submission-service";




const handleUnknownEvent = async (data, metadata) => {
    await publishToRedisPubSub("unknown", JSON.stringify({ data: data, metadata: metadata }));
};




const consumeEvents = async () => {
    try {


        // List of All Topics to Consume to run this Service
        const listOfTopicsToConsume = [
            // Normal User Usage Events
            "submissions.practice.create", // This Indicates That This is Practice Problem's Submission
            "submissions.contest.create", // This Indicates That This is Contest Problem's Submission
            "submissions.getSubmission", // This Indicates Get the Details of the Specific Submission 
            "submissions.getAllSubmissionsForProblem", // This Indicates Get All the Submissions Made by the User For Specific Problem

            // Control Panel User Usage Events


            // Other Services' Event Update Events
            "judges.execution.practice.complete",
            "judges.execution.contest.complete",

            "judges.execution.practice.corrupt",
            "judges.execution.contest.corrupt",

            "problems.practiceSubmission.getTestCases.corrupt",
            "problems.contestSubmission.getTestCases.corrupt",
        ];



        // List of Functions that will be used for processing the events
        const handlingFunctions = {
            // Normal User Usage Events
            "submissions.practice.create": createSubmissionOfPracticeProblem,
            "submissions.contest.create": createSubmissionOfContestProblem,
            "submissions.getSubmission": getSpecificSubmissionDetails,
            "submissions.getAllSubmissionsForProblem": getAllSubmissionsForProblemByUser,

            // Control Panel User Usage Events


            // Other Services' Event Update Events
            "judges.execution.practice.complete": _systemUpdateSubmissionDetailsOfPracticeProblemSubmission,
            "judges.execution.contest.complete": _systemUpdateSubmissionDetailsOfContestProblemSubmission,

            "judges.execution.practice.corrupt": _systemSendResponseToClientThatPracticeProblemSubmissionCannotBeExecuted,
            "judges.execution.contest.corrupt": _systemSendResponseToClientThatContestProblemSubmissionCannotBeExecuted,

            "problems.practiceSubmission.getTestCases.corrupt": _systemSendResponseToClientThatSomethingWrongWhileGettingPracticeProblemTestCases,
            "problems.contestSubmission.getTestCases.corrupt":  _systemSendResponseToClientThatSomethingWrongWhileGettingContestProblemTestCases,

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