import React, { useEffect, useState } from "react";
import Layout from "../../components/layout/Layout";
import Heading from "../../components/heading/Heading";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { useAuthContext } from "../../contexts/AuthContext";
import { useWebSocketContext } from "../../contexts/WebSocketContext";
import { useSocketListener } from "../../hooks/useSocketListener";

const ContestDetails = () => {

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

    const [userJourneyInContest, setUserJourneyInContest] = useState("unregistered");

    const [timeToStartContest, setTimeToStartContest] = useState("1d 18h 46m 10s");


    const handleClickOnRegisterForContestButton = async (e) => {
        // if user is logged in then send the user to the login page
        if(!token) {
            toast.error("Oops! You're not Logged in....");
            await sleep(1000);
            toast.loading("Redirecting you to login page....");
            await sleep(1000);
            toast.dismiss();

            navigate("/login");

            return ;
        }

        console.log("Inside handleClickOnRegisterForContestButton()....");
        // Disable the Button After the Click
        e.target.disabled = true;
        e.target.innerHTML = "Registering";

        try {
            // Make API Call to Register User for the Contest
            console.log("Making API Call to Register User for the Contest....");

            const payload = {
                _id: contestDetails._id,
            };

            const response = await axios.post(`${API_BASE}/contests/register`, payload, {
                headers: {
                    "Content-Type": "application/json",
                    "client-id": clientId,
                    "authorization": token,
                }
            });

            toast.success(response.data.message);
            await sleep(1000);



        } catch (error) {

        }

        // Enable the Button After the Click
        e.target.disabled = false;
        e.target.innerHTML = "Register";


    };


    const handleClickOnStartContestButton = async () => {
        console.log("Inside handleClickOnStartContestButton()....");

        // Navigate User to the "/contests/start/:slug"
        navigate(`/contests/start/${slug}`);
    };




    // Update Time to Start Contest
    const x = setInterval(() => {
        setTimeToStartContest((prev) => {

            var countDownDate = new Date(contestDetails.start_time).getTime();

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
            let newTimeToStartContest = (days < 10 ? "0" + days.toString() : days.toString()) + "D : " + (hours < 10 ? "0" + hours.toString() : hours.toString()) + "H : " + (minutes < 10 ? "0" + minutes.toString() : minutes.toString()) + "M : " + (seconds < 10 ? "0" + seconds.toString() : seconds.toString()) + "S ";

            // If the count down is finished, write some text
            if (distance < 0) {
                clearInterval(x);
                newTimeToStartContest = "STARTED";
            }

            return newTimeToStartContest;
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



    // Update User's Journey State in Contest when User's details or Contest's Details Changes
    useEffect(() => {

        setUserJourneyInContest((prev) => {
            const newStateInUserJourneyContest = user?.participated_in_contests?.includes(contestDetails._id) ? "registered" : "unregistered";
            return newStateInUserJourneyContest;
        });

    }, [token, user, contestDetails]);




    // Websocket Event Listening Logic - Starts Here
    // localStorage.setItem("token", JSON.stringify(tokenFromEventData));
    // localStorage.setItem("user", JSON.stringify(userFromEventData));
    // setToken(tokenFromEventData);
    // setUser(userFromEventData);

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


    // Listener 2: Handle Valid Register for Contest Response
    useSocketListener(
        // Selector: "Is this message for me?"
        (msg) => msg.type?.includes('response') && msg.metadata.operation?.includes("contests.register"),

        // Handler: "What do I do with it?"
        async (msg) => {
            const { data, metadata } = msg;

            // If Register for Contest is Success then Save The Contests For further Accesses 
            if (metadata?.success === true) {
                console.log(data);
                console.log(metadata);

                // Setting Contest's Details from Event Data
                const participantDetailsFromEventData = data.result;

                // Update User's Details that User Has Participated in the Contest
                setUser((prev) => {
                    const updatedUser = {
                        ...prev,
                        ["participated_in_contests"]: [
                            ...(prev.participated_in_contests),
                            participantDetailsFromEventData.contest_id
                        ],
                    };
                    // Save Updated User In the localStorage so that if page refreshes then also the User see the registered status for the registered contest
                    // However updated user from the database can be fetched but the fact why to waste another API call when we know there is no major changes than that thing and if required then we can always do make the API calls
                    localStorage.setItem("user", JSON.stringify(updatedUser));

                    return updatedUser;
                });


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
        <Layout>
            {/* Contest's Details Section - Starts Here */}

            <div className="mt-8 flex flex-col items-center px-8 lg:px-16 py-16 lg:py-8">
                <Heading
                    text={`${contestDetails.name}`}
                />

                <div className="w-full mt-8 px-8 lg:px-16 py-16 lg:py-8 flex flex-col-reverse lg:flex-row gap-8 justify-between">
                    {/* Contest's Description Section - Starts Here */}
                    <div className="text-normal lg:text-xl poppins-regular black-80-text">
                        {contestDetails.description}
                    </div>
                    {/* Contest's Description Section - Ends Here */}


                    {/* Contest Actions Section - Starts Here */}
                    <div className="p-2 border border-1 border-[#0a173233] rounded-xl w-full lg:max-w-72 flex flex-col gap-4 items-center">
                        {contestDetails.end_time <= (new Date()).toISOString() ? <>

                            <h2 className="text-xl lg:text-2xl poppins-semibold">
                                Ended
                            </h2>

                        </> : <>
                            {/* Contest's Timer & Register/Start Button Section - Starts Here */}
                            <h2 className="text-xl lg:text-2xl poppins-semibold">
                                Time to Start
                            </h2>

                            <p className="text-2xl lg:text-2xl poppins-regular">
                                {timeToStartContest}
                            </p>

                            <div className="py-2 flex flex-row gap-4 text-2xl">
                                {userJourneyInContest === "registered" ? <>
                                    {contestDetails.start_time <= (new Date()).toISOString() ? <>

                                        <p className="text-green-400 poppins-semibold">
                                            Registered
                                        </p>

                                    </> : <>
                                        <button
                                            disabled={contestDetails.start_time > (new Date()).toISOString()}
                                            onClick={handleClickOnStartContestButton}
                                            className="transition-all duration-[0.4s] ease-in-out hover:scale-[1.02] active:scale-[0.8] bg-[#47FF4E] cursor-pointer py-3 lg:py-4 px-18 lg:px-20 text-xl lg:text-2xl text-white rounded-full disabled:opacity-[0.2] poppins-semibold custom-smooth-drop-shadow">
                                            Start
                                        </button>
                                    </>}
                                </> :
                                    contestDetails.start_time > (new Date()).toISOString() ?
                                        <>
                                            <button
                                                onClick={handleClickOnRegisterForContestButton}
                                                className="transition-all duration-[0.4s] ease-in-out hover:scale-[1.02] active:scale-[0.8] bg-[#135BEB] cursor-pointer py-3 lg:py-4 px-18 lg:px-20 text-xl lg:text-2xl text-white rounded-full poppins-semibold custom-smooth-drop-shadow">
                                                Register
                                            </button>
                                        </> :
                                        <>
                                        </>}

                            </div>
                            {/* Contest's Timer & Register/Start Button Section - Ends Here */}

                        </>}
                    </div>
                    {/* Contest Actions Section - Ends Here */}



                </div>


            </div>

            {/* Contest's Details Section - Ends Here */}

        </Layout>
    </>;
};

export default ContestDetails;