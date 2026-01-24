import "dotenv/config";
import { sendEvent } from "../../../permissions/utils/v1/kafkaProducer.js";
import { kafka } from "../../config/v1/kafka.js";
import { signToken, verifyToken } from "../../utils/v1/jwt.js";
import { publishToRedisPubSub } from "../../utils/v1/redisPublisher.js";
import getPartition from "../../utils/v1/getPartition.js";


const CURR_SERVICE_NAME = "auth-service";




// PLEASE NOTE: Don't be in Hurry to implement the DRY Principle as metadata.source is need to be "auth-service" to be precise in any service will be going to be that service but the fact that is that field sometimes needs to be checked by functions so carefully update things not just in this field but in any field


const checkIdentity = async (data, metadata) => {
    try {


        // const data = {
        //     // Required Things for Performing that Operation
        // };


        // const metadata = {
        //     // Not To Be Changed Fields

        //     clientId: "<clientId>", // This is Websocket Id Which will be used for sending back the data to the client
        //     requestId: "<requestId>", // This will be request id generated randomly but uniquely to traverse the path through which our request has been processed around in the system
        //     actor: {
        //         userId: "<userId>", // This will be used to fetch details of the user from the DB if Required
        //         token: "<userToken>", // This is JWT Token of the User by which we will validate the aunthenticity of User and check if he or she is allowed to have the desired operation performed
        //     },
        //     operation: "<Any Operation Name Which is To be searched onto the Permission's Table>", // This will tell about what initial request was and processing will be done as per this 
        //     createdAt: "<Date in ISO String Format>", // Time when this request was created

        //     // To be Changed Fields

        //     source: "This is The Last Service name by which this event is Generated",
        //     updatedAt: "<Date in ISO String Format>", // Every other function will update this after its processing so that it can be tracked how much time that function took to execute
        // };


        // If Token is there that means the thing that the User is Existing & Logged in and trying to perform some operation
        // Else the User is New and trying to Signup or Login
        const token = metadata?.actor?.token || "";
        // console.log("\nGot Token: ", token , " \n\n");
        const partition = getPartition();

        // Update Source Of Event 
        metadata.source = CURR_SERVICE_NAME;
        const { isTokenVerified, userData } = verifyToken(token);
        // console.log("\nIn Auth Service before if: ", userData);
        if (token && isTokenVerified) {
            // console.log("\nIn Auth Service in If: ", userData);
            metadata.actor = { ...(metadata.actor), ...userData };
        }
        else {
            metadata.actor.role = "PUBLIC";
        }

        metadata.updatedAt = (new Date()).toISOString();
        await sendEvent("permissions.check", partition, data, metadata);

    } catch (error) {
        console.log(error);
        console.log("Something went wrong while handling in AUTH SERVICE while Checking Identity....");

        metadata.success = false;
        metadata.message = "Something Went Wrong while Verifying Your Indentity. Please Login Again....";

        metadata.source = CURR_SERVICE_NAME;
        metadata.updatedAt = (new Date()).toISOString();

        await publishToRedisPubSub("response", JSON.stringify({ data: data, metadata: metadata }));
        return;
    }

};



const handleSignup = async (data, metadata) => {
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
        //         token: "<userToken>", // This is JWT Token of the User by which we will validate the aunthenticity of User and check if he or she is allowed to have the desired operation performed
        //     },
        //     operation: "<Any Operation Name Which is To be searched onto the Permission's Table>", // This will tell about what initial request was and processing will be done as per this 
        //     createdAt: "<Date in ISO String Format>", // Time when this request was created

        //     // To be Changed Fields

        //     source: "This is The Last Service name by which this event is Generated",
        //     updatedAt: "<Date in ISO String Format>", // Every other function will update this after its processing so that it can be tracked how much time that function took to execute
        // };


        // If Valid Data is given then Send Event to User Service that Create a new User with Given Details
        // Else Send Response that User Data is not Valid

        // PLEASE NOTE: Additional Check such That Validity of email or mobile no. can be done in later Implementations for now just check if it is there or not for creating the user just that however can be upgraded.
        let partition = getPartition();
        let { name, user_name, email, password, mobile_no } = data;


        if (!name || !user_name || !email || !password || !mobile_no) {
            metadata.success = false;
            metadata.message = "Something Went Wrong Please fill all the Required Details like: name, user_name, email, password, mobile_no";

            metadata.source = CURR_SERVICE_NAME;
            metadata.updatedAt = (new Date()).toISOString();

            await publishToRedisPubSub("response", JSON.stringify({ data: data, metadata: metadata }));
            return;
        }

        if (metadata.source === "permission-service") {
            metadata.actor.role = "PUBLIC";
            metadata.source = CURR_SERVICE_NAME;
            metadata.updatedAt = (new Date()).toISOString();

            await sendEvent("users.create", partition, data, metadata);
            return;
        }

    } catch (error) {
        console.log(error);
        console.log("Something went wrong while handling in AUTH SERVICE while Handling Signup....");

        metadata.success = false;
        metadata.message = "Something Went Wrong while Signing Up. Please Try Again....";

        metadata.source = CURR_SERVICE_NAME;
        metadata.updatedAt = (new Date()).toISOString();

        await publishToRedisPubSub("response", JSON.stringify({ data: data, metadata: metadata }));
        return;
    }
};


