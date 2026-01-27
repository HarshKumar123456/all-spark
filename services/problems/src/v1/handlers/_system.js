import Problem from "../../../models/v1/problems.js";
import { getFromCache, setToCache } from "../../../utils/v1/redisCacheManagement.js";
import { publishToRedisPubSub } from "../../../utils/v1/redisPublisher.js";
import sanitizeResponse from "../../../utils/v1/sanitizeResponse.js";


const CURR_SERVICE_NAME = "problem-service";




const _systemGetProblemsOfStartedContest = async (data, metadata) => {
    try {


        // const data = {
        //     ...(Some Data Recieved From The Client Side or Initial Request to the API),
        //     result: <result>, // Some Data Required To Send to Client Side or to source who does the Initial Request to the API
        //     _system: {
        //         data: {
        //             problems: <problems>, // Required to Get Problems If required while Observability and more
        //         },
        //         metadata: {
        //             source: "contest-service",
        //             createdAt: "<Date in ISO String Format>", // Time when this System's internal Data Processing Request was created
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

        metadata.cache = {
            hits: 0,
            misses: 0,
        };

        if (metadata.source === "contest-service") {

            metadata.source = CURR_SERVICE_NAME;


            // The List Of Problems to send to the Participant of the Contest 
            let result = [];

            const listOfProblemsToFind = data._system.data.problems;

            // Find all the Problems
            for (let index = 0; index < listOfProblemsToFind.length; index++) {
                const idOfProblem = listOfProblemsToFind[index];

                const cachingInfo = {
                    cacheKey: `problems:v1:_id:${idOfProblem}`,
                    cacheTTL: 7200, // In Seconds thus it becomes 7200/60 = 120 Minutes = 2 Hours
                };


                let queryResult;
                const { isValueFound, value } = await getFromCache(cachingInfo.cacheKey);

                // Search in the Cache If Available then Send via here
                if (isValueFound) {
                    queryResult = value;
                    metadata.cache.hits++;
                }
                else {

                    // Get The Specific Problem's Details
                    const problem = await Problem.findById(idOfProblem).lean();

                    queryResult = problem;
                    metadata.cache.misses++;
                }


                if (queryResult) {
                    // Set The Successful Result to Cache Not Using Await as we don't want to be Waiting while It Cache Up Things for us we have sent please cache it if it does then ok or else we will try from DB until it set things right up in the cache
                    setToCache(cachingInfo.cacheKey, queryResult, cachingInfo.cacheTTL);

                    // Save the Problem into the Final Result to send Participant & Remeber to Remove Private Test Case as they are private thus not to be shown to Users :)
                    queryResult.test_cases = (queryResult.test_cases).map((test_case) => {
                        return {
                            language_id: test_case.language_id,
                            public_test_cases: test_case.public_test_cases,
                        };
                    })
                    result = [...result, queryResult];
                }

            }


            // Drop the "data._system" as that field is required for only tasks in the System it has no significance to Users other than revealing our business flow which is kind of also reveal already if your'e reading this as it is Open source (But why to even send which is not required probably You got the point i guess) :) 
            data = await sanitizeResponse(data);

            metadata.updatedAt = (new Date()).toISOString();

            if (result.length !== listOfProblemsToFind.length) {

                metadata.success = false;
                metadata.message = "Problems for the Contest Not Found. Although Contest Started. Sorry for the trouble Please Contact the Support Team or Admins....";
                await publishToRedisPubSub("response", JSON.stringify({ data: data, metadata: metadata }));
                return;
            }


            metadata.success = true;
            metadata.message = "Contest Started and the Problems for the Contest are Successfully Found....";

            // Carefully Look here We Are Not Overwriting the existing "data.result" here instead creating another field "listOfProblemsInContest" in "data" object which will Be Used By The Front End to Show Problems Related to the Contest and the "data.result" field will contain the response from the CONTEST SERVICE that is what are the Details of the Participant or More
            data = { ...data, listOfProblemsInContest: result };

            // Send Response Back to the User Via Response Channel
            await publishToRedisPubSub("response", JSON.stringify({ data: data, metadata: metadata }));
            return;
        }




    } catch (error) {

        console.log(error);
        console.log("Something went wrong while handling in PROBLEM SERVICE while Getting the Contest's Problems but Contest Started....");
        metadata.success = false;
        metadata.message = "Contest Started but Something Went Wrong while Getting Contest's Problems. Please Check if Contest Exists and/or Try Logging in again....";
        await publishToRedisPubSub("response", JSON.stringify({ data: data, metadata: metadata }));
        return;
    }
};

export { _systemGetProblemsOfStartedContest };