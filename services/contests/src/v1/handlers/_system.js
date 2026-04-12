import Contest from "../../../models/v1/contests.js";
import { publishToRedisPubSub } from "../../../utils/v1/redisPublisher.js";
import { sendEvent } from "../../../utils/v1/kafkaProducer.js";
import Participant from "../../../models/v1/participants.js";
import getPartition from "../../../utils/v1/getPartition.js";


const DEFAULT_PARTITIONS_OF_KAFKA_TOPICS = process.env.DEFAULT_PARTITIONS_OF_KAFKA_TOPICS || 4;
const CURR_SERVICE_NAME = "contest-service";




const _systemSubmissionUpdatedThusUpdateParticipantDetails = async (data, metadata) => {


  try {


    // const data = {
    //     ...(Some Data Recieved From The Client Side or Initial Request to the API),
    //     result: <result>, // Some Data Required To Send to Client Side or to source who does the Initial Request to the API
    //     _system: {
    //         data: {
    //             _id: submission._id, // Required to Further Identify Which Submission has been Judged and needs to be Updated
    //             problem_id: submission.problem_id, // The Problem Id which is Related to the Submission
    //             is_for_public_test_cases: submission.is_for_public_test_cases, // Tells Info About the Test Cases Whether it was for the Public Test Cases or Private Test Cases
    //             is_cpu_executed: submission.is_cpu_executed, // This Should Be Marked True After the Execution onto the CPU  
    //             test_cases: test_cases, // These Test Cases Will be Supplied to the Code Execution Engine to Test if the Source Code is Running it Correctly with the Constraints Provided in the Individual Test Cases & They Have Fetched From the PROBLEM SERVICE thus find Structure of these test cases from there and after the completion of the CPU execution these will be updated into the "submission.test_cases"
    //             created_by: submission.created_by,
    //             source_code: submission.source_code,
    //             language_id: submission.language_id,
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



    // Since the Successful Submission is Made thus it requires to update the Participant's Details thus append in Submissions Array of the Participant and then Score Calculation Further Proceeds But here is it not Implemented as of Now can be added later.
    if (data._system.metadata.source === "submission-service") {

      data._system.metadata.source = CURR_SERVICE_NAME;

      const {
        _id,
        created_by,
        problem_id,
        is_for_public_test_cases,
        test_cases
      } = data._system.data;


      const filter = {
        user_id: created_by,
      };


      // lean() is done here to make sure we get only POJO and Free the DataBase Connection while we are performing operations on our Data Object and also get no errors while accessing the object's entities and running a map operation onto the array type entities of the Object
      const participant = await Participant.findOne(filter).lean();

      if (!participant) {
        console.log("Sorry! This Participant with user_id: ", created_by, " doesn't Exists....");

        data._system.metadata.success = false;
        data._system.metadata.message = `Sorry! This Participant with user_id: ${created_by} doesn't Exists....`;
        data._system.metadata.updatedAt = (new Date()).toISOString();

        const topic = "contests._system.participant.update.corrupt";
        const partition = await getPartition();
        await sendEvent(topic, partition, data, metadata);
        return;
      }


      // Process the Submission and if it is Successfully Executed and Accepted then update the Score of the Participant 

      // Each Participant will get 10 marks for Each test case of the Problem to be Successfully Accepted

      // Ranks of the Participants will be decided by the Score and The Earlier they Make Submission 

      // Yes this is Vague Implementation and we should move towards more processing of the Submission Details But For now it is Just as OK 


      // Process each Test Case

      let isUpdatedProblemSubmissions = false;
      let isCurrSubmissionAccepted = false; // bool 
      let passedTestCases = 0;

      // If the Submission Was for Public Test Cases Just Make the Problem Status as "attempted" and if it was for Private Test Cases then Check If It met to pass all the Test Cases and if Yes then Update the Problem Status as "solved"
      if (is_for_public_test_cases === false) {


        const submissionTestCases = test_cases;

        // console.log("For Submission id: ", _id, "length of submissionTestCases is: ", submissionTestCases.length, "\n\n");

        for (let index = 0; index < submissionTestCases.length; index++) {
          const testCase = submissionTestCases[index];
          // console.log("Processing Test Case: ", index);
          // console.log(testCase);
          if (testCase.status.id === 3) {
            // console.log("This Test Case Is Accepted Thus Incrementing: ", passedTestCases);
            passedTestCases++;
          }
          else {
            isCurrSubmissionAccepted = false;

            // Please Note Carefully In Practice Problems We Stop Processing the Test Cases once we got the first not accepcted Test Case but in the Contest Problems Every Test Case Passed Counts and Updates the Score of the Participant Thus Process Every Test Case of the Submission and Thus This will Update The Score of the Participant

            // console.log("Breaking Here for Test Case: ", index);
            // break;
          }
        }

        // Check If Passed All Test Cases
        if (passedTestCases === submissionTestCases.length) {
          isCurrSubmissionAccepted = true;
        }


      }


      // First of All Try to Update if It Exists Already in Attempted Problems and If Yes then Update its Status from the Current Submission
      const existingTriedProblems = participant.tried_problems;
      participant.tried_problems = (existingTriedProblems).map((triedProblem) => {
        const newTriedProblemDetails = { ...triedProblem };
        // console.log("Inside Map of Tried Problems & Conparing the Problem_id ", newTriedProblemDetails.problem_id, "  ", problem_id);
        // console.log(newTriedProblemDetails);
        if (newTriedProblemDetails.problem_id === problem_id) {
          // console.log("\n\nIt Already Had Submission related to this Problem....");
          isUpdatedProblemSubmissions = true;
          // Append Current Submission Under Consideration into the Submissions Made By The Participant for the Current Problem
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

          // Update the Passed Test Cases of the Problem
          newTriedProblemDetails.passedTestCases = newTriedProblemDetails.passedTestCases > passedTestCases ? newTriedProblemDetails.passedTestCases : passedTestCases;

        }
        return newTriedProblemDetails;
      });


      // If This Is Problem's First Submission Made By The Participant then Make a New Entry in the "tried_problems" field of the Participant's Data's Object
      if (isUpdatedProblemSubmissions === false) {
        const newTriedProblemDetails = {
          problem_id: problem_id,
          status: (isCurrSubmissionAccepted === true ? "solved" : "attempted"),
          submissions: [_id], // Adding the Id of the Current Submission Under Consideration 
          passedTestCases: passedTestCases,
        };

        // Update the Participant's Data Object
        participant.tried_problems =
          [
            ...(participant.tried_problems),
            newTriedProblemDetails,
          ];

        isUpdatedProblemSubmissions = true;
      };


      await Participant.findOneAndUpdate(filter, participant);


      data._system.metadata.success = true;
      data._system.metadata.message = `This Participant with user_id: ${created_by} updated Successfully....`;
      data._system.metadata.updatedAt = (new Date()).toISOString();

      const topic = "contests._system.participant.update.complete";
      const partition = await getPartition();
      await sendEvent(topic, partition, data, metadata);
      return;
    }

  }
  catch (error) {
    console.log(error);
    console.log("Something went wrong while handling in CONTEST SERVICE while Updating the Participant's Details....");
    data._system.metadata.source = CURR_SERVICE_NAME;
    data._system.metadata.success = false;
    data._system.metadata.message = "Something went Wrong while Updating the Participant's Details....";
    data._system.metadata.updatedAt = (new Date()).toISOString();
    const topic = "contests._system.participant.update.complete";
    const partition = await getPartition();
    await sendEvent(topic, partition, data, metadata);
    return;

  }

};








export {
  _systemSubmissionUpdatedThusUpdateParticipantDetails,
};