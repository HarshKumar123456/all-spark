import "dotenv/config";
import { kafka } from "../../config/v1/kafka.js";
import User from "../../models/v1/users.js";
import { publishToRedisPubSub } from "../../utils/v1/redisPublisher.js";
import { sendEvent } from "../../utils/v1/kafkaProducer.js";
import getPartition from "../../utils/v1/getPartition.js";


const CURR_SERVICE_NAME = "user-service";


// PLEASE NOTE: CACHING is YET TO BE IMPLEMENTED

const createUser = async (data, metadata) => {
    try {


        // const data = {
        //     name: <name>,
        //     user_name: <user_name>,
        //     email: <email>,
        //     password: <password>,
        //     mobile_no: <mobile_no>,
        // };


        // const metadata = {
        //     // Not To Be Changed Fields

        //     clientId: "<clientId>", // This is Websocket Id Which will be used for sending back the data to the client
        //     requestId: "<requestId>", // This will be request id generated randomly but uniquely to traverse the path through which our request has been processed around in the system
        //     actor: {
        //         userId: "<userId>", // This will be used to fetch details of the user from the DB if Required
        //         role: "<role>", // Role of user will be only one of these: ADMIN , CONTEST_SCHEDULER , SUPPORT , USER , PUBLIC
        //         token: "<userToken>", // This is JWT Token of the User by which we will validate the aunthenticity of User and check if he or she is allowed to have the desired operation performed
        //     },
        //     operation: "<Any Operation Name Which is To be searched onto the Permission's Table>", // This will tell about what initial request was and processing will be done as per this 
        //     createdAt: "<Date in ISO String Format>", // Time when this request was created

        //     // To be Changed Fields

        //     source: "This is The Last Service name by which this event is Generated",
        //     updatedAt: "<Date in ISO String Format>", // Every other function will update this after its processing so that it can be tracked how much time that function took to execute
        // };

        // If User Creation Request came from the Unauthorized User then he or she may want to create the Profile For themselves thus create and Ask the AUTH SERVICE to Issue JWT to that User
        let partition = getPartition();
        if (metadata.source === "auth-service") {

            // Set Default Role as "USER"
            data.role = "USER";
            // Set Default Activation status as "active"
            data.activation_status = "active";

            const userData = {
                name: data.name,
                user_name: data.user_name,
                email: data.email,
                password: data.password,
                mobile_no: data.mobile_no,
                role: data.role,
                activation_status: data.activation_status,
            };

            const user = await new User(userData).save();
            data = { ...data, result: user };

            metadata.source = CURR_SERVICE_NAME;
            metadata.updatedAt = (new Date()).toISOString();

            if (!user) {
                metadata.success = false;
                metadata.message = "User Not Created. Please Input Correct Fields....";
                await publishToRedisPubSub("response", JSON.stringify({ data: data, metadata: metadata }));
                return;
            }

            metadata.success = true;
            metadata.message = "User Created Successfully....";

            await sendEvent("auth.issueJWT", partition, data, metadata);

        }
        // This has been come from the Control Panel Of ADMIN Role Possessing User Thus Send Response That It has been Created Successfully No Need to Issue JWT
        else if (metadata.source === "permission-service") {
            // Role & Activation Status Will be set by the data provided itself and data validation is checked at the API level By Default we are considering all the data is given valid however handled error things also but not data validation and all everywhere
            const userData = {
                name: data.name,
                user_name: data.user_name,
                email: data.email,
                password: data.password,
                mobile_no: data.mobile_no,
                role: data.role || "USER",
                activation_status: data.activation_status || "active",
            };


            const user = await new User(userData).save();
            data = { ...data, result: user };


            metadata.source = CURR_SERVICE_NAME;
            metadata.updatedAt = (new Date()).toISOString();

            if (!user) {
                metadata.success = false;
                metadata.message = "User Not Created. Please Input Correct Fields....";
                await publishToRedisPubSub("response", JSON.stringify({ data: data, metadata: metadata }));
                return;
            }

            metadata.success = true;
            metadata.message = "User Created Successfully....";
            await publishToRedisPubSub("response", JSON.stringify({ data: data, metadata: metadata }));
        }



    } catch (error) {
        console.log(error);
        console.log("Something went wrong while handling in USER SERVICE while Creating User....");
        metadata.success = false;
        metadata.message = "Something went wrong while Creating User....";
        await publishToRedisPubSub("response", JSON.stringify({ data: data, metadata: metadata }));
        return;
    }

};


