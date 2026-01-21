import "dotenv/config";
import { kafka } from "../../config/v1/kafka.js";
import User from "../../models/v1/users.js";
import { publishToRedisPubSub } from "../../utils/v1/redisPublisher.js";
import { sendEvent } from "../../utils/v1/kafkaProducer.js";


const DEFAULT_PARTITIONS_OF_KAFKA_TOPICS = process.env.DEFAULT_PARTITIONS_OF_KAFKA_TOPICS || 4;
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
        let partition = (Math.floor((Math.random() * 40))) % DEFAULT_PARTITIONS_OF_KAFKA_TOPICS;
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
        let partition = (Math.floor((Math.random() * 40))) % DEFAULT_PARTITIONS_OF_KAFKA_TOPICS;
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
    }

};


const handleUnknownEvent = async (data, metadata) => {
    await publishToRedisPubSub("unknown", JSON.stringify({ data: data, metadata: metadata }));
};




const consumeEvents = async () => {
    try {


        // List of All Topics to Consume to run this Service
        const listOfTopicsToConsume = [
            "users.create",
            "users.getUser",
            "users.control.search",
            "users.control.getUser",
            "users.control.create",
            "users.control.update",
            "users.control.delete",
        ];



        // List of Functions that will be used for processing the events
        const handlingFunctions = {
            "users.create": createUser,
            "users.getUser": getSpecificUserDetails,
            "users.control.search": searchUsers,
            "users.control.getUser": getSpecificUserDetails,
            "users.control.create": createUser,
            "users.control.update": updateUserDetails,
            "users.control.delete": deleteSpecificUser,
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