import Contest from "../../../models/v1/contests.js";
import { publishToRedisPubSub } from "../../../utils/v1/redisPublisher.js";
import { sendEvent } from "../../../utils/v1/kafkaProducer.js";


const DEFAULT_PARTITIONS_OF_KAFKA_TOPICS = process.env.DEFAULT_PARTITIONS_OF_KAFKA_TOPICS || 4;
const CURR_SERVICE_NAME = "contest-service";





export {  };