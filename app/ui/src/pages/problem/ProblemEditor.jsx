import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import CodeEditor from "../../components/editor/CodeEditor";
import { useAuthContext } from "../../contexts/AuthContext";
import { toast } from "sonner";
import { useWebSocketContext } from "../../contexts/WebSocketContext";
import axios from "axios";
import { useSocketListener } from "../../hooks/useSocketListener";

const ProblemEditor = () => {

    const sleep = async (milliSeconds) => {
        return new Promise((resolve) => setTimeout(resolve, milliSeconds));
    };


    const navigate = useNavigate();

    const { token, user } = useAuthContext();

    const [isLoggedIn, setIsLoggedIn] = useState(false); // boolean

    const { slug } = useParams();


    const [visiblePart, setVisiblePart] = useState({
        // Only Field's Value is To be Changed in this Object and Adding or Removing Should be Done With Caution As That May Break the Other UI Components
        problemDescription: true,
        problemSubmissions: false,
    });

    const [problemDetails, setProblemDetails] = useState(null); // null or Object

    const [showSubmissionsToThisProblem, setShowSubmissionsToThisProblem] = useState(false); // boolean

    const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000/api/v1";

    const { isConnected, clientId } = useWebSocketContext();




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

    const handleClickOnRunButton = async () => {
        console.log("Run Button Is Clicked....");

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
        } catch (error) {

        }
    };


    const handleClickOnSubmitButton = async () => {
        console.log("Submit Button Is Clicked....");

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
        } catch (error) {

        }
    };



    // If token or User is Changed then Update the Info Who is Logged in User's Information onto the Header
    useEffect(() => {
        setIsLoggedIn((token && user) ? true : false);
        console.log("Yo Bro We Got User: ");
        console.log(user);
    }, [token, user]);


    // If the Problem Slug or WebSocket Connection Changes then Please Fetch the Problem Details Again
    useEffect(() => {
        const fetchProblemDetails = async () => {
            try {
                const response = await axios.get(`${API_BASE}/problems/${slug}`, {
                    headers: {
                        "client-id": clientId
                    }
                })

                // console.log("Response From the AUTH API Call: ");
                // console.log(response);
                toast.success(response.data.message);


            } catch (error) {
                console.log(error);
                console.log("Something Went Wrong While Making the PROBLEMS' API Call....", error);
                toast.error("Something went Wrong....");
            }
        };

        if (clientId) {
            fetchProblemDetails();
        }

    }, [slug, isConnected, clientId]);



    // Websocket Event Listening Logic - Starts Here
    // Listener 1: Handle Valid Signup Response
    useSocketListener(
        // Selector: "Is this message for me?"
        (msg) => msg.type?.includes('response') && msg.metadata.operation?.includes("problems.getProblem"),

        // Handler: "What do I do with it?"
        async (msg) => {
            const { data, metadata } = msg;

            // If Signup is Success then Save The Token For further Accesses 
            if (metadata?.success === true) {
                // alert("Signed up Successfully....");
                console.log(data);
                console.log(metadata);

                // Setting Problem's Details From Event Data
                const problemDetailsFromEventData = data.result;

                setProblemDetails(problemDetailsFromEventData);

                // Show Toast Notification that Successfully Signed Up
                toast.success(metadata.message);

                // Sleep for 1s to show Toast Notification
                await sleep(1000);


            }
            // Else Signup is not done then Tell User What May Went Wrong
            else {
                console.log(data);
                console.log(metadata);

                toast.error(metadata.message);
                await sleep(1000);
                toast.error("Seems Like Problem Doesn't Exists Now....");
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
                    <button onClick={handleClickOnRunButton} className="transition-all duration-[0.4s] cursor-pointer px-4 py-1 border border-2 border-blue-400 rounded-full hover:border-[#0a1732cc] active:scale-[0.8]">
                        Run
                    </button>
                    <button onClick={handleClickOnSubmitButton} className="transition-all duration-[0.4s] cursor-pointer px-4 py-1 border border-2 border-green-400 rounded-full hover:border-[#0a1732cc] active:scale-[0.8]">
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
                                    <div>

                                        <span className={`px-4 py-1 border border-2 rounded-full ${problemDetails.difficulty == "easy" ? "text-green-400" : (problemDetails.difficulty === "medium" ? "text-yellow-400" : "text-red-400")} text-sm poppins-semibold`}>

                                            {(problemDetails.difficulty).toUpperCase()}
                                        </span>
                                    </div>


                                    {/* Problem Tags - Starts Here */}
                                    <div className="w-full lg:w-1/2 flex flex-row flex-wrap gap-2">
                                        {(problemDetails.tags).map((tag, index) => {
                                            return <div
                                                key={`${slug}-tag-${index}`}
                                                className="px-4 py-1 border border-2 border-[#0a173266] text-[#0a1732] rounded-full text-xs poppins-regular">
                                                {tag}
                                            </div>
                                        })}
                                    </div>
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
                {visiblePart.problemSubmissions ? <>
                    <div className="pt-2 pe-2 h-[70vh] overflow-y-scroll">

                        Hi i am Submission Details Part for problem Slug: {slug}
                        <div className="p-4"></div>
                        <div>Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem dolorem, soluta repellendus pariatur, ut quidem minima dicta beatae, voluptates esse ipsam hic! Obcaecati quaerat nihil excepturi aut facere illo, inventore iure ullam dicta placeat odio asperiores cumque necessitatibus debitis in?</div>
                        <div>Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem dolorem, soluta repellendus pariatur, ut quidem minima dicta beatae, voluptates esse ipsam hic! Obcaecati quaerat nihil excepturi aut facere illo, inventore iure ullam dicta placeat odio asperiores cumque necessitatibus debitis in?</div>
                        <div>Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem dolorem, soluta repellendus pariatur, ut quidem minima dicta beatae, voluptates esse ipsam hic! Obcaecati quaerat nihil excepturi aut facere illo, inventore iure ullam dicta placeat odio asperiores cumque necessitatibus debitis in?</div>
                        <div>Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem dolorem, soluta repellendus pariatur, ut quidem minima dicta beatae, voluptates esse ipsam hic! Obcaecati quaerat nihil excepturi aut facere illo, inventore iure ullam dicta placeat odio asperiores cumque necessitatibus debitis in?</div>
                        <div>Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem dolorem, soluta repellendus pariatur, ut quidem minima dicta beatae, voluptates esse ipsam hic! Obcaecati quaerat nihil excepturi aut facere illo, inventore iure ullam dicta placeat odio asperiores cumque necessitatibus debitis in?</div>
                        <div>Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem dolorem, soluta repellendus pariatur, ut quidem minima dicta beatae, voluptates esse ipsam hic! Obcaecati quaerat nihil excepturi aut facere illo, inventore iure ullam dicta placeat odio asperiores cumque necessitatibus debitis in?</div>
                        <div>Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem dolorem, soluta repellendus pariatur, ut quidem minima dicta beatae, voluptates esse ipsam hic! Obcaecati quaerat nihil excepturi aut facere illo, inventore iure ullam dicta placeat odio asperiores cumque necessitatibus debitis in?</div>
                        <div>Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem dolorem, soluta repellendus pariatur, ut quidem minima dicta beatae, voluptates esse ipsam hic! Obcaecati quaerat nihil excepturi aut facere illo, inventore iure ullam dicta placeat odio asperiores cumque necessitatibus debitis in?</div>
                        <div>Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem dolorem, soluta repellendus pariatur, ut quidem minima dicta beatae, voluptates esse ipsam hic! Obcaecati quaerat nihil excepturi aut facere illo, inventore iure ullam dicta placeat odio asperiores cumque necessitatibus debitis in?</div>
                        <div>Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem dolorem, soluta repellendus pariatur, ut quidem minima dicta beatae, voluptates esse ipsam hic! Obcaecati quaerat nihil excepturi aut facere illo, inventore iure ullam dicta placeat odio asperiores cumque necessitatibus debitis in?</div>
                    </div>

                </> : <></>}
                {/* Problem's Submissions - Ends Here */}

            </div>
            {/* Problem Details Section - Ends Here  */}

            {/* Problem' Code Editor Section - Starts Here  */}
            <div className="w-full h-full flex flex-col">
                <CodeEditor />
            </div>
            {/* Problem' Code Editor Section - Ends Here  */}
        </div>
    </>;
};


export default ProblemEditor;