import Contest from "../../../models/v1/contests.js";
import Participant from "../../../models/v1/participants.js";
import getPartition from "../../../utils/v1/getPartition.js";
import { sendEvent } from "../../../utils/v1/kafkaProducer.js";
import { publishToRedisPubSub } from "../../../utils/v1/redisPublisher.js";
import { getFromCache, setToCache } from "../../../utils/v1/redisCacheManagement.js";


const CURR_SERVICE_NAME = "contest-service";




const searchContests = async (data, metadata) => {
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




        const filter = data.filter || {};


        const projection = {
            support_team: 0,
            problems: 0,
        }


        if (metadata.source === "permission-service") {


            const contest = await Contest.find(filter).select(projection).lean();


            metadata.source = CURR_SERVICE_NAME;
            metadata.updatedAt = (new Date()).toISOString();

            if (!contest) {
                metadata.success = false;
                metadata.message = "Contests Not Found. Please Provide Correct Fields....";
                await publishToRedisPubSub("response", JSON.stringify({ data: data, metadata: metadata }));
                return;
            }

            data = { ...data, result: contest };

            metadata.success = true;
            metadata.message = "Contests Found Successfully....";
            await publishToRedisPubSub("response", JSON.stringify({ data: data, metadata: metadata }));

            return;
        }




    } catch (error) {
        console.log(error);
        console.log("Something went wrong while handling in CONTEST SERVICE while Searching Contests....");
        metadata.success = false;
        metadata.message = "Something Went Wrong. Please Provide All Details and/or Try Logging in again....";
        await publishToRedisPubSub("response", JSON.stringify({ data: data, metadata: metadata }));
        return;
    }

};


const getAllContests = async (data, metadata) => {
    try {


        // const data = {
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




        const filter = {};

        const projection = {
            support_team: 0,
            problems: 0,
        }

        const cachingInfo = {};

        if (metadata.source === "permission-service") {

            cachingInfo.cacheKey = "contests:v1:all";
            cachingInfo.cacheTTL = 14400; // In Seconds thus it becomes 14400/60 = 240 Minutes = 4 Hours

            let queryResult;
            const { isValueFound, value } = await getFromCache(cachingInfo.cacheKey);

            // Search in the Cache If Available then Send via here
            if (isValueFound) {
                queryResult = value;
                metadata.cache = "HIT";
            }
            else {
                // Get The List of All Contests and In the List Who is Support that is somewhat unneccessary to send and also problems in that are too unneccessary to send thus remove them and remember that the id are string format however they are actually the Foreign Keys in string form and since we have used lean thus they will not be populated if later implementation tries to populate then please change the DB models before that
                const contest = await Contest.find(filter).select(projection).lean();
                queryResult = contest;
                metadata.cache = "MISS";
            }




            metadata.source = CURR_SERVICE_NAME;
            metadata.updatedAt = (new Date()).toISOString();

            if (!queryResult) {
                metadata.success = false;
                metadata.message = "Contests Not Found. Please Provide Correct Fields....";
                await publishToRedisPubSub("response", JSON.stringify({ data: data, metadata: metadata }));
                return;
            }

            // Set The Successful Result to Cache Not Using Await as we don't want to be Waiting while It Cache Up Things for us we have sent please cache it if it does then ok or else we will try from DB until it set things right up in the cache
            setToCache(cachingInfo.cacheKey, queryResult, cachingInfo.cacheTTL);

            // Process the data and prepare the Response
            data = { ...data, result: queryResult };

            metadata.success = true;
            metadata.message = "Contests Found Successfully....";
            await publishToRedisPubSub("response", JSON.stringify({ data: data, metadata: metadata }));

            return;
        }




    } catch (error) {
        console.log(error);
        console.log("Something went wrong while handling in CONTEST SERVICE while Getting All Contests....");
        metadata.success = false;
        metadata.message = "Something Went Wrong. Please Provide All Details and/or Try Logging in again....";
        await publishToRedisPubSub("response", JSON.stringify({ data: data, metadata: metadata }));
        return;
    }
};


