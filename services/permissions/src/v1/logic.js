import "dotenv/config";
import { kafka } from "../../config/v1/kafka.js";
import Permission from "../../models/v1/permissions.js";
import { publishToRedisPubSub } from "../../utils/v1/redisPublisher.js";
import { sendEvent } from "../../utils/v1/kafkaProducer.js";


const DEFAULT_PARTITIONS_OF_KAFKA_TOPICS = process.env.DEFAULT_PARTITIONS_OF_KAFKA_TOPICS || 4;
const CURR_SERVICE_NAME = "permission-service";


// PLEASE NOTE: CACHING is YET TO BE IMPLEMENTED


const checkIfPermitted = async (data, metadata) => {
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
        //         role: "<role>", // Role of user will be only one of these: ADMIN , CONTEST_SCHEDULER , SUPPORT , USER , PUBLIC
        //         token: "<userToken>", // This is JWT Token of the User by which we will validate the aunthenticity of User and check if he or she is allowed to have the desired operation performed
        //     },
        //     operation: "<Any Operation Name Which is To be searched onto the Permission's Table>", // This will tell about what initial request was and processing will be done as per this 
        //     createdAt: "<Date in ISO String Format>", // Time when this request was created

        //     // To be Changed Fields

        //     source: "This is The Last Service name by which this event is Generated",
        //     updatedAt: "<Date in ISO String Format>", // Every other function will update this after its processing so that it can be tracked how much time that function took to execute
        // };


        // This Source check Validates that the data has come from the authorized source and thus safe to just check the role claimed by the "metadata.actor" (which is already verified by the AUTH SERVICE) and send it to next Topic where it will be processed
        if (metadata.source === "auth-service") {

            const filter = {
                name: metadata.operation,
            };


            // Fetch From Database if not available in the Cache DB Caching yet to be implemented
            const permission = await Permission.findOne(filter);

            metadata.source = CURR_SERVICE_NAME;
            metadata.updatedAt = (new Date()).toISOString();

            if(!permission) {
                // Publish Response to the User that this operation is Not Exists
                metadata.message = "This Operation Not Exists: " + metadata.operation;
                metadata.success = false;
                await publishToRedisPubSub("response", JSON.stringify({ data: data, metadata: metadata }));
                return ;
            }


            let partition = (Math.floor((Math.random() * 40))) % DEFAULT_PARTITIONS_OF_KAFKA_TOPICS;

            if (permission.roles.includes(metadata.actor.role) === true) {
                await sendEvent(permission.nextTopicToPublish, partition, data, metadata);
            }
            else {
                // Publish Response to the User that Your'e not allowed to Perform this operation
                metadata.message = "Not Allowed for Role: " + metadata.actor.role;
                metadata.success = false;
                await publishToRedisPubSub("response", JSON.stringify({ data: data, metadata: metadata }));

            }
        }

    } catch (error) {
        console.log(error);
        console.log("Something went wrong while handling in PERMISSION SERVICE while Checking Permission....");
    }

};


const searchPermissions = async (data, metadata) => {
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


            const permission = await Permission.find(filter);


            metadata.source = CURR_SERVICE_NAME;
            metadata.updatedAt = (new Date()).toISOString();

            if (!permission) {
                metadata.success = false;
                metadata.message = "Permissions Not Found. Please Provide Correct Credentials....";
                await publishToRedisPubSub("response", JSON.stringify({ data: data, metadata: metadata }));
                return;
            }

            data = { ...data, result: permission };

            metadata.success = true;
            metadata.message = "Permissions Found Successfully....";
            await publishToRedisPubSub("response", JSON.stringify({ data: data, metadata: metadata }));
        }



    } catch (error) {
        console.log(error);
        console.log("Something went wrong while handling in PERMISSION SERVICE while Searching Permissions....");
    }
};


const getSpecificPermissionDetails = async (data, metadata) => {
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

        // If These request have come from the PERMISSION SERVICE then Indeed they are some Control Panel Operations thus Send Response Back To the User who initiated these request
        if (metadata.source === "permission-service") {
            const filter = {
                _id: data._id,
            };

            const permission = await Permission.findOne(filter);

            metadata.source = CURR_SERVICE_NAME;
            metadata.updatedAt = (new Date()).toISOString();

            if (!permission) {
                metadata.success = false;
                metadata.message = "Permission Not Found. Please Input Correct Credentials....";
                await publishToRedisPubSub("response", JSON.stringify({ data: data, metadata: metadata }));
                return;
            }

            data = { ...data, result: permission };
            metadata.success = true;
            metadata.message = "Permission Found Successfully....";

            await publishToRedisPubSub("response", JSON.stringify({ data: data, metadata: metadata }));
            return;

        }




    } catch (error) {
        console.log(error);
        console.log("Something went wrong while handling in PERMISSION SERVICE while Getting Specific Permission's Details....");
    }

};


