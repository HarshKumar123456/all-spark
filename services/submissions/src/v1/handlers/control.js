import Problem from "../../../models/v1/problems.js";
import { deleteFromCache, setToCache } from "../../../utils/v1/redisCacheManagement.js";
import { publishToRedisPubSub } from "../../../utils/v1/redisPublisher.js";


const CURR_SERVICE_NAME = "submission-service";

// PLEASE NOTE: Do Not Try to Implement Caching Here in Control Panel Functions as the operartions need consistency everytime and can tolerate the delay over the consistency. However it is not Strict Rule If required then we can implement caching here as well but just remember before being in hurry to implement the caching. Thanks :)








export {  };