const searchUsers = async (data, metadata) => {
    try {


        // const data = {
        // filter: <filter>,
        // };


        // const metadata = {
        //     // Not To Be Changed Fields

        //     clientId: "<clientId>", // This is Websocket Id Which will be used for sending back the data to the client
        //     requestId: "<requestId>", // This will be request id generated randomly but uniquely to traverse the path through which our request has been processed around in the system
        //     actor: {
        //         userId: "<userId>", // This will be used to fetch details of the user from the DB if Required
        //         role: "<role>", // Role of user will be only one of these: ADMIN , CONTEST_SCHEDULER , SUPPORT , USER , PUBLIC
        //         token: "<userToken>", // This is JWT Token of the User by which we will validate the aunthenticity of User and check if he or she is allowed to have the desired operation performed
        //     },
        //     operation: "<Any Operation Name Which is To be searched onto the Permission's Table>", // This will tell about what initial request was and processing will be done as per this 
        //     createdAt: "<Date in ISO String Format>", // Time when this request was created

        //     // To be Changed Fields

        //     source: "This is The Last Service name by which this event is Generated",
        //     updatedAt: "<Date in ISO String Format>", // Every other function will update this after its processing so that it can be tracked how much time that function took to execute
        // };

        // If this has been come from the Control Panel Of ADMIN Role Possessing User Thus Send Response That It has been Found Successfully No Need to Issue JWT
        const filter = data.filter || {};


        if (metadata.source === "permission-service") {


            const user = await User.find(filter);


            metadata.source = CURR_SERVICE_NAME;
            metadata.updatedAt = (new Date()).toISOString();

            if (!user) {
                metadata.success = false;
                metadata.message = "Users Not Found. Please Provide Correct Credentials....";
                await publishToRedisPubSub("response", JSON.stringify({ data: data, metadata: metadata }));
                return;
            }

            data = { ...data, result: user };

            metadata.success = true;
            metadata.message = "Users Found Successfully....";
            await publishToRedisPubSub("response", JSON.stringify({ data: data, metadata: metadata }));
        }



    } catch (error) {
        console.log(error);
        console.log("Something went wrong while handling in USER SERVICE while Searching Users....");
        metadata.success = false;
        metadata.message = "Something Went Wrong while Searching Users....";
        await publishToRedisPubSub("response", JSON.stringify({ data: data, metadata: metadata }));
        return;
    }

};