const createNewPermission = async (data, metadata) => {
    try {


        // const data = {
        //     name: <name>,
        //     description: <description>,
        //     nextTopicToPublish: <nextTopicToPublish>,
        //     roles: <roles>,
        //     created_by: <created_by>,
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

        // If These request have come from the PERMISSION SERVICE then Indeed they are some Control Panel Operations thus Send Response Back To the User who initiated these request
        if (metadata.source === "permission-service") {
            const permissionData = {
                name: data.name,
                description: data.description,
                nextTopicToPublish: data.nextTopicToPublish,
                roles: data.roles,
                created_by: data.created_by,
            };

            const permission = await new Permission(permissionData).save();

            metadata.source = CURR_SERVICE_NAME;
            metadata.updatedAt = (new Date()).toISOString();

            if (!permission) {
                metadata.success = false;
                metadata.message = "Permission Not Created. Please Input Correct Credentials....";
                await publishToRedisPubSub("response", JSON.stringify({ data: data, metadata: metadata }));
                return;
            }

            data = { ...data, result: permission };
            metadata.success = true;
            metadata.message = "Permission Created Successfully....";

            await publishToRedisPubSub("response", JSON.stringify({ data: data, metadata: metadata }));
            return;

        }




    } catch (error) {
        console.log(error);
        console.log("Something went wrong while handling in PERMISSION SERVICE while Creating Permission....");
    }

};


const updatePermissionDetails = async (data, metadata) => {
    try {


        // const data = {
        //     _id: <_id>,
        //     name: <name>,
        //     description: <description>,
        //     nextTopicToPublish: <nextTopicToPublish>,
        //     roles: <roles>,
        //     created_by: <created_by>,
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

        // If These request have come from the PERMISSION SERVICE then Indeed they are some Control Panel Operations thus Send Response Back To the User who initiated these request
        if (metadata.source === "permission-service") {
            const updatedPermissionData = {
                name: data.name,
                description: data.description,
                nextTopicToPublish: data.nextTopicToPublish,
                roles: data.roles,
                created_by: data.created_by,
            };

            const filter = {
                _id: data._id,
            };

            const permission = await Permission.findOneAndUpdate(filter, updatedPermissionData);

            metadata.source = CURR_SERVICE_NAME;
            metadata.updatedAt = (new Date()).toISOString();

            if (!permission) {
                metadata.success = false;
                metadata.message = "Permission Not Updated. Please Input Correct Credentials....";
                await publishToRedisPubSub("response", JSON.stringify({ data: data, metadata: metadata }));
                return;
            }

            data = { ...data, result: permission };
            metadata.success = true;
            metadata.message = "Permission Updated Successfully....";

            await publishToRedisPubSub("response", JSON.stringify({ data: data, metadata: metadata }));
            return;

        }




    } catch (error) {
        console.log(error);
        console.log("Something went wrong while handling in PERMISSION SERVICE while Updating Permission....");
    }
};


const deleteSpecificPermission = async (data, metadata) => {
    try{
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

        // If These request have come from the PERMISSION SERVICE then Indeed they are some Control Panel Operations thus Send Response Back To the User who initiated these request
        if (metadata.source === "permission-service") {
           
            const filter = {
                _id: data._id,
            };

            const permission = await Permission.findOneAndDelete(filter);

            metadata.source = CURR_SERVICE_NAME;
            metadata.updatedAt = (new Date()).toISOString();

            if (!permission) {
                metadata.success = false;
                metadata.message = "Permission Not Deleted. Please Input Correct Credentials....";
                await publishToRedisPubSub("response", JSON.stringify({ data: data, metadata: metadata }));
                return;
            }

            data = { ...data, result: permission };
            metadata.success = true;
            metadata.message = "Permission Deleted Successfully....";

            await publishToRedisPubSub("response", JSON.stringify({ data: data, metadata: metadata }));
            return;

        }




    } catch (error) {
        console.log(error);
        console.log("Something went wrong while handling in PERMISSION SERVICE while Updating Permission....");
    }
};


const handleUnknownEvent = async (data, metadata) => {
    await publishToRedisPubSub("unknown", JSON.stringify({ data: data, metadata: metadata }));
};




const consumeEvents = async () => {
    try {


        // List of All Topics to Consume to run this Service
        const listOfTopicsToConsume = [
            "permissions.check",
            "permissions.control.search",
            "permissions.control.getPermission",
            "permissions.control.create",
            "permissions.control.update",
            "permissions.control.delete",
        ];



        // List of Functions that will be used for processing the events
        const handlingFunctions = {
            "permissions.check": checkIfPermitted,
            "permissions.control.search": searchPermissions,
            "permissions.control.getPermission": getSpecificPermissionDetails,
            "permissions.control.create": createNewPermission,
            "permissions.control.update": updatePermissionDetails,
            "permissions.control.delete": deleteSpecificPermission,
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