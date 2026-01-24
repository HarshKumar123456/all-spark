import "dotenv/config";
import { v4 as uuidv4 } from "uuid";
import { sendEvent } from "../../utils/v1/kafkaProducer.js";
import getPartition from "../../utils/v1/getPartition.js";


const CURR_SERVICE_NAME = "api";
const DEFAULT_PARTITIONS_OF_KAFKA_TOPICS = process.env.DEFAULT_PARTITIONS_OF_KAFKA_TOPICS || 4;
const DEFAULT_TOPIC_TO_PUBLISH = process.env.DEFAULT_TOPIC_TO_PUBLISH || "request";




const signupController = async (req, res) => {

    try {
        const { name, user_name, email, password, mobile_no } = req.body;


        if (!name || !user_name || !email || !password || !mobile_no) {
            return res.status(400).json({
                success: false,
                message: "Please Provide All the Required Fields like: name, user_name, email, password, mobile_no....",
            });
        }


        const clientId = req.get("client-id");
        const requestId = uuidv4();
        const createdAt = (new Date()).toISOString();


        const data = {
            name: name,
            user_name: user_name,
            email: email,
            password: password,
            mobile_no: mobile_no,
        };


        const metadata = {
            // Not To Be Changed Fields

            clientId: clientId, // This is Websocket Id Which will be used for sending back the data to the client
            requestId: requestId, // This will be request id generated randomly but uniquely to traverse the path through which our request has been processed around in the system
            actor: {
                role: "PUBLIC",
            },
            operation: "signup", // This will tell about what initial request was and processing will be done as per this 
            createdAt: createdAt, // Time when this request was created

            // To be Changed Fields

            source: CURR_SERVICE_NAME,
            updatedAt: (new Date()).toISOString(), // Every other function will update this after its processing so that it can be tracked how much time that function took to execute
        };


        const topic = DEFAULT_TOPIC_TO_PUBLISH;
        const partition = getPartition();

        await sendEvent(topic, partition, data, metadata);

        return res.status(202).json({
            success: true,
            message: "Signup Request is Accepted Successfully....",
        });

    } catch (error) {

        console.log(error);
        console.log("Something went wrong while handling in API while Signing Up....");

        return res.status(500).json({
            success: false,
            message: "Something went wrong while Signing Up....",
            error
        });

    }

};


const loginController = async (req, res) => {

    try {
        const { user_name, email, password } = req.body;


        if (!(password && (user_name || email))) {
            return res.status(400).json({
                success: false,
                message: "Please Provide All the Required Fields like: email + password or user_name + password....",
            });
        }


        const clientId = req.get("client-id");
        const requestId = uuidv4();
        const createdAt = (new Date()).toISOString();


        const data = {
            user_name: user_name,
            email: email,
            password: password,
        };


        const metadata = {
            // Not To Be Changed Fields

            clientId: clientId, // This is Websocket Id Which will be used for sending back the data to the client
            requestId: requestId, // This will be request id generated randomly but uniquely to traverse the path through which our request has been processed around in the system
            actor: {
                role: "PUBLIC",
            },
            operation: "login", // This will tell about what initial request was and processing will be done as per this 
            createdAt: createdAt, // Time when this request was created

            // To be Changed Fields

            source: CURR_SERVICE_NAME,
            updatedAt: (new Date()).toISOString(), // Every other function will update this after its processing so that it can be tracked how much time that function took to execute
        };


        const topic = DEFAULT_TOPIC_TO_PUBLISH;
        const partition = getPartition();

        await sendEvent(topic, partition, data, metadata);

        return res.status(202).json({
            success: true,
            message: "Login Request is Accepted Successfully....",
        });

    } catch (error) {

        console.log(error);
        console.log("Something went wrong while handling in API while Logging In....");

        return res.status(500).json({
            success: false,
            message: "Something went wrong while Logging In....",
            error
        });

    }

};




export { signupController, loginController };