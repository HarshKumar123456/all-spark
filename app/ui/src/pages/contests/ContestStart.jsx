import React, { useEffect, useState } from "react";
import Layout from "../../components/layout/Layout";
import Heading from "../../components/heading/Heading";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { useAuthContext } from "../../contexts/AuthContext";
import { useWebSocketContext } from "../../contexts/WebSocketContext";
import { useSocketListener } from "../../hooks/useSocketListener";

const ContentStart = () => {

    const sleep = async (milliSeconds) => {
        return new Promise((resolve) => setTimeout(resolve, milliSeconds));
    };

    const { token, user, setUser } = useAuthContext();

    let navigate = useNavigate();

    const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000/api/v1";

    const { isConnected, clientId } = useWebSocketContext();

    const { slug } = useParams();

    const [contestDetails, setContestDetails] = useState({
        _id: "1",
        name: "Contest 1",
        slug: "contest-1",
        description: "This is Contest 1 Description transition-all duration-[0.4s] ease-in-out hover:scale-[1.02] border border-2 border-[#0a173233] hover:border-[#0a1732cc] px-4 lg:px-8 py-8 lg:pt-8 lg:pb-16 rounded-xl flex flex-col w-100 transition-all duration-[0.4s] ease-in-out hover:scale-[1.02] border border-2 border-[#0a173233] hover:border-[#0a1732cc] px-4 lg:px-8 py-8 lg:pt-8 lg:pb-16 rounded-xl flex flex-col w-100",
        created_by: "idOfCreatorLike71nv923hb32v2b",
        start_time: "2026-02-25T20:37:18.917Z",
        end_time: "2026-02-25T20:47:18.917Z",
        duration: 600000, // Milliseconds
        support_end_time: "2026-02-26T11:37:18.917Z",
    });

    const [timeToEndContest, setTimeToEndContest] = useState("1d 18h 46m 10s");


    const [contestProblems, setContestProblems] = useState([
        // {
        //     _id: "1",
        //     name: "Problem 1",
        //     slug: "problem-1",
        //     description: "This is Problem 1 Description transition-all duration-[0.4s] ease-in-out hover:scale-[1.02] border border-2 border-[#0a173233] hover:border-[#0a1732cc] px-4 lg:px-8 py-8 lg:pt-8 lg:pb-16 rounded-xl flex flex-col w-100 transition-all duration-[0.4s] ease-in-out hover:scale-[1.02] border border-2 border-[#0a173233] hover:border-[#0a1732cc] px-4 lg:px-8 py-8 lg:pt-8 lg:pb-16 rounded-xl flex flex-col w-100",
        // },
        // {
        //     _id: "2",
        //     name: "Problem 2",
        //     slug: "problem-2",
        //     description: "This is Problem 2 Description transition-all duration-[0.4s] ease-in-out hover:scale-[1.02] border border-2 border-[#0a173233] hover:border-[#0a1732cc] px-4 lg:px-8 py-8 lg:pt-8 lg:pb-16 rounded-xl flex flex-col w-100 transition-all duration-[0.4s] ease-in-out hover:scale-[1.02] border border-2 border-[#0a173233] hover:border-[#0a1732cc] px-4 lg:px-8 py-8 lg:pt-8 lg:pb-16 rounded-xl flex flex-col w-100",
        // },
    ]);

    const [currProblemDetails, setCurrProblemDetails] = useState(
        {
            _id: "1",
            name: "Problem 1",
            slug: "problem-1",
            description: "This is Problem 1 Description transition-all duration-[0.4s] ease-in-out hover:scale-[1.02] border border-2 border-[#0a173233] hover:border-[#0a1732cc] px-4 lg:px-8 py-8 lg:pt-8 lg:pb-16 rounded-xl flex flex-col w-100 transition-all duration-[0.4s] ease-in-out hover:scale-[1.02] border border-2 border-[#0a173233] hover:border-[#0a1732cc] px-4 lg:px-8 py-8 lg:pt-8 lg:pb-16 rounded-xl flex flex-col w-100",
            created_by: "idOfCreatorLike71nv923hb32v2b",
        }
    );

    const [participantDetails, setParticipantDetails] = useState(null); // null or Object

    const [visiblePart, setVisiblePart] = useState({
        generalInstructions: true,
        help: false,
        problems: false,
    });

    const hideAllContent = () => {
        setVisiblePart((prev) => {
            const newVisiblePart = {};
            for (let part in prev) {
                newVisiblePart[part] = false;
            }
            return newVisiblePart;
        });
    };

    const handleClickOnContestMenuControls = async (e) => {
        const idOfContestMenuControlsElement = e.target.id;


        // First of all Hide All Visible Part and then decide which part to show
        hideAllContent();

        switch (idOfContestMenuControlsElement) {
            case "generalInstructions":
                {
                    // Show General Instructions
                    setVisiblePart((prev) => {
                        return {
                            ...prev,
                            ["generalInstructions"]: true,
                        };
                    });

                }

                break;

            case "help":
                {
                    // Show Help
                    setVisiblePart((prev) => {
                        return {
                            ...prev,
                            ["help"]: true,
                        };
                    });

                }

                break;

            case "problems":
                {
                    // Show First Problem
                    setVisiblePart((prev) => {
                        return {
                            ...prev,
                            ["problems"]: true,
                        };
                    });

                    setCurrProblemDetails((prev) => {
                        return contestProblems[0];
                    })
                }

                break;

            default:
                {
                    // If Any Specific problem is Clicked that means the user want to see that problem's details thus show that problem 
                    if (idOfContestMenuControlsElement.includes("problem")) {

                        setVisiblePart((prev) => {
                            return {
                                ...prev,
                                ["problems"]: true,
                            };
                        });

                        // Find id of the Contest Problem which is Clicked to be Viewed by user 
                        const idOfClickedContestProblem = (idOfContestMenuControlsElement.split("-"))[1];

                        // Set Current Problem to View by that id of the Contest Problem which is Clicked to be Viewed by user 
                        setCurrProblemDetails((prev) => {
                            const newCurrProblemDetails = contestProblems.find((problem) => problem._id === idOfClickedContestProblem);

                            return newCurrProblemDetails;
                        })

                    }
                    else {
                        console.log("Something unexpected option clicked in contest controls menu: ", e);
                    }
                }


                break;
        }

        // console.log("Bhai ", idOfContestMenuControlsElement , " is clicked and now....");
        // console.log(visiblePart);

    };

    const handleClickOnEndContestButton = async () => {
        console.log("End Contest Button is Clicked....");


        try {
            navigate("/contests");
        } catch (error) {

        }

    };

    const handleClickOnStartContestButton = async () => {
        console.log("End Contest Button is Clicked....");


        try {
            const payload = {
                _id: contestDetails._id,
            };

            console.log("Payload For the API Call: ");
            console.log(payload);

            const response = await axios.post(`${API_BASE}/contests/start`, payload, {
                headers: {
                    "Content-Type": "application/json",
                    "client-id": clientId,
                    "authorization": token,
                }
            })

            // console.log("Response From the CONTESTS' API Call: ");
            // console.log(response);
            toast.success(response.data.message);


        } catch (error) {
            console.log(error);
            console.log("Something Went Wrong While Making the CONTESTS' API Call....", error);
            toast.error("Something went Wrong....");
        }
    };


    const handleClickOnPrevProblemButton = async () => {
        console.log("Inside handleClickOnPrevProblemButton()....");

        setCurrProblemDetails((prev) => {
            const indexOfCurrProblem = contestProblems.findIndex((problem) => problem._id === prev._id);
            const indexOfPrevProblem = indexOfCurrProblem === 0 ? contestProblems.length - 1 : indexOfCurrProblem - 1;
            const newCurrProblemDetails = contestProblems[indexOfPrevProblem];
            return newCurrProblemDetails;
        });

    };


    const handleClickOnOpenEditorButton = async () => {

        // Navigate to the Contest's Problem Editor Page 
        navigate(`/contests/${contestDetails.slug}/editor/${contestProblems.findIndex((problem) => problem._id === currProblemDetails._id)}`);

    };


    const handleClickOnNextProblemButton = async () => {
        console.log("Inside handleClickOnNextProblemButton()....");

        setCurrProblemDetails((prev) => {
            const indexOfCurrProblem = contestProblems.findIndex((problem) => problem._id === prev._id);
            const indexOfNextProblem = indexOfCurrProblem === contestProblems.length - 1 ? 0 : indexOfCurrProblem + 1;
            const newCurrProblemDetails = contestProblems[indexOfNextProblem];
            return newCurrProblemDetails;
        });


    };




    // Update Time to Start Contest
    const x = setInterval(() => {
        setTimeToEndContest((prev) => {
            var currDateISOString = new Date().toISOString();


            var countDownDate = new Date(participantDetails?.end_time || currDateISOString).getTime();

            // Get today's date and time
            var now = new Date().getTime();

            // Find the distance between now and the count down date
            var distance = countDownDate - now;

            // Time calculations for days, hours, minutes and seconds
            var days = Math.floor(distance / (1000 * 60 * 60 * 24));
            var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            var seconds = Math.floor((distance % (1000 * 60)) / 1000);

            // Display the result in the element with id="demo"
            let newTimeToEndContest = (days < 10 ? "0" + days.toString() : days.toString()) + "D : " + (hours < 10 ? "0" + hours.toString() : hours.toString()) + "H : " + (minutes < 10 ? "0" + minutes.toString() : minutes.toString()) + "M : " + (seconds < 10 ? "0" + seconds.toString() : seconds.toString()) + "S ";

            // If the count down is finished, write some text
            if (distance < 0) {
                clearInterval(x);
                newTimeToEndContest = "ENDED";
            }

            return newTimeToEndContest;
        });

        clearInterval(x);
    }, 1000);


    // If the Contest Slug or WebSocket Connection Changes then Please Fetch the Contest Details Again
    useEffect(() => {
        const fetchContestDetails = async () => {
            try {
                const response = await axios.get(`${API_BASE}/contests/${slug}`, {
                    headers: {
                        "client-id": clientId
                    }
                })

                // console.log("Response From the CONTESTS' API Call: ");
                // console.log(response);
                toast.success(response.data.message);


            } catch (error) {
                console.log(error);
                console.log("Something Went Wrong While Making the CONTESTS' API Call....", error);
                toast.error("Something went Wrong....");
            }
        };

        if (clientId) {
            fetchContestDetails();
        }

    }, [token, user, isConnected, clientId]);



    // Do not Change as the Contest's Problem Editor functionality is dependent on this part
    // Whenever "contestProblems", "contestDetails" changes First of All Save the Contests Problems onto the localStorage variable "contestProblems" and also save the Contest's Details in variable "contestDetails"
    useEffect(() => {

        localStorage.setItem("contestProblems", JSON.stringify(contestProblems));
        localStorage.setItem("contestDetails", JSON.stringify(contestDetails));


    }, [contestDetails, contestProblems]);


    // Websocket Event Listening Logic - Starts Here

    // Listener 1: Handle Valid Get Contest's Details Response
    useSocketListener(
        // Selector: "Is this message for me?"
        (msg) => msg.type?.includes('response') && msg.metadata.operation?.includes("contests.getContest"),

        // Handler: "What do I do with it?"
        async (msg) => {
            const { data, metadata } = msg;

            // If Get All Contests is Success then Save The Contests For further Accesses 
            if (metadata?.success === true) {
                console.log(data);
                console.log(metadata);

                // Setting Contest's Details from Event Data
                const contestDetailsFromEventData = data.result;

                console.log("Got Contest's Details from the Event....");
                console.log(contestDetailsFromEventData);

                setContestDetails(contestDetailsFromEventData);

                // Show Toast Notification that Successfully Completed Request 
                toast.success(metadata.message);

                // Sleep for 1s to show Toast Notification
                await sleep(1000);


            }
            // Else Request is not done then Tell User What May Went Wrong
            else {
                console.log(data);
                console.log(metadata);

                toast.error(metadata.message);
                await sleep(1000);


            }
        }
    );


    // Listener 2: Handle Valid Start Contest Response
    useSocketListener(
        // Selector: "Is this message for me?"
        (msg) => msg.type?.includes('response') && msg.metadata.operation?.includes("contests.startContest"),

        // Handler: "What do I do with it?"
        async (msg) => {
            const { data, metadata } = msg;


            // If Start Contest is Success then Save The Contests For further Accesses 
            if (metadata?.success === true) {
                console.log(data);
                console.log(metadata);



                // Setting Participant's Details from Event Data
                const participantDetailsFromEventData = data.result;

                console.log("Got Participant's Details from the Event....");
                console.log(participantDetailsFromEventData);

                setParticipantDetails(participantDetailsFromEventData);

                const contestProblemsDetailsFromEventData = data.result.problems;

                console.log("Got Contest's Problems' Details from the Event....");
                console.log(contestProblemsDetailsFromEventData);

                setContestProblems(contestProblemsDetailsFromEventData);


                // Show Toast Notification that Successfully Completed Request 
                toast.success(metadata.message);

                // Sleep for 1s to show Toast Notification
                await sleep(1000);




            }
            // Else Request is not done then Tell User What May Went Wrong
            else {
                console.log(data);
                console.log(metadata);

                toast.error(metadata.message);
                await sleep(1000);


            }
        }
    );
    // Websocket Event Listening Logic - Ends Here



    return <>
        <div className="w-full text-center">
            {/* Brand Logo Section - Starts Here */}
            <h1 className="text-xl">
                <Link to={"/"} className="poppins-bold primary-gradient-text">
                    AllSpark
                </Link>
            </h1>
            {/* Brand Logo Section - Ends Here */}
        </div>


        {/* Contest's Details Section - Starts Here */}

        <div className="flex flex-col items-center px-8 lg:px-16 py-16 lg:py-8">


            {/* Contest's Name, Username, Timer Section - Starts Here  */}
            <div className="border border-0 border-b-1 border-[#0a173233] pb-2 w-full flex flex-row justify-between">



                <div className="">
                    {/* Contest's Name Section - Starts Here */}
                    <h2 className="text-xl lg:text-2xl poppins-medium">
                        {contestDetails.name}
                    </h2>
                    {/* Contest's Name Section - Ends Here */}

                    {/* Username Section - Starts Here */}
                    <h2 className="text-xs lg:text-sm poppins-regular">
                        {user?.user_name}
                    </h2>
                    {/* Username Section - Ends Here */}

                </div>


                {/* Timer Section - Starts Here */}
                <h2 className="text-lg lg:text-xl poppins-semibold">
                    {timeToEndContest}
                </h2>
                {/* Timer Section - Ends Here */}

            </div>
            {/* Contest's Name, Username, Timer Section - Ends Here  */}


            {/* Contest's Problems' Description and Menu Section - Starts Here  */}
            <div className="w-full my-8 flex flex-row gap-4">

                {/* Contest's Menu Controls - Starts Here */}
                <div className="w-70 flex flex-col gap-8">

                    <ul className="flex flex-col gap-4 poppins-medium">
                        <li
                            id="generalInstructions"
                            className={`transition-all duration-[0.4s] ease-in-out hover:scale-[1.02] active:scale-[0.8] cursor-pointer border border-1 border-[#0a173233] hover:border-[#0a1732cc] rounded-xl px-2 lg:px-4 py-1 lg:py-2 ${visiblePart["generalInstructions"] === false ? "opacity-[0.8]" : "scale-[1.08] border-[#0a1732]"}`}
                            onClick={handleClickOnContestMenuControls}
                        >
                            General Instructions
                        </li>

                        <li
                            id="help"
                            className={`transition-all duration-[0.4s] ease-in-out hover:scale-[1.02] active:scale-[0.8] cursor-pointer border border-1 border-[#0a173233] hover:border-[#0a1732cc] rounded-xl px-2 lg:px-4 py-1 lg:py-2 ${visiblePart["help"] === false ? "opacity-[0.8]" : "scale-[1.08] border-[#0a1732]"}`}
                            onClick={handleClickOnContestMenuControls}
                        >
                            Help
                        </li>

                        <li
                            id="problems"
                            className={`transition-all duration-[0.4s] ease-in-out hover:scale-[1.02] active:scale-[0.8] cursor-pointer border border-1 border-[#0a173233] hover:border-[#0a1732cc] rounded-xl px-2 lg:px-4 py-1 lg:py-2 ${visiblePart["problems"] === false ? "opacity-[0.8]" : "scale-[1.08] border-[#0a1732]"}`}
                            onClick={handleClickOnContestMenuControls}
                        >
                            Problems
                        </li>


                        {/* Select Problem by Name Controls - Starts Here */}
                        <div className="h-[30vh] overflow-y-auto flex flex-col gap-4">


                            {contestProblems?.map((problem) => {
                                return <li
                                    key={`problem-${problem._id}`}
                                    id={`problem-${problem._id}`}
                                    className="transition-all duration-[0.4s] ease-in-out hover:scale-[1.02] active:scale-[0.8] cursor-pointer border border-0 border-b-1 border-[#0a173233] hover:border-[#0a1732cc] mx-4 text-xs lg:text-sm poppins-regular"
                                    onClick={handleClickOnContestMenuControls}
                                >
                                    {problem.name}
                                </li>
                            })}


                        </div>

                        {/* Select Problem by Name Controls - Ends Here */}


                    </ul>

                    {participantDetails ? <>
                        {/* End Contest Button - Starts Here */}
                        <button
                            onClick={handleClickOnEndContestButton}
                            className="transition-all duration-[0.4s] ease-in-out hover:scale-[1.02] active:scale-[0.8] bg-[#ff2929] cursor-pointer py-3 lg:py-4 px-2 lg:px-4 text-xl lg:text-2xl text-white rounded-full disabled:opacity-[0.2] text-center poppins-semibold custom-smooth-drop-shadow">
                            End
                        </button>
                        {/* End Contest Button - Ends Here */}
                    </> : <>

                        {/* Start Contest Button - Starts Here */}
                        <button
                            onClick={handleClickOnStartContestButton}
                            className="transition-all duration-[0.4s] ease-in-out hover:scale-[1.02] active:scale-[0.8] bg-[#47FF4E] cursor-pointer py-3 lg:py-4 px-2 lg:px-4 text-xl lg:text-2xl text-white rounded-full disabled:opacity-[0.2] text-center poppins-semibold custom-smooth-drop-shadow">
                            Start
                        </button>
                        {/* Start Contest Button - Ends Here */}

                    </>}

                </div>
                {/* Contest's Menu Controls - Ends Here */}


                {/* Contest's Problems Description and General Instructions, Help - Starts Here */}
                <div className="ms-2 border border-0 border-s-2 border-[#0a173233] px-8 w-full">

                    {/* General Instructions Section - Starts Here */}
                    {visiblePart.generalInstructions ? <>
                        <div className="text-base poppins-regular">

                            <h2 className="text-4xl poppins-semibold">
                                General Instructions
                            </h2>

                            <p className="py-4 mb-16 text-xl black-80-text">
                                 
                                Here are some General Instructions to help you understand the Platform Use and General Practices to Give the Contest.
                            </p>



                            {/* Instructions - Starts Here */}

                            <div className="flex flex-col gap-8">


                                {/* Programming Language Change - Starts Here */}
                                <div className="flex flex-col gap-1">

                                    <h3 className="text-xl poppins-semibold">
                                        Programming Language Change
                                    </h3>

                                    <p className="black-80-text">
                                        We supports widely used languages and to give the Contest in your Preferred Programming Language Please Change the Language from the Dropdown Selection Option given on the top of the Problem Editor.
                                    </p>


                                </div>
                                {/* Programming Language Change - Ends Here */}


                                {/* Submissions - Starts Here */}
                                <div className="flex flex-col gap-1">

                                    <h3 className="text-xl poppins-semibold">
                                        Submissions
                                    </h3>

                                    <p className="black-80-text">
                                        Only the Private Test Case Submissions are Considered for the Evaluation.
                                        You can submit solutions as many times as you'd like, there are no penalties for incorrect submissions. Only your best correct submission will be considered. But please note that if your submissions passes the same test cases as the other participant then the one who has less number of submissions will be awarded higher score thus please run your submissions first locally and then submit them.
                                    </p>


                                </div>
                                {/* Submissions - Ends Here */}



                                {/* Correct Contest and Username - Starts Here */}
                                <div className="flex flex-col gap-1">

                                    <h3 className="text-xl poppins-semibold">
                                        Correct Contest and Username
                                    </h3>

                                    <p className="black-80-text">
                                        Please ensure that you see your username and the Contest's Name Correctly at the Top left corner of the Contest page and if you found something else then please seek help at the contest support via Help option on sidebar.
                                    </p>


                                </div>
                                {/* Correct Contest and Username - Ends Here */}




                                {/* Navigate the Problems - Starts Here */}
                                <div className="flex flex-col gap-1">

                                    <h3 className="text-xl poppins-semibold">
                                        Navigate the Problems
                                    </h3>

                                    <p className="black-80-text">
                                        As soon as contest starts you will see the Problems' List below the Problems Option on the Sidebar and To Navigate the Problems you can click the Problems' name or can click the Prev or Next Button on the Problem's Details Page.
                                    </p>


                                </div>
                                {/* Navigate the Problems - Ends Here */}



                                {/* Solving the Problems - Starts Here */}
                                <div className="flex flex-col gap-1">

                                    <h3 className="text-xl poppins-semibold">
                                        Solving the Problems
                                    </h3>

                                    <p className="black-80-text">
                                        You can write the Code on the Editor given By Us By Clicking the Open Editor Button on the Problem's Details Page for the Specific Problem of the Contest.
                                    </p>


                                </div>
                                {/* Solving the Problems - Ends Here */}







                                {/* How to Seek Help - Starts Here */}
                                <div className="flex flex-col gap-1">

                                    <h3 className="text-xl poppins-semibold">
                                        How to Seek Help
                                    </h3>

                                    <p className="black-80-text">
                                        To Seek Help Related to this Contest Please Click on the Help Option on Sidebar and See if your Concern is Listed There or Not and if Not then Please Try Mailing the support contact there or Email us from our Contact Page and Please mention the Issue along with Screenshots if possible and Please mention the Contest Name and Your Username and these are mandatory to mention.
                                    </p>


                                </div>
                                {/* How to Seek Help - Ends Here */}




                                {/* Time to Complete - Starts Here */}
                                <div className="flex flex-col gap-1">

                                    <h3 className="text-xl poppins-semibold">
                                        Time to Complete
                                    </h3>

                                    <p className="black-80-text">
                                        You can see the Contest's Timer Running at the Top right Corner of your Contest Page and this depicts the Time You have Left to Complete the Contest and all the submissions whithin this time frame are considered and once this timer ends the submissions are not considered for your evaluation.
                                    </p>


                                </div>
                                {/* Time to Complete - Ends Here */}






                            </div>


                            {/* Instructions - Ends Here */}


                        </div>
                    </> : <></>}
                    {/* General Instructions Section - Ends Here */}


                    {/* Help Section - Starts Here */}
                    {visiblePart.help ? <>
                        <div className="text-base poppins-regular">

                            <h2 className="text-4xl poppins-semibold">
                                Help
                            </h2>

                            <p className="py-4 mb-16 text-xl black-80-text">
                                Before seeking help from the Support Please Read the Below FAQs and if you have something other issue than these then please Contact Us via our Official E-mail Given on the Contact us Page by Writing Subject name "Contest Help - &lt;Contest Name&gt; | &lt;Issue Name&gt;". 
                            </p>




                            {/* FAQs - Starts Here */}
                            <div className="flex flex-col gap-8">


                                {/* Submissions Pending Status Doesn't resolve ? - Starts Here */}
                                <div className="flex flex-col gap-1">

                                    <h3 className="text-xl poppins-semibold">
                                        Submissions Pending Status Doesn't resolve ?
                                    </h3>

                                    <p className="black-80-text">
                                        If your'e seeing Submissions Status Pending for a long time then Please Refresh the Page, logout and login again and then Please make another Submission and if the Issue persists then Please Contact us and mention the Name of the contest along with your username in the Body of the Mail and Please Attach Screenshots if possible and the Issue name in the Subject will be "Submissions Pending Doesn't Resolve".
                                    </p>


                                </div>
                                {/* Submissions Pending Status Doesn't resolve ? - Ends Here */}



                                {/* Submissions Cannot be Made ? - Starts Here */}
                                <div className="flex flex-col gap-1">

                                    <h3 className="text-xl poppins-semibold">
                                        Submissions Cannot be Made ?
                                    </h3>

                                    <p className="black-80-text">
                                        If your'e seeing Submissions Cannot be Made Status at the Bottom Notifications then Please try Logout and Login Again and then Make the Submissions Again and if This doesn't work then Please Contact us and mention the Name of the contest along with your username in the Body of the Mail and Please Attach Screenshots if possible and the Issue name in the Subject will be "Submissions not Made".
                                    </p>


                                </div>
                                {/* Submissions Cannot be Made ? - Ends Here */}


                                {/* Unable to Start the Contest ? - Starts Here */}
                                <div className="flex flex-col gap-1">

                                    <h3 className="text-xl poppins-semibold">
                                        Unable to Start the Contest ?
                                    </h3>

                                    <p className="black-80-text">
                                        If your'e Not able to start the Contest Please make sure you are attempting the right contest for which you have registered and if you are not able to start the Contest after registering then Please Try Logout and Login again and if this doesn't works then Please contact Us and mention the Name of the contest along with your username in the Body of the Mail and Please Attach Screenshots if possible and the Issue name in the Subject will be "Unable to Start".
                                    </p>


                                </div>
                                {/* Unable to Start the Contest ? - Ends Here */}




                                {/* Unable to see the Contest Problems ? - Starts Here */}
                                <div className="flex flex-col gap-1">

                                    <h3 className="text-xl poppins-semibold">
                                        Unable to see the Contest Problems ?
                                    </h3>

                                    <p className="black-80-text">
                                        If your'e Not able to see the Contest's Problems Please Refresh the Page, Try Clearing the Cache and Logout and login again and also close the Browser and then Start Again and if any of the solutions prescribed doesn't works then please Contact Us and mention the Name of the contest along with your username in the Body of the Mail and Please Attach Screenshots if possible and the Issue name in the Subject will be "Problems Not Visible".
                                    </p>


                                </div>
                                {/* Unable to see the Contest Problems ? - Ends Here */}

                            </div>
                            {/* FAQs - Starts Here */}


                        </div>
                    </> : <></>}
                    {/* Help Section - Ends Here */}


                    {/* Problem's Description Section  - Starts Here */}
                    {visiblePart.problems ? <>
                        <div className="text-xl h-full flex flex-col gap-16 poppins-regular">
                            {/* Contests' Problem's Navigation Controls - Starts Here */}
                            <div className="w-full flex flex-row justify-between">

                                <button
                                    onClick={handleClickOnPrevProblemButton}
                                    className="transition-all duration-[0.4s] ease-in-out hover:scale-[1.02] active:scale-[0.8] border border-2 border-[#135BEB] cursor-pointer py-3 lg:py-4 px-4 lg:px-8 text-sm lg:text-xl rounded-full disabled:opacity-[0.2] poppins-semibold">
                                    Prev
                                </button>

                                {/* Update the Open Editor to Open Contest's Problem Editor in New Tab Using the default anchor tag of HTML */}
                                <a href={`/contests/${contestDetails.slug}/editor/${contestProblems.findIndex((problem) => problem._id === currProblemDetails._id)}`} target="blank">
                                    <button
                                        className="transition-all duration-[0.4s] ease-in-out hover:scale-[1.02] active:scale-[0.8] bg-[#135BEB] cursor-pointer py-3 lg:py-4 px-4 lg:px-8 text-lg lg:text-xl rounded-full disabled:opacity-[0.2] text-white poppins-semibold custom-smooth-drop-shadow">
                                        Open Editor
                                    </button>
                                </a>

                                <button
                                    onClick={handleClickOnNextProblemButton}
                                    className="transition-all duration-[0.4s] ease-in-out hover:scale-[1.02] active:scale-[0.8] border border-2 border-[#135BEB] cursor-pointer py-3 lg:py-4 px-4 lg:px-8 text-sm lg:text-xl rounded-full disabled:opacity-[0.2] poppins-semibold">
                                    Next
                                </button>

                            </div>
                            {/* Contests' Problem's Navigation Controls - Ends Here */}



                            {/* Contests' Problem's Details - Starts Here */}
                            <div className="flex flex-col gap-4">
                                <h2 className="text-xl lg:text-2xl poppins-semibold">
                                    {currProblemDetails.name}
                                </h2>

                                <p className="whitespace-pre-line text-lg lg:text-xl text-[#0a1732cc]">
                                    {currProblemDetails.description}
                                </p>
                            </div>
                            {/* Contests' Problem's Details - Ends Here */}



                        </div>
                    </> : <></>}
                    {/* Problem's Description Section  - Ends Here */}


                </div>
                {/* Contest's Problems Description and General Instructions, Help - Ends Here */}

            </div>
            {/* Contest's Problems' Description and Menu Section - Ends Here  */}


        </div>

        {/* Contest's Details Section - Ends Here */}

    </>;
};

export default ContentStart;