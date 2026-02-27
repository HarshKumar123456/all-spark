import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import CodeEditor from "../../components/editor/CodeEditor";
import { useAuthContext } from "../../contexts/AuthContext";
import { toast } from "sonner";
import { useWebSocketContext } from "../../contexts/WebSocketContext";
import axios from "axios";
import { useSocketListener } from "../../hooks/useSocketListener";

const ContestProblemEditor = () => {

    const sleep = async (milliSeconds) => {
        return new Promise((resolve) => setTimeout(resolve, milliSeconds));
    };

    const sortByCreationTimeCompareFunction = (a, b) => {
        if (b.createdAt > a.createdAt) {
            return 1;
        }
        else if (a.createdAt > b.createdAt) {
            return -1;
        }
        else {
            return 0;
        }
    };


    const getLocalDateTimeStringFromISOString = (ISOString) => {

        const ISOStringDate = new Date(ISOString);
        let localDateTimeString = ISOStringDate.toDateString() + " " + ISOStringDate.toLocaleTimeString();

        return localDateTimeString;

    };


    const navigate = useNavigate();

    const { token, user } = useAuthContext();

    const [isLoggedIn, setIsLoggedIn] = useState(false); // boolean

    const { contestSlug, problemIndex } = useParams();


    const [visiblePart, setVisiblePart] = useState({
        // Only Field's Value is To be Changed in this Object and Adding or Removing Should be Done With Caution As That May Break the Other UI Components
        problemDescription: true,
        problemSubmissions: false,
    });

    const [problemDetails, setProblemDetails] = useState(null); // null or Object

    const [submissionDetails, setSubmissionDetails] = useState(null); // null or Object

    const [submissionFilter, setSubmissionFilter] = useState("private"); // "all" or "public" or "private"

    const [allSubmissionsToThisProblem, setAllSubmissionsToThisProblem] = useState(null); // null or Array

    const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000/api/v1";

    const { isConnected, clientId } = useWebSocketContext();

    const [contestDetails, setContestDetails] = useState(null); // null or Object




    // This Marks Visibility of All the Content As False on the First Half of the Page
    const hideAllContent = () => {
        setVisiblePart((prev) => {
            const newVisiblePart = {};
            for (let part in prev) {
                newVisiblePart[part] = false;
            }
            return newVisiblePart;
        })
    }


    const handleClickOnVisiblePartControls = (visiblePart) => {
        hideAllContent();
        setVisiblePart((prev) => {
            const newVisiblePart = { ...prev, [visiblePart]: true };
            return newVisiblePart;
        })
    };


    const handleClickOnSubmissionsFilterButton = (e) => {
        setSubmissionFilter(e.target.id);
    };


    const enableRunAndSubmitButtons = () => {
        document.getElementById("run-button").disabled = false;
        document.getElementById("submit-button").disabled = false;
    };


    const disableRunAndSubmitButtons = () => {
        document.getElementById("run-button").disabled = true;
        document.getElementById("submit-button").disabled = true;
    };



    const handleClickOnRunButton = async (e) => {
        console.log("Run Button Is Clicked....");
        console.log(e.target);

        // Disable Run & Submit Buttons Until Function Doesn't Exits
        disableRunAndSubmitButtons();

        try {
            // If Token is Not Present Might be User Logged Out or Deleted Token Thus redirect to Login Page
            if (!token) {
                toast.error("Login Required....");
                await sleep(1000);
                toast.loading("Redirecting you to Login Page....",);
                await sleep(1000);

                // Dismiss All Toasts
                toast.dismiss();

                navigate("/login");
            }
            // else if problemDetails or submissionDetails are not there then say Try Again after Some time
            else if (!problemDetails || !submissionDetails) {
                console.log("Either the problemDetails or submissionDetails is missing: ");
                console.log(problemDetails);
                console.log(submissionDetails);
                toast.error("Loading! Please Try Again After Some Time....");
            }
            // else if User Is Logged in Then Run Code against Public Test cases Via API Call
            else {
                console.log("Bhai Run Button is Clicked & User Logged In: ");
                console.log(submissionDetails);
                console.log("Ready to Make API Call ");


                const payload = {
                    problem_id: problemDetails._id,
                    contest_id: contestDetails._id,
                    language_id: submissionDetails.language_id,
                    source_code: submissionDetails.source_code,
                    is_for_public_test_cases: true,
                };

                console.log("Payload For the API Call: ");
                console.log(payload);

                const response = await axios.post(`${API_BASE}/submissions/contest/create`, payload, {
                    headers: {
                        "Content-Type": "application/json",
                        "client-id": clientId,
                        "authorization": token,
                    }
                })

                // console.log("Response From the SUBMISSIONS' API Call: ");
                // console.log(response);
                toast.success(response.data.message);


            }
        } catch (error) {
            console.log(error);
            console.log("Something Went Wrong While Making the SUBMISSIONS' API Call....", error);
            toast.error("Something went Wrong....");
        }

        // When Public Test Cases Submission Request is Made Then Show the Public Submissions
        setSubmissionFilter("public");
        hideAllContent();
        setVisiblePart((prev) => {
            return {
                ...prev,
                "problemSubmissions": true,
            }
        });

        // Add Delay of 7 Second and Then Enable Run And Submit Buttons for Limiting Users to Rapidly make Submissions and Getting Their Submission Status in the Meantime
        await sleep(7000);
        enableRunAndSubmitButtons();
    };


    const handleClickOnSubmitButton = async (e) => {
        console.log("Submit Button Is Clicked....");
        console.log(e.target);

        // Disable Run & Submit Buttons Until Function Doesn't Exits
        disableRunAndSubmitButtons();

        try {
            // If Token is Not Present Might be User Logged Out or Deleted Token Thus redirect to Login Page
            if (!token) {
                toast.error("Login Required....");
                await sleep(1000);
                toast.loading("Redirecting you to Login Page....");
                await sleep(1000);

                // Dismiss All Toasts
                toast.dismiss();

                navigate("/login");
            }
            // else if problemDetails or submissionDetails are not there then say Try Again after Some time
            else if (!problemDetails || !submissionDetails) {
                console.log("Either the problemDetails or submissionDetails is missing: ");
                console.log(problemDetails);
                console.log(submissionDetails);
                toast.error("Loading! Please Try Again After Some Time....");
            }
            // else if User Is Logged in Then Submit Code against Private Test cases Via API Call
            else {
                console.log("Bhai Submit Button is Clicked & User Logged In: ");
                console.log(submissionDetails);
                console.log("Ready to Make API Call ");


                const payload = {
                    problem_id: problemDetails._id,
                    contest_id: contestDetails._id,
                    language_id: submissionDetails.language_id,
                    source_code: submissionDetails.source_code,
                    is_for_public_test_cases: false,
                };

                console.log("Payload For the API Call: ");
                console.log(payload);

                const response = await axios.post(`${API_BASE}/submissions/contest/create`, payload, {
                    headers: {
                        "Content-Type": "application/json",
                        "client-id": clientId,
                        "authorization": token,
                    }
                })

                // console.log("Response From the SUBMISSIONS' API Call: ");
                // console.log(response);
                toast.success(response.data.message);


            }
        } catch (error) {
            console.log(error);
            console.log("Something Went Wrong While Making the SUBMISSIONS' API Call....", error);
            toast.error("Something went Wrong....");
        }

        // When Private Test Cases Submission Request is Made Then Show the Private Submissions
        setSubmissionFilter("private");
        hideAllContent();
        setVisiblePart((prev) => {
            return {
                ...prev,
                "problemSubmissions": true,
            }
        });

        // Add Delay of 7 Second and Then Enable Run And Submit Buttons for Limiting Users to Rapidly make Submissions and Getting Their Submission Status in the Meantime
        await sleep(7000);
        enableRunAndSubmitButtons();
    };


    const handleCodeLanguageChange = (language_id) => {
        console.log("Inside Parent i.e. ContestProblemEditor Component in handleCodeLanguageChange(): ");
        console.log(language_id);
        setSubmissionDetails((prev) => {
            return {
                ...prev,
                ["language_id"]: language_id,
            };
        });
        console.log("Submission Details Now: ");
        console.log(submissionDetails);
    };


    const handleCodeStringChange = (source_code) => {
        console.log("Inside Parent i.e. ContestProblemEditor Component in handleCodeStringChange(): ");
        console.log(source_code);
        setSubmissionDetails((prev) => {
            return {
                ...prev,
                ["source_code"]: source_code,
            };
        });
        console.log("Submission Details Now: ");
        console.log(submissionDetails);
    };




    // If token or User is Changed then Update the Info Who is Logged in User's Information onto the Header
    useEffect(() => {
        setIsLoggedIn((token && user) ? true : false);
        console.log("Yo Bro We Got User: ");
        console.log(user);
    }, [token, user]);



    // Got Problem Details and Client Is Connected then Fetch All Submissions Made By This User To This Problem
    useEffect(() => {
        const fetchAllSubmissionsByUserToThisProblem = async () => {
            try {
                const response = await axios.get(`${API_BASE}/submissions/all/${problemDetails._id}`, {
                    headers: {
                        "client-id": clientId,
                        "authorization": token,
                    },
                });

                // console.log("Response From the PROBLEMS' API Call: ");
                // console.log(response);
                toast.success(response.data.message);


            } catch (error) {
                console.log(error);
                console.log("Something Went Wrong While Making the PROBLEMS' API Call....", error);
                toast.error("Something went Wrong....");
            }
        };

        // Got Problem Details and Client Is Connected & Logged In then Fetch All Submissions Made By This User To This Problem
        if (clientId && token && (problemDetails && problemDetails._id)) {
            fetchAllSubmissionsByUserToThisProblem();
        }
    }, [clientId, token, problemDetails]);



    // First of all Load the Problem Details from the localStorage variable "contestProblems" that stores the Contest's problems and Load the Contest's Details from the localStorage variable "contestDetails" that stores the contest's details
    useEffect(() => {

        const allContestProblems = JSON.parse(localStorage.getItem("contestProblems"));
        const newProblemDetails = allContestProblems[problemIndex];
        setProblemDetails(newProblemDetails);

        const newContestDetails = JSON.parse(localStorage.getItem("contestDetails"));
        setContestDetails(newContestDetails);

        // console.log("Setting Contest Problems and Contest Details....");
        // console.log(newProblemDetails);
        // console.log(newContestDetails);
        
        

    }, []);



    // Websocket Event Listening Logic - Starts Here

    // Listener 1: Handle Valid Get All Submissions Made By User Response 
    useSocketListener(
        // Selector: "Is this message for me?"
        (msg) => msg.type?.includes('response') && msg.metadata.operation?.includes("submissions.getAllSubmissionsForProblem"),

        // Handler: "What do I do with it?"
        async (msg) => {
            const { data, metadata } = msg;

            // If Request Processing was Success then Save The Submissions' Details For further Accesses 
            if (metadata?.success === true) {
                // alert("Signed up Successfully....");
                console.log(data);
                console.log(metadata);

                // Setting Submissions' Details From Event Data
                const allSubmissionForThisProblemMadeByUserDetailsFromEventData = data.result;



                setAllSubmissionsToThisProblem(() => {
                    const newAllSubmissionsToThisProblem = allSubmissionForThisProblemMadeByUserDetailsFromEventData.map((submissionDetails) => {
                        const newSubmissionDetails = { ...submissionDetails };

                        if ((submissionDetails.is_cpu_executed) === true) {
                            let passedTestCases = 0;
                            const submissionTestCases = submissionDetails.test_cases;
                            console.log("For Submission id: ", submissionDetails._id, "length of submissionTestCases is: ", submissionTestCases.length, "\n\n");
                            for (let index = 0; index < submissionTestCases.length; index++) {
                                const testCase = submissionTestCases[index];
                                console.log("Processing Test Case: ", index);
                                console.log(testCase);
                                if (testCase.status.id === 3) {
                                    console.log("This Test Case Is Accepted Thus Incrementing: ", passedTestCases);
                                    passedTestCases++;
                                }
                                else {
                                    newSubmissionDetails.status = testCase.status.description;
                                    console.log("Breaking Here for Test Case: ", index);
                                    break;
                                }
                            }

                            // Check If Passed All Test Cases
                            if (passedTestCases === submissionTestCases.length) {
                                newSubmissionDetails.status = "Accepted";
                            }
                        }
                        else {
                            newSubmissionDetails.status = "Pending";
                        }



                        return newSubmissionDetails;
                    });


                    // Sort the Array By the Creation Time
                    newAllSubmissionsToThisProblem.sort(sortByCreationTimeCompareFunction);

                    console.log("Final Processed Submission's Array: ");
                    console.log(newAllSubmissionsToThisProblem);

                    return newAllSubmissionsToThisProblem;
                });

                // Show Toast Notification that Successfully Got Submissions
                toast.success(metadata.message);

                // Sleep for 1s to show Toast Notification
                await sleep(1000);


            }
            // Else Request Processing is not done then Tell User What May Went Wrong
            else {
                console.log(data);
                console.log(metadata);

                toast.error(metadata.message);
                await sleep(1000);
                toast.error("Seems Like Something Wrong while getting your Submissions....");
                await sleep(1000);

            }
        }
    );


    // Listener 2: Handle Valid Create Submission Response 
    useSocketListener(
        // Selector: "Is this message for me?"
        // Please Note: When Submission will be Created Then "test_cases" will be empty Array and when it will have some length then It Means It is Executed Thus Update Status Accordingly
        (msg) => msg.type?.includes('response') && msg.metadata.operation?.includes("submissions.contest.create") && (msg.data.result.test_cases)?.length === 0,

        // Handler: "What do I do with it?"
        async (msg) => {
            const { data, metadata } = msg;

            // If Request Processing was Success then Save The Submission's Details For further Accesses 
            if (metadata?.success === true) {
                console.log(data);
                console.log(metadata);

                // Setting Submission's Details From Event Data
                const submissionForThisProblemMadeByUserDetailsFromEventData = data.result;


                setAllSubmissionsToThisProblem((prev) => {
                    const newAllSubmissionsToThisProblem = [
                        {
                            ...submissionForThisProblemMadeByUserDetailsFromEventData,
                            status: "Pending",
                        },
                        ...prev,
                    ];

                    console.log("Final Processed Submission's Array: ");
                    console.log(newAllSubmissionsToThisProblem);

                    return newAllSubmissionsToThisProblem;
                });

                // Show Toast Notification that Successfully Got Submissions
                toast.success(metadata.message);

                // Sleep for 1s to show Toast Notification
                await sleep(1000);


            }
            // Else Request Processing is not done then Tell User What May Went Wrong
            else {
                console.log(data);
                console.log(metadata);

                toast.error(metadata.message);
                await sleep(1000);
                toast.error("Seems Like Something Wrong while Creating your Submission....");
                await sleep(1000);

            }
        }
    );

    // Listener 3: Handle Valid Got Update of Submission Response 
    useSocketListener(
        // Selector: "Is this message for me?"
        // Please Note: When Submission will be Updated Then "test_cases" will not be empty Array and when it will have no length then It Means It is yet to Executed Thus Update Status Accordingly
        (msg) => msg.type?.includes('response') && msg.metadata.operation?.includes("submissions.contest.create") && (msg.data.result.test_cases)?.length !== 0,

        // Handler: "What do I do with it?"
        async (msg) => {
            const { data, metadata } = msg;

            // If Request Processing was Success then Save The Submission's Details For further Accesses 
            if (metadata?.success === true) {
                console.log(data);
                console.log(metadata);

                // Setting Submission's Details From Event Data
                const submissionForThisProblemMadeByUserDetailsFromEventData = data.result;


                setAllSubmissionsToThisProblem((prev) => {

                    const newAllSubmissionsToThisProblem = prev.map((submissionDetails) => {
                        const newSubmissionDetails = { ...submissionDetails };
                        // If The Updated Submission is Present then Update Status of It else Return the Same Submission
                        if (newSubmissionDetails._id === submissionForThisProblemMadeByUserDetailsFromEventData._id) {

                            if ((submissionForThisProblemMadeByUserDetailsFromEventData.is_cpu_executed) === true) {
                                let passedTestCases = 0;
                                const submissionTestCases = submissionForThisProblemMadeByUserDetailsFromEventData.test_cases;

                                console.log("For Submission id: ", submissionForThisProblemMadeByUserDetailsFromEventData._id, "length of submissionTestCases is: ", submissionTestCases.length, "\n\n");

                                for (let index = 0; index < submissionTestCases.length; index++) {
                                    const testCase = submissionTestCases[index];
                                    console.log("Processing Test Case: ", index);
                                    console.log(testCase);
                                    if (testCase.status.id === 3) {
                                        console.log("This Test Case Is Accepted Thus Incrementing: ", passedTestCases);
                                        passedTestCases++;
                                    }
                                    else {
                                        newSubmissionDetails.status = testCase.status.description;
                                        console.log("Breaking Here for Test Case: ", index);
                                        break;
                                    }
                                }

                                // Check If Passed All Test Cases
                                if (passedTestCases === submissionTestCases.length) {
                                    newSubmissionDetails.status = "Accepted";
                                }
                            }
                            else {
                                newSubmissionDetails.status = "Pending";
                            }

                        }

                        return newSubmissionDetails;
                    })

                    console.log("Final Processed Submission's Array: ");
                    console.log(newAllSubmissionsToThisProblem);

                    return newAllSubmissionsToThisProblem;
                });

                // Show Toast Notification that Successfully Got Submissions
                toast.success(metadata.message);

                // Sleep for 1s to show Toast Notification
                await sleep(1000);


            }
            // Else Request Processing is not done then Tell User What May Went Wrong
            else {
                console.log(data);
                console.log(metadata);

                toast.error(metadata.message);
                await sleep(1000);
                toast.error("Seems Like Something Wrong while Executing your Submission....");
                await sleep(1000);

            }
        }
    );

    // Websocket Event Listening Logic - Ends Here



    return <>
        {/* Navigation & Run and Submit Control Button Part - Starts Here */}
        <div className="px-8 py-2 border border-0 border-b-1 border-[#0a173266] flex flex-row items-center justify-between">
            {/* Logo - Starts Here */}
            <Link to={"/"} className="poppins-bold text-2xl primary-gradient-text">
                AllSpark
            </Link>
            {/* Logo - Ends Here */}

            <div className="lg:w-4/7 flex flex-row gap-4 items-center justify-between">

                {/* Run & Submit Button Controls - Starts Here */}
                <div className="flex flex-row text-sm lg:text-normal gap-2 lg:gap-4 poppins-semibold">
                    <button id="run-button" onClick={handleClickOnRunButton} className="transition-all duration-[0.4s] cursor-pointer px-4 py-1 border border-2 border-blue-400 rounded-full hover:border-[#0a1732cc] active:scale-[0.8] disabled:opacity-[0.2] disabled:animate-pulse">
                        Run
                    </button>
                    <button id="submit-button" onClick={handleClickOnSubmitButton} className="transition-all duration-[0.4s] cursor-pointer px-4 py-1 border border-2 border-green-400 rounded-full hover:border-[#0a1732cc] active:scale-[0.8] disabled:opacity-[0.2] disabled:animate-pulse">
                        Submit
                    </button>
                </div>
                {/* Run & Submit Button Controls - Ends Here */}





                {(isLoggedIn === true) ? <>
                    {/* User's Profile Icon - Starts Here */}
                    <div className="flex items-center justify-center">
                        <Link to={"/users/dashboard"} className="transition-all duration-[0.4s] ease-in-out hover:scale-[1.08] active:scale-[0.8] cursor-pointer w-12 h-12 flex items-center justify-center rounded-full text-xl text-white poppins-semibold custom-smooth-drop-shadow primary-gradient-bg">
                            {user && (user.name).substr(0, 1)}
                        </Link>
                    </div>
                    {/* User's Profile Icon - Ends Here */}
                </> : <>
                    {/* Sign Up & Login Buttons - Starts Here */}
                    <div className="flex flex-row gap-2">
                        <Link to={"/signup"} className="text-center px-4 py-1 bg-[#47FF4E] rounded-full text-xs lg:text-sm text-white text-nowrap poppins-medium custom-smooth-drop-shadow">
                            Sign Up
                        </Link>
                        <Link to={"/login"} className="text-center px-4 py-1 rounded-full text-xs lg:text-sm text-white poppins-medium custom-smooth-drop-shadow primary-gradient-bg">
                            Login
                        </Link>
                    </div>
                    {/* Sign Up & Login Buttons - Ends Here */}
                </>}
            </div>

        </div>
        {/* Navigation & Run and Submit Control Button Part - Ends Here */}
        <div className="w-full mt-8 px-8 lg:px-16 py-4 lg:py-2 grid grid-cols-1 lg:grid-cols-2 gap-8">



            {/* Problem Details Section - Starts Here  */}
            <div className="flex flex-col gap-4">

                {/* Problem and Submission Navigation Controls - Starts Here */}
                <div className="flex flex-row gap-4 pb-4 border border-0 border-b-2 border-[#0a173266]">
                    <button
                        onClick={() => {
                            handleClickOnVisiblePartControls("problemDescription");
                        }}
                        className={`transition-all duration-[0.4s] cursor-pointer px-4 py-2 border border-1 border-[#0a1732cc] rounded-lg hover:border-[#0a173299] active:scale-[0.8] hover:opacity-[0.8] ${visiblePart.problemDescription ? "scale-[1.08]" : "opacity-[0.4]"}`}>
                        Description
                    </button>
                    <button
                        onClick={() => {
                            handleClickOnVisiblePartControls("problemSubmissions");
                        }}
                        className={`transition-all duration-[0.4s] cursor-pointer px-4 py-2 border border-1 border-[#0a1732cc] rounded-lg hover:border-[#0a173299] active:scale-[0.8] hover:opacity-[0.8] ${visiblePart.problemSubmissions ? "scale-[1.08]" : "opacity-[0.4]"}`}>
                        Submissions
                    </button>
                </div>
                {/* Problem and Submission Navigation Controls - Ends Here */}


                {/* Problem's Dercription - Starts Here */}
                {(visiblePart.problemDescription && problemDetails) ? <>
                    <div className="pt-2 pe-2 h-[70vh] overflow-y-scroll">

                        <div className="flex flex-col gap-16">

                            {/* Problem Heading Section - Starts Here */}
                            <div className="flex flex-col gap-4">
                                {/* Problem Name - Starts Here */}
                                <h2 className="text-4xl poppins-semibold">
                                    {problemDetails.name}
                                </h2>
                                {/* Problem Name - Ends Here */}

                                {/* Problem Difficulty & Tags - Starts Here */}
                                <div className="flex flex-col gap-4 lg:flex-row justify-between lg:items-center">
                                    {/* <div>

                                        <span className={`px-4 py-1 border border-2 rounded-full ${problemDetails.difficulty === "easy" ? "text-green-400" : (problemDetails.difficulty === "medium" ? "text-yellow-400" : "text-red-400")} text-sm poppins-semibold`}>

                                            {(problemDetails.difficulty).toUpperCase()}
                                        </span>
                                    </div> */}


                                    {/* Problem Tags - Starts Here */}
                                    {/* <div className="w-full lg:w-1/2 flex flex-row flex-wrap gap-2">
                                        {(problemDetails.tags).map((tag, index) => {
                                            return <div
                                                key={`${problemDetails.slug}-tag-${index}`}
                                                className="px-4 py-1 border border-2 border-[#0a173266] text-[#0a1732] rounded-full text-xs poppins-regular">
                                                {tag}
                                            </div>
                                        })}
                                    </div> */}
                                    {/* Problem Tags - Ends Here */}
                                </div>
                                {/* Problem Difficulty & Tags - Ends Here */}
                            </div>
                            {/* Problem Heading Section - Ends Here */}



                            {/* Problem Description Section - Starts Here */}
                            <div className="flex flex-col gap-8">
                                <p className="poppins-regular black-100-text">
                                    {problemDetails.description}
                                </p>
                            </div>
                            {/* Problem Description Section - Ends Here */}
                        </div>


                    </div>

                </> : <></>}
                {/* Problem's Dercription - Ends Here */}



                {/* Problem's Submissions - Starts Here */}
                {(visiblePart.problemSubmissions && allSubmissionsToThisProblem) ? <>

                    {/* Submissions' Filters - Starts Here */}
                    <div className="flex flex-row gap-4">
                        <button id="all" onClick={handleClickOnSubmissionsFilterButton} className={`transition-all duration-[0.4s] cursor-pointer px-4 py-1 border border-2 rounded-full hover:border-[#0a1732cc] ${submissionFilter === "all" ? "scale-[1.2] border-[#0a1732]" : "border-[#0a173266]"}`}>
                            All
                        </button>
                        <button id="public" onClick={handleClickOnSubmissionsFilterButton} className={`transition-all duration-[0.4s] cursor-pointer px-4 py-1 border border-2 rounded-full hover:border-[#0a1732cc] ${submissionFilter === "public" ? "scale-[1.2] border-[#0a1732]" : "border-[#0a173266]"}`}>
                            Public
                        </button>
                        <button id="private" onClick={handleClickOnSubmissionsFilterButton} className={`transition-all duration-[0.4s] cursor-pointer px-4 py-1 border border-2 rounded-full hover:border-[#0a1732cc] ${submissionFilter === "private" ? "scale-[1.2] border-[#0a1732]" : "border-[#0a173266]"}`}>
                            Private
                        </button>
                    </div>
                    {/* Submissions' Filters - Ends Here */}


                    <div className="pt-2 pe-2 h-[70vh] overflow-y-scroll">

                        <div className="mt-8 flex flex-col gap-8">

                            {allSubmissionsToThisProblem.map((submission, index) => {
                                return <div
                                    key={`${problemDetails.slug}-submission-${index}`}
                                    className={`

                                        border border-2 border-[#0a173266] rounded-xl py-2 px-4 flex flex-col gap-1
                                        
                                        ${(
                                            (submissionFilter === "public" && submission.is_for_public_test_cases === false)
                                            ||
                                            (submissionFilter === "private" && submission.is_for_public_test_cases === true)
                                        ) ? "hidden" : ""} 

                                        ${submission.status === "Pending" ? "animate-pulse" : ""}

                                        `}>

                                    <div className="flex flex-col gap-4 lg:flex-row lg:justify-between">

                                        <h3 className={`text-xl ${submission.status === "Accepted" ? "text-green-400" : (submission.status === "Pending" ? "text-yellow-400" : "text-red-400")} poppins-medium`}>
                                            {submission.status}
                                        </h3>


                                        <div className="flex flex-col gap-1">
                                            <h3 className="text-sm black-100-text">
                                                Created At:
                                            </h3>
                                            <p className="text-sm black-80-text">
                                                {getLocalDateTimeStringFromISOString(submission.createdAt)}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-0">
                                        <p className={`text-sm ${(submission.is_for_public_test_cases) ? "secondary-color-text" : "primary-color-text"}`}>
                                            {(submission.is_for_public_test_cases) ? "Public" : "Private"}
                                        </p>
                                        <p className="text-xs black-40-text poppins-regular">
                                            {(submission._id).substr(0, 7)}
                                        </p>
                                    </div>
                                </div>
                            })}
                        </div>

                    </div>

                </> : <></>}
                {/* Problem's Submissions - Ends Here */}

            </div>
            {/* Problem Details Section - Ends Here  */}

            {/* Problem' Code Editor Section - Starts Here  */}
            <div className="w-full h-full flex flex-col">
                <CodeEditor
                    onCodeLanguageChange={handleCodeLanguageChange}
                    onCodeStringChange={handleCodeStringChange}
                />
            </div>
            {/* Problem' Code Editor Section - Ends Here  */}
        </div >
    </>;
};


export default ContestProblemEditor;