const issueJWT = async (data, metadata) => {
    try {
        // const data = { 
        //         result: {
        //             _id: <_id>,
        //             name: <name>,
        //             user_name: <user_name>,
        //             email: <email>,
        //             password: <password>,
        //             mobile_no: <mobile_no>,
        //         },
        // };


        // const metadata = {
        //     // Not To Be Changed Fields

        //     clientId: "<clientId>", // This is Websocket Id Which will be used for sending back the data to the client
        //     requestId: "<requestId>", // This will be request id generated randomly but uniquely to traverse the path through which our request has been processed around in the system
        //     actor: {
        //         userId: "<userId>", // This will be used to fetch details of the user from the DB if Required
        //         token: "<userToken>", // This is JWT Token of the User by which we will validate the aunthenticity of User and check if he or she is allowed to have the desired operation performed
        //     },
        //     operation: "<Any Operation Name Which is To be searched onto the Permission's Table>", // This will tell about what initial request was and processing will be done as per this 
        //     createdAt: "<Date in ISO String Format>", // Time when this request was created

        //     // To be Changed Fields

        //     source: "This is The Last Service name by which this event is Generated",
        //     updatedAt: "<Date in ISO String Format>", // Every other function will update this after its processing so that it can be tracked how much time that function took to execute
        // };

        const userData = {
            userId: data.result._id,
            name: data.result.name,
            role: data.result.role,
            user_name: data.result.user_name,
            activation_status: data.result.activation_status,
            email: data.result.email,
            password: data.result.password,
            mobile_no: data.result.mobile_no,
        };

        if (metadata.source === "user-service") {
            console.log("\n\nIssuing Token....", userData, "\n\n");
            data.token = signToken(userData);
            metadata.success = true;
            metadata.message = "Successfully logged in....";

            metadata.source = CURR_SERVICE_NAME;
            metadata.updatedAt = (new Date()).toISOString();

            await publishToRedisPubSub("response", JSON.stringify({ data: data, metadata: metadata }));
            return;
        }

    } catch (error) {
        console.log(error);
        console.log("Something went wrong while handling in AUTH SERVICE while Issuing JWT....");

        metadata.success = false;
        metadata.message = "Something Went Wrong while Issuing JWT Token. Please Login Again....";

        metadata.source = CURR_SERVICE_NAME;
        metadata.updatedAt = (new Date()).toISOString();

        await publishToRedisPubSub("response", JSON.stringify({ data: data, metadata: metadata }));
        return;
    }
};


const handleLogin = async (data, metadata) => {
    try {
        // const data = {
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
        //         token: "<userToken>", // This is JWT Token of the User by which we will validate the aunthenticity of User and check if he or she is allowed to have the desired operation performed
        //     },
        //     operation: "<Any Operation Name Which is To be searched onto the Permission's Table>", // This will tell about what initial request was and processing will be done as per this 
        //     createdAt: "<Date in ISO String Format>", // Time when this request was created

        //     // To be Changed Fields

        //     source: "This is The Last Service name by which this event is Generated",
        //     updatedAt: "<Date in ISO String Format>", // Every other function will update this after its processing so that it can be tracked how much time that function took to execute
        // };


        const { password, email, user_name } = data;
        if (!(password && (email || user_name))) {
            metadata.success = false;
            metadata.message = "Something Went Wrong Please fill all the Required Details like: email + password or user_name + password";

            metadata.source = CURR_SERVICE_NAME;
            metadata.updatedAt = (new Date()).toISOString();

            await publishToRedisPubSub("response", JSON.stringify({ data: data, metadata: metadata }));
            return;
        }

        let partition = getPartition();

        if (metadata.source === "permission-service") {

            metadata.source = CURR_SERVICE_NAME;
            metadata.updatedAt = (new Date()).toISOString();

            await sendEvent("users.getUser", partition, data, metadata);
        }

    } catch (error) {
        console.log(error);
        console.log("Something went wrong while handling in AUTH SERVICE while Handling Login....");

        metadata.success = false;
        metadata.message = "Something Went Wrong while Logging in. Please Login Again....";

        metadata.source = CURR_SERVICE_NAME;
        metadata.updatedAt = (new Date()).toISOString();

        await publishToRedisPubSub("response", JSON.stringify({ data: data, metadata: metadata }));
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
            "request",
            "auth.signup",
            "auth.issueJWT",
            "auth.login",
        ];


        // List of Functions that will be used for processing the events
        const handlingFunctions = {
            "request": checkIdentity,
            "auth.signup": handleSignup,
            "auth.issueJWT": issueJWT,
            "auth.login": handleLogin,
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