const getSpecificContestDetails = async (data, metadata) => {
    try {


        // const data = {
        // _id: <_id>,
        // slug: <slug>,
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




        const { _id, slug } = data;

        const filter = {};
        const cachingInfo = {};

        if (_id) {
            filter._id = _id;
            cachingInfo.cacheKey = `contests:v1:_id:${_id}`;
        }

        if (slug) {
            filter.slug = slug;
            cachingInfo.cacheKey = `contests:v1:slug:${slug}`;
        }


        if (metadata.source === "permission-service") {


            cachingInfo.cacheTTL = 7200; // In Seconds thus it becomes 7200/60 = 120 Minutes = 2 Hours


            let queryResult;
            const { isValueFound, value } = await getFromCache(cachingInfo.cacheKey);

            // Search in the Cache If Available then Send via here
            if (isValueFound) {
                queryResult = value;
                metadata.cache = "HIT";
            }
            else {

                // Get The Specific Contest's Details
                const contest = await Contest.findOne(filter).lean();

                queryResult = contest;
                metadata.cache = "MISS";
            }


            metadata.source = CURR_SERVICE_NAME;
            metadata.updatedAt = (new Date()).toISOString();

            if (!queryResult) {
                metadata.success = false;
                metadata.message = "Contest Not Found. Please Provide Correct Fields....";
                await publishToRedisPubSub("response", JSON.stringify({ data: data, metadata: metadata }));
                return;
            }

            // Set The Successful Result to Cache Not Using Await as we don't want to be Waiting while It Cache Up Things for us we have sent please cache it if it does then ok or else we will try from DB until it set things right up in the cache
            setToCache(cachingInfo.cacheKey, queryResult, cachingInfo.cacheTTL);


            // Process the data and prepare the Response


            // Drop The Support Team Info And Problems That are In That Contests as this is Normal Usage Event
            queryResult = { ...queryResult, support_team: [], problems: [] };

            data = { ...data, result: queryResult };

            metadata.success = true;
            metadata.message = "Contest Found Successfully....";
            await publishToRedisPubSub("response", JSON.stringify({ data: data, metadata: metadata }));

            return;
        }




    } catch (error) {
        console.log(error);
        console.log("Something went wrong while handling in CONTEST SERVICE while Getting Specific Contest Details....");
        metadata.success = false;
        metadata.message = "Something Went Wrong. Please Provide All Details and/or Try Logging in again....";
        await publishToRedisPubSub("response", JSON.stringify({ data: data, metadata: metadata }));
        return;
    }
};