const getSpecificUserDetails = async (data, metadata) => {
    try {


        // const data = {
        //     _id: <_id>,
        //     user_name: <user_name>,
        //     email: <email>,
        //     password: <password>,
        // };


        // const metadata = {
        //     // Not To Be Changed Fields

        //     clientId: "<clientId>", // This is Websocket Id Which will be used for sending back the data to the client
        //     requestId: "<requestId>", // This will be request id generated randomly but uniquely to traverse the path through which our request has been processed around in the system
        //     actor: {
        //         userId: "<userId>", // This will be used to fetch details of the user from the DB if Required
        //         role: "<role>", // Role of user will be only one of these: ADMIN , CONTEST_SCHEDULER , SUPPORT , USER , PUBLIC
        //         token: "<userToken>", // This is JWT Token of the User by which we will validate the aunthenticity of User and check if he or she is allowed to have the desired operation performed
        //     },
        //     operation: "<Any Operation Name Which is To be searched onto the Permission's Table>", // This will tell about what initial request was and processing will be done as per this 
        //     createdAt: "<Date in ISO String Format>", // Time when this request was created

        //     // To be Changed Fields

        //     source: "This is The Last Service name by which this event is Generated",
        //     updatedAt: "<Date in ISO String Format>", // Every other function will update this after its processing so that it can be tracked how much time that function took to execute
        // };

        // If User Get User Request came from the Unauthorized User then he or she may want to Get His Profile For themselves thus get and Ask the AUTH SERVICE to Issue JWT to that User
        let partition = getPartition();
        if (metadata.source === "auth-service") {
            const { user_name, email, password } = data;
            const filter = {};
            if (user_name) {
                filter.user_name = user_name;
            }

            if (email) {
                filter.email = email;
            }

            if (password) {
                filter.password = password;
            }

            const user = await User.findOne(filter);

            metadata.source = CURR_SERVICE_NAME;
            metadata.updatedAt = (new Date()).toISOString();

            if (!user) {
                metadata.success = false;
                metadata.message = "User Not Found. Please Input Correct Credentials....";
                await publishToRedisPubSub("response", JSON.stringify({ data: data, metadata: metadata }));
                return;
            }

            data = { ...data, result: user };
            metadata.success = true;
            metadata.message = "User Found Successfully....";

            await sendEvent("auth.issueJWT", partition, data, metadata);

        }
        // This has been come from the Control Panel Of ADMIN Role Possessing User Thus Send Response That It has been Found Successfully No Need to Issue JWT
        else if (metadata.source === "permission-service") {
            const filter = {
                _id: data._id,
            };
            const user = await User.findOne(filter);

            metadata.source = CURR_SERVICE_NAME;
            metadata.updatedAt = (new Date()).toISOString();

            if (!user) {
                metadata.success = false;
                metadata.message = "User Not Found. Please Provide Correct Credentials....";
                await publishToRedisPubSub("response", JSON.stringify({ data: data, metadata: metadata }));
                return;
            }

            data = { ...data, result: user };

            metadata.success = true;
            metadata.message = "User Found Successfully....";
            await publishToRedisPubSub("response", JSON.stringify({ data: data, metadata: metadata }));
        }



    } catch (error) {
        console.log(error);
        console.log("Something went wrong while handling in USER SERVICE while Getting Specific User Details....");
        metadata.success = false;
        metadata.message = "Something went wrong while Getting Specific User Details....";
        await publishToRedisPubSub("response", JSON.stringify({ data: data, metadata: metadata }));
        return;
    }

};


const updateUserDetails = async (data, metadata) => {
    try {


        // const data = {
        //     _id: <_id>,
        //     name: <name>,
        //     role: <role>,
        //     activation_status: <activation_status>,
        //     user_name: <user_name>,
        //     email: <email>,
        //     password: <password>,
        //     mobile_no: <mobile_no>,
        // };


        // const metadata = {
        //     // Not To Be Changed Fields

        //     clientId: "<clientId>", // This is Websocket Id Which will be used for sending back the data to the client
        //     requestId: "<requestId>", // This will be request id generated randomly but uniquely to traverse the path through which our request has been processed around in the system
        //     actor: {
        //         userId: "<userId>", // This will be used to fetch details of the user from the DB if Required
        //         role: "<role>", // Role of user will be only one of these: ADMIN , CONTEST_SCHEDULER , SUPPORT , USER , PUBLIC
        //         token: "<userToken>", // This is JWT Token of the User by which we will validate the aunthenticity of User and check if he or she is allowed to have the desired operation performed
        //     },
        //     operation: "<Any Operation Name Which is To be searched onto the Permission's Table>", // This will tell about what initial request was and processing will be done as per this 
        //     createdAt: "<Date in ISO String Format>", // Time when this request was created

        //     // To be Changed Fields

        //     source: "This is The Last Service name by which this event is Generated",
        //     updatedAt: "<Date in ISO String Format>", // Every other function will update this after its processing so that it can be tracked how much time that function took to execute
        // };

        // If User Updation Request came from the PERMISSION SERVICE then Update and send response back to the REDIS Pub/Sub Channel
        if (metadata.source === "permission-service") {

            const { name, user_name, email, password, mobile_no, role, activation_status } = data;

            const updatedUserData = {};

            if (name) {
                updatedUserData.name = name;
            }

            if (user_name) {
                updatedUserData.user_name = user_name;
            }

            if (email) {
                updatedUserData.email = email;
            }

            if (password) {
                updatedUserData.password = password;
            }

            if (mobile_no) {
                updatedUserData.mobile_no = mobile_no;
            }

            if (role) {
                updatedUserData.role = role;
            }

            if (activation_status) {
                updatedUserData.activation_status = activation_status;
            }


            const filter = {
                _id: data._id,
            };

            const user = await User.findOneAndUpdate(filter, updatedUserData);
            data = { ...data, result: user };

            metadata.source = CURR_SERVICE_NAME;
            metadata.updatedAt = (new Date()).toISOString();

            if (!user) {
                metadata.success = false;
                metadata.message = "User Not Updated. Please Input Correct Fields....";
                await publishToRedisPubSub("response", JSON.stringify({ data: data, metadata: metadata }));
                return;
            }

            metadata.success = true;
            metadata.message = "User Updated Successfully....";

            await publishToRedisPubSub("response", JSON.stringify({ data: data, metadata: metadata }));
            return;
        }




    } catch (error) {
        console.log(error);
        console.log("Something went wrong while handling in USER SERVICE while Updating User's Details....");
        metadata.success = false;
        metadata.message = "Something went wrong while Updating User's Details....";
        await publishToRedisPubSub("response", JSON.stringify({ data: data, metadata: metadata }));
        return;
    }

};


