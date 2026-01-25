import Problem from "../../../models/v1/problems.js";
import { publishToRedisPubSub } from "../../../utils/v1/redisPublisher.js";


const DEFAULT_PARTITIONS_OF_KAFKA_TOPICS = process.env.DEFAULT_PARTITIONS_OF_KAFKA_TOPICS || 4;
const CURR_SERVICE_NAME = "problem-service";




const getContestProblems = async (data, metadata) => {

    await publishToRedisPubSub("unknown", JSON.stringify({data: data, metadata: metadata}));

};

export { getContestProblems };