const registerForContest = async (data, metadata) => {
    try {


        // const data = {
        // contest_id: <contest_id>,
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




        const { contest_id } = data;
        const user_id = metadata.actor.userId;

        const filter = {
            user_id: user_id,
            contest_id: contest_id,
        }

        if (metadata.source === "permission-service") {


            // We are considering that the Contest and User with given Id exists thus creating the Participant for that 
            const participantData = {
                user_id: user_id,
                contest_id: contest_id,
            };

            // Before Creating Object check if Already Registered User
            const existingParticipant = await Participant.findOne(filter).lean();
            if (existingParticipant) {
                data = { ...data, result: existingParticipant };
                metadata.success = false;
                metadata.message = "Already Registered For The Contest....";
                metadata.updatedAt = (new Date()).toISOString();
                await publishToRedisPubSub("response", JSON.stringify({ data: data, metadata: metadata }));
                return;
            }


            // Before Creating Object Check if the Contest is Started or not and if started then do not register the User For this Contest
            const currentDate = new Date();
            const findContestFilter = {
                _id: contest_id,
                start_time: {
                    $lt: currentDate,
                }
            };
            const contest = await Contest.findOne(findContestFilter);
            if (!contest) {
                data = { ...data, result: "Either Contest Not Found Or Started" };
                metadata.success = false;
                metadata.message = "Sorry!! Either the Contest Not Found or it is Already Started. Please Register in upcoming Contests Before their Starting Time....";
                metadata.updatedAt = (new Date()).toISOString();
                await publishToRedisPubSub("response", JSON.stringify({ data: data, metadata: metadata }));
                return;
            }

            // Set Total Duration Allowed from the Contest Duration So that It can be compared later when the User Starts the Contest and Thus User's Contest is Auto Ended and if The User tries to make Submissions then they will be discarded by checking the "end_time" field which will be set post "total_duration" from "start_time" within the Range Of Contest's Running Window
            participantData.total_duration = contest.duration;

            // Register Participant
            const newParticipant = await new Participant(participantData).save();

            metadata.source = CURR_SERVICE_NAME;
            metadata.updatedAt = (new Date()).toISOString();

            if (!newParticipant) {
                metadata.success = false;
                metadata.message = "Not Registered for the Contest....";
                await publishToRedisPubSub("response", JSON.stringify({ data: data, metadata: metadata }));
                return;
            }


            // Process the data and prepare the Response
            data = { ...data, result: newParticipant };

            metadata.success = true;
            metadata.message = "Registered for the Contest Successfully....";
            await publishToRedisPubSub("response", JSON.stringify({ data: data, metadata: metadata }));

            return;
        }




    } catch (error) {
        console.log(error);
        console.log("Something went wrong while handling in CONTEST SERVICE while Registering for Contest Details....");
        metadata.success = false;
        metadata.message = "Something Went Wrong. Please Provide All Details and/or Try Logging in again....";
        await publishToRedisPubSub("response", JSON.stringify({ data: data, metadata: metadata }));
        return;
    }
};


const startContest = async (data, metadata) => {


    try {


        // const data = {
        // contest_id: <contest_id>,
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




        const { contest_id } = data;
        const user_id = metadata.actor.userId;

        const filter = {
            user_id: user_id,
            contest_id: contest_id,
        }

        if (metadata.source === "permission-service") {


            // We are considering that the Contest and User with given Id exists thus creating the Participant for that 
            const start_time = new Date();


            const partition = getPartition();

            // Before Starting Object check if User Already Started the Contest
            let existingParticipant = await Participant.findOne(filter);

            if (!existingParticipant) {
                metadata.success = false;
                metadata.message = "Not Registered for the Contest thus Sorry for this Contest You are not allowed to participate....";
                await publishToRedisPubSub("response", JSON.stringify({ data: data, metadata: metadata }));
                return;
            }

            if (existingParticipant.start_time) {
                data = { ...data, result: existingParticipant };
                metadata.success = false;
                metadata.message = "Already Started The Contest....";
                await sendEvent("contests.startContest.complete", partition, data, metadata);
                return;
            }

            // Update the End Time So that It can Be compared when the Submission is Made & If The Submission Exceeds the "end_time" then Submission will not be Processed
            const liberty_of_time = 300000; // 5 Minutes Liberty is given to the Participants to Balance the Trade Off of the Processing Of The Events
            const end_time = new Date(start_time.getTime() + existingParticipant.total_duration + liberty_of_time);

            // Update And Save Changes
            existingParticipant.start_time = start_time;
            existingParticipant.end_time = end_time;

            await existingParticipant.save();

            metadata.source = CURR_SERVICE_NAME;
            metadata.updatedAt = (new Date()).toISOString();



            // Process the data and prepare the Response
            data = { ...data, result: existingParticipant };

            metadata.success = true;
            metadata.message = "Started the Contest Successfully....";
            await sendEvent("contests.startContest.complete", partition, data, metadata);

            return;
        }




    } catch (error) {
        console.log(error);
        console.log("Something went wrong while handling in CONTEST SERVICE while Starting the Contest....");
        metadata.success = false;
        metadata.message = "Something Went Wrong. Please Provide All Details and/or Try Logging in again....";
        await publishToRedisPubSub("response", JSON.stringify({ data: data, metadata: metadata }));
        return;
    }

};




export {
    searchContests,
    getAllContests,
    getSpecificContestDetails,
    registerForContest,
    startContest,

};