const deleteSpecificUser = async (data, metadata) => {
    try {


        // const data = {
        //     _id: <_id>,
        // };


        // const metadata = {
        //     // Not To Be Changed Fields

        //     clientId: "<clientId>", // This is Websocket Id Which will be used for sending back the data to the client
        //     requestId: "<requestId>", // This will be request id generated randomly but uniquely to traverse the path through which our request has been processed around in the system
        //     actor: {
        //         userId: "<userId>", // This will be used to fetch details of the user from the DB if Required
        //         role: "<role>", // Role of user will be only one of these: ADMIN , CONTEST_SCHEDULER , SUPPORT , USER , PUBLIC
        //         token: "<userToken>", // This is JWT Token of the User by which we will validate the aunthenticity of User and check if he or she is allowed to have the desired operation performed
        //     },
        //     operation: "<Any Operation Name Which is To be searched onto the Permission's Table>", // This will tell about what initial request was and processing will be done as per this 
        //     createdAt: "<Date in ISO String Format>", // Time when this request was created

        //     // To be Changed Fields

        //     source: "This is The Last Service name by which this event is Generated",
        //     updatedAt: "<Date in ISO String Format>", // Every other function will update this after its processing so that it can be tracked how much time that function took to execute
        // };

        // If User Deletion Request came from the PERMISSION SERVICE then delete and send response back to the REDIS Pub/Sub Channel
        if (metadata.source === "permission-service") {

            const filter = {
                _id: data._id,
            };

            const user = await User.findOneAndDelete(filter);
            data = { ...data, result: user };

            metadata.source = CURR_SERVICE_NAME;
            metadata.updatedAt = (new Date()).toISOString();

            if (!user) {
                metadata.success = false;
                metadata.message = "User Not Deleted. Please Input Correct Fields....";
                await publishToRedisPubSub("response", JSON.stringify({ data: data, metadata: metadata }));
                return;
            }

            metadata.success = true;
            metadata.message = "User Deleted Successfully....";

            await publishToRedisPubSub("response", JSON.stringify({ data: data, metadata: metadata }));
            return;
        }




    } catch (error) {
        console.log(error);
        console.log("Something went wrong while handling in USER SERVICE while Deleting User's Details....");
        metadata.success = false;
        metadata.message = "Something went wrong while Deleting User's Details....";
        await publishToRedisPubSub("response", JSON.stringify({ data: data, metadata: metadata }));
        return;
    }

};






