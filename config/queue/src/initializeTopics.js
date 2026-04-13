// File to Create All Topics
import "dotenv/config"
// import { kafka } from "./config/v1/kafka.js";
import { kafka } from "../config/v1/kafka.js";



const DEFAULT_PARTITIONS_OF_KAFKA_TOPICS = process.env.DEFAULT_PARTITIONS_OF_KAFKA_TOPICS || 8;



const initializeTopics = async () => {
    try {

        // List of Topics Should be present in the Kafka Queue to make sure the API Works Correctly
        const listOfTopicsNeeded = [
            "request",
            "auth.signup",
            "auth.issueJWT",
            "auth.login",

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
            "contests.control.getAllParticipantsOfSpecificContest",

            // Other Services' Event Update Events
            "contests.startContest.complete",
            "contests.startContest.corrupt",
            "contests.register.complete",
            "contests.register.corrupt",



            // Normal User Usage Events


            // Control Panel User Usage Events


            // Other Services' Event Update Events
            "judges.execution.practice.complete",
            "judges.execution.contest.complete",

            "judges.execution.practice.getUpdates",
            "judges.execution.contest.getUpdates",

            "judges.execution.practice.corrupt",
            "judges.execution.contest.corrupt",


            "permissions.check",
            "permissions.control.search",
            "permissions.control.getPermission",
            "permissions.control.create",
            "permissions.control.update",
            "permissions.control.delete",


            // Normal User Usage Events
            "problems.search",
            "problems.getAllProblems",
            "problems.getProblem",

            // Control Panel User Usage Events
            "problems.control.search",
            "problems.control.getProblem",
            "problems.control.create",
            "problems.control.update",
            "problems.control.delete",

            // Other Services' Event Update Events
            "problems.practiceSubmission.getTestCases.complete",
            "problems.contestSubmission.getTestCases.complete",

            "problems.practiceSubmission.getTestCases.corrupt",
            "problems.contestSubmission.getTestCases.corrupt",



            // Normal User Usage Events
            "submissions.practice.create", // This Indicates That This is Practice Problem's Submission
            "submissions.contest.create", // This Indicates That This is Contest Problem's Submission
            "submissions.getSubmission", // This Indicates Get the Details of the Specific Submission 
            "submissions.getAllSubmissionsForProblem", // This Indicates Get All the Submissions Made by the User For Specific Problem

            // Control Panel User Usage Events


            // Other Services' Event Update Events
            "submissions.practice.create.complete",
            "submissions.contest.create.complete",

            "submissions.practice.update.complete",
            "submissions.contest.update.complete",

            "submissions.practice.update.corrupt",
            "submissions.contest.update.corrupt",

            "submissions.practice.delete.complete",
            "submissions.contest.delete.complete",

            "submissions.practice.delete.corrupt",
            "submissions.contest.delete.corrupt",




            // Normal User Usage Events
            "users.create",
            "users.getUser",

            // Control Panel User Usage Events
            "users.control.search",
            "users.control.getUser",
            "users.control.create",
            "users.control.update",
            "users.control.delete",

            // Other Services' Event Update Events
            "users._system.update.complete",
            "users._system.update.corrupt",
        ];

        const admin = kafka.admin();
        console.log("Kafka Admin connecting...");
        admin.connect();
        console.log("Kafka Admin Connection Success...");

        console.log(listOfTopicsNeeded);


        // If Topics are not there then do create them
        const allTopics = await admin.listTopics();
        // console.log("All Kafka Topics: ", allTopics.toString(), " 007 ", allTopics);

        const allTopicsMetadata = (await admin.fetchTopicMetadata({ topics: allTopics }))?.topics;
        console.log(allTopicsMetadata);
        console.log(JSON.stringify(allTopicsMetadata));

        // Find out that if topic exists or not and if yes then please check if it has the default number of partitions or not and if it doesn't exits then create and if it exists then update the partitions
        for (let index = 0; index < listOfTopicsNeeded.length; index++ ) {
            const neededTopicName = listOfTopicsNeeded[index];
            
            // Find if Topic Exists
            let neededTopicDetails = allTopicsMetadata.find((element) => element?.name === neededTopicName);
            if (neededTopicDetails) {
                console.log("Topic: " + neededTopicName + " exists thus checking if it has right amount of partitions or not....");
                if (neededTopicDetails?.partitions?.length < 2*DEFAULT_PARTITIONS_OF_KAFKA_TOPICS) {
                    console.log("Since it has less topics i.e. " + neededTopicDetails?.partitions?.length + " topics thus updating partitions....", neededTopicDetails?.name + " " + 2*DEFAULT_PARTITIONS_OF_KAFKA_TOPICS );

                    // Update Partitions of the Topic
                    await admin.createPartitions({
                        validateOnly: false,
                        timeout: 10000,
                        topicPartitions: [{
                            topic: neededTopicDetails?.name,    // partition name
                            count: 2*DEFAULT_PARTITIONS_OF_KAFKA_TOPICS,     // partition count
                        }],
                    });

                }
                else{
                    console.log("It has right amount of topics thus checking another....");
                }

            }
            else {
                console.log("Topic: " + neededTopicName + " doesn't exists thus creating....");

                const listOfTopicsToCreate = [{
                    topic: neededTopicName,
                    numPartitions: 2*DEFAULT_PARTITIONS_OF_KAFKA_TOPICS,
                },];

                console.log("Creating Topics ", listOfTopicsToCreate);
                await admin.createTopics({
                    topics: listOfTopicsToCreate,
                });
                console.log("Topic Created Success ", listOfTopicsToCreate);
            }
        }



        console.log("Disconnecting Kafka Admin..");
        await admin.disconnect();

    } catch (error) {
        console.log("Error: ", error);
        console.log("Something went wrong while creating topics in kafka");

    }
};


initializeTopics();

export default initializeTopics;