const _systemSubmissionMadeThusUpdateTriedProblemsForUser = async (data, metadata) => {

    try {


        // const data = {
        //     ...(Some Data Recieved From The Client Side or Initial Request to the API),
        //     result: <result>, // Some Data Required To Send to Client Side or to source who does the Initial Request to the API
        //     _system: {
        //         data: {
        //             problem_id: submission.problem_id, // The Problem Id which is Related to the Submission
        //             created_by: submission.created_by,
        //         },
        //         metadata: {
        //             source: "submission-service",
        //             createdAt: "<Date in ISO String Format>", // Time when this System's internal Data Processing Request was created
        //             cache: {
        //                  hits: <hits>,
        //                  misses: <misses>,
        //             },
        //             updatedAt: "<Date in ISO String Format>", // Every other function will update this after its processing so that it can be tracked how much time that function took to execute
        //         }
        //     },
        // };




        // const metadata = {
        //     // Not To Be Changed Fields

        //     clientId: "<clientId>", // This is Websocket Id Which will be used for sending back the data to the client
        //     requestId: "<requestId>", // This will be request id generated randomly but uniquely to traverse the path through which our request has been processed around in the system
        //     actor: {
        //         userId: "<userId>", // This will be used to fetch details of the user from the DB if Required
        //         role: "<role>", // Role of user will be only one of these: ADMIN , CONTEST_SCHEDULER , SUPPORT , USER , PUBLIC
        //         token: "<userToken>", // This is JWT Token of the User by which we will validate the aunthenticity of User and check if he or she is allowed to have the desired operation performed
        //     },
        //     operation: "<Any Operation Name Which is To be searched onto the Permission's Table>", // This will tell about what initial request was and processing will be done as per this 
        //     createdAt: "<Date in ISO String Format>", // Time when this request was created

        //     // To be Changed Fields

        //     source: "This is The Last Service name by which this event is Generated",
        //     updatedAt: "<Date in ISO String Format>", // Every other function will update this after its processing so that it can be tracked how much time that function took to execute
        // };



        // Since we have got the Update that User Has made atleast one successful submission thus it is neccessary to put it into the Tried Problems in the User's Data and No need to push Update of that thing to the User unless the User desired to see that Thing like the User can choose to see the Problems Tried and then can fetch the Submission made to those Problems by the User itself unless update that thing in the Background Silently
        if (data._system.metadata.source === "submission-service") {

            data._system.metadata.source = CURR_SERVICE_NAME;

            const {
                problem_id,
                created_by, // This will be the Id By which we Will be Tracking the User 
                _id, // This Will be Submission Id Which is Being Considered to Update the Tried Problem Status in User's Data Object
                is_for_public_test_cases, // This Will Tell If it is Finally Solved as Solving for Public Test Cases or Not Will not update the Problem Solving Status From "attempted" to "solved" it will be Updated When User have solved the Problem for the Private Test Cases
                test_cases, // These Will be the Test Cases Which the Current Submission Under Consideration have into it
            } = data._system.data;

            const filter = {
                _id: created_by, // This is User's Id By Which The User will be Find
            };



            // Since we have the "users.control.update" already we might think to update from there if we extend that function beyond just basic details but keeping things here for now for simplicity later can be extended
            const user = await User.findOne(filter).lean(); // lean() is Used Here to Get POJO so that operations can be performed Easily

            if (!user) {
                console.log("Sorry! This User with _id: ", created_by, " doesn't Exists....");

                data._system.metadata.success = false;
                data._system.metadata.message = `Sorry! This User with _id: ${created_by} doesn't Exists....`;
                data._system.metadata.updatedAt = (new Date()).toISOString();

                const topic = "users._system.update.corrupt";
                const partition = await getPartition();
                await sendEvent(topic, partition, data, metadata);
                return;
            }

            let isUpdatedProblemSubmissions = false;
            let isCurrSubmissionAccepted = false; // bool 

            // If the Submission Was for Public Test Cases Just Make the Problem Status as "attempted" and if it was for Private Test Cases then Check If It met to pass all the Test Cases and if Yes then Update the Problem Status as "solved"
            if (is_for_public_test_cases === false) {


                let passedTestCases = 0;
                const submissionTestCases = test_cases;

                // console.log("For Submission id: ", _id, "length of submissionTestCases is: ", submissionTestCases.length, "\n\n");

                for (let index = 0; index < submissionTestCases.length; index++) {
                    const testCase = submissionTestCases[index];
                    // console.log("Processing Test Case: ", index);
                    console.log(testCase);
                    if (testCase.status.id === 3) {
                        // console.log("This Test Case Is Accepted Thus Incrementing: ", passedTestCases);
                        passedTestCases++;
                    }
                    else {
                        isCurrSubmissionAccepted = false;
                        console.log("Breaking Here for Test Case: ", index);
                        break;
                    }
                }

                // Check If Passed All Test Cases
                if (passedTestCases === submissionTestCases.length) {
                    isCurrSubmissionAccepted = true;
                }


            }


            // First of All Try to Update if It Exists Already in Attempted Problems and If Yes then Update its Status from the Current Submission
            const existingTriedProblems = user.tried_problems;
            user.tried_problems = (existingTriedProblems).map((triedProblem) => {
                const newTriedProblemDetails = { ...triedProblem };
                // console.log("Inside Map of Tried Problems & Conparing the Problem_id ", newTriedProblemDetails.problem_id, "  ", problem_id);
                // console.log(newTriedProblemDetails);
                if (newTriedProblemDetails.problem_id === problem_id) {
                    console.log("\n\nIt Already Had Submission related to this Problem....");
                    isUpdatedProblemSubmissions = true;
                    // Append Current Submission Under Consideration into the Submissions Made By The User for the Current Problem
                    newTriedProblemDetails.submissions = [...(newTriedProblemDetails.submissions), _id];

                    // Update the Status of the Problem After The Current Submission
                    if (newTriedProblemDetails.status !== "solved") {
                        if (isCurrSubmissionAccepted === true) {
                            newTriedProblemDetails.status = "solved";
                        }
                        else {
                            newTriedProblemDetails.status = "attempted";
                        }
                    }
                }
                return newTriedProblemDetails;
            });


            // If This Is Problem's First Submission Made By The User then Make a New Entry in the "tried_problems" field of the User's Data's Object
            if (isUpdatedProblemSubmissions === false) {
                const newTriedProblemDetails = {
                    problem_id: problem_id,
                    status: (isCurrSubmissionAccepted === true ? "solved" : "attempted"),
                    submissions: [_id], // Adding the Id of the Current Submission Under Consideration 
                };

                // Update the User's Data Object
                user.tried_problems =
                    [
                        ...(user.tried_problems),
                        newTriedProblemDetails,
                    ];

                isUpdatedProblemSubmissions = true;
            };


            await User.findOneAndUpdate(filter, user);

            data._system.metadata.success = true;
            data._system.metadata.message = `This User with _id: ${created_by} updated Successfully....`;
            data._system.metadata.updatedAt = (new Date()).toISOString();

            const topic = "users._system.update.complete";
            const partition = await getPartition();
            await sendEvent(topic, partition, data, metadata);
            return;
        }

    }
    catch (error) {
        console.log(error);
        console.log("Something went wrong while handling in USER SERVICE while Updating the User's Details....");
        data._system.metadata.source = CURR_SERVICE_NAME;
        data._system.metadata.success = false;
        data._system.metadata.message = "Something went Wrong while Updating the User's Details....";
        data._system.metadata.updatedAt = (new Date()).toISOString();
        const topic = "users._system.update.corrupt";
        const partition = await getPartition();
        await sendEvent(topic, partition, data, metadata);
        return;

    }



};


const handleUnknownEvent = async (data, metadata) => {
    await publishToRedisPubSub("unknown", JSON.stringify({ data: data, metadata: metadata }));
};




const consumeEvents = async () => {
    try {


        // List of All Topics to Consume to run this Service
        const listOfTopicsToConsume = [
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
            "submissions.practice.update.complete",
        ];



        // List of Functions that will be used for processing the events
        const handlingFunctions = {
            // Normal User Usage Events
            "users.create": createUser,
            "users.getUser": getSpecificUserDetails,

            // Control Panel User Usage Events
            "users.control.search": searchUsers,
            "users.control.getUser": getSpecificUserDetails,
            "users.control.create": createUser,
            "users.control.update": updateUserDetails,
            "users.control.delete": deleteSpecificUser,

            // Other Services' Event Update Events
            "submissions.practice.update.complete": _systemSubmissionMadeThusUpdateTriedProblemsForUser,
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
