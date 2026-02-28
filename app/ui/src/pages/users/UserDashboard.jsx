import React, { useEffect, useState } from "react";
import Layout from "../../components/layout/Layout";
import Heading from "../../components/heading/Heading";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { useAuthContext } from "../../contexts/AuthContext";
import { useWebSocketContext } from "../../contexts/WebSocketContext";
import { useSocketListener } from "../../hooks/useSocketListener";
import FeatureBox from "../../components/feature/FeatureBox";
import codeIcon from "../../assets/icons/code-icon.svg";
import badgeIcon from "../../assets/icons/badge-icon.svg";

const UserDashboard = () => {


    const sleep = async (milliSeconds) => {
        return new Promise((resolve) => setTimeout(resolve, milliSeconds));
    };

    const { token, user, setUser } = useAuthContext();

    let navigate = useNavigate();

    const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000/api/v1";

    const { isConnected, clientId } = useWebSocketContext();

    const { slug } = useParams();

    const [allContestsAttemptedByUser, setAllContestsAttemptedByUser] = useState(
        [
            {
                _id: "1",
                name: "Contest 1",
                slug: "contest-1",
                description: "This is Contest 1 Description transition-all duration-[0.4s] ease-in-out hover:scale-[1.02] border border-2 border-[#0a173233] hover:border-[#0a1732cc] px-4 lg:px-8 py-8 lg:pt-8 lg:pb-16 rounded-xl flex flex-col w-100 transition-all duration-[0.4s] ease-in-out hover:scale-[1.02] border border-2 border-[#0a173233] hover:border-[#0a1732cc] px-4 lg:px-8 py-8 lg:pt-8 lg:pb-16 rounded-xl flex flex-col w-100",
                created_by: "idOfCreatorLike71nv923hb32v2b",
                start_time: "2026-02-25T20:37:18.917Z",
                end_time: "2026-02-25T20:47:18.917Z",
                duration: 600000, // Milliseconds
                support_end_time: "2026-02-26T11:37:18.917Z",
            },

            {
                _id: "2",
                name: "Contest 2",
                slug: "contest-2",
                description: "This is Contest 2 Description transition-all duration-[0.4s] ease-in-out hover:scale-[1.02] border border-2 border-[#0a173233] hover:border-[#0a1732cc] px-4 lg:px-8 py-8 lg:pt-8 lg:pb-16 rounded-xl flex flex-col w-100 transition-all duration-[0.4s] ease-in-out hover:scale-[1.02] border border-2 border-[#0a173233] hover:border-[#0a1732cc] px-4 lg:px-8 py-8 lg:pt-8 lg:pb-16 rounded-xl flex flex-col w-100",
                created_by: "idOfCreatorLike71nv923hb32v2b",
                start_time: "2026-02-25T20:37:18.917Z",
                end_time: "2026-02-25T20:47:18.917Z",
                duration: 600000, // Milliseconds
                support_end_time: "2026-02-26T11:37:18.917Z",
            },
        ]
    );

    // Please Note: Edit this If Any Other Role Can Access the Control Panel 
    const controlPanelAllowedUserRoles = ["ADMIN", "CONTEST_SCHEDULER", "SUPPORT"];


    const [allProblemsAttemptedByUser, setAllProblemsAttemptedByUser] = useState([
        {
            _id: "1",
            name: "Problem 1",
            slug: "problem-1",
            description: "This is Problem 1 Description transition-all duration-[0.4s] ease-in-out hover:scale-[1.02] border border-2 border-[#0a173233] hover:border-[#0a1732cc] px-4 lg:px-8 py-8 lg:pt-8 lg:pb-16 rounded-xl flex flex-col w-100 transition-all duration-[0.4s] ease-in-out hover:scale-[1.02] border border-2 border-[#0a173233] hover:border-[#0a1732cc] px-4 lg:px-8 py-8 lg:pt-8 lg:pb-16 rounded-xl flex flex-col w-100",
        },
        {
            _id: "2",
            name: "Problem 2",
            slug: "problem-2",
            description: "This is Problem 2 Description transition-all duration-[0.4s] ease-in-out hover:scale-[1.02] border border-2 border-[#0a173233] hover:border-[#0a1732cc] px-4 lg:px-8 py-8 lg:pt-8 lg:pb-16 rounded-xl flex flex-col w-100 transition-all duration-[0.4s] ease-in-out hover:scale-[1.02] border border-2 border-[#0a173233] hover:border-[#0a1732cc] px-4 lg:px-8 py-8 lg:pt-8 lg:pb-16 rounded-xl flex flex-col w-100",
        },
    ]);


    const [visiblePart, setVisiblePart] = useState({
        dashboard: true,
        profile: false,
        problems: false,
        contests: false,
        supportTickets: false,
        controlPanel: false,
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
            case "dashboard":
                {
                    // Show Dashboard
                    setVisiblePart((prev) => {
                        return {
                            ...prev,
                            ["dashboard"]: true,
                        };
                    });

                }

                break;

            case "profile":
                {
                    // Show Profile
                    setVisiblePart((prev) => {
                        return {
                            ...prev,
                            ["profile"]: true,
                        };
                    });

                }

                break;

            case "problems":
                {
                    // Show Problems
                    setVisiblePart((prev) => {
                        return {
                            ...prev,
                            ["problems"]: true,
                        };
                    });
                }

                break;

            case "contests":
                {
                    // Show Contests
                    setVisiblePart((prev) => {
                        return {
                            ...prev,
                            ["contests"]: true,
                        };
                    });
                }

                break;

            case "supportTickets":
                {
                    // Show Support Tickets
                    setVisiblePart((prev) => {
                        return {
                            ...prev,
                            ["supportTickets"]: true,
                        };
                    });
                }

                break;

            case "controlPanel":
                {
                    // Navigate to Control Panel
                    if (controlPanelAllowedUserRoles.includes(user.role)) {
                        navigate("/admins/control-panel");
                    }
                    else {
                        toast.error("Sorry! You Need to login with Admin Account....");
                        // Show Dashboard Again
                        setVisiblePart((prev) => {
                            return {
                                ...prev,
                                ["dashboard"]: true,
                            };
                        });
                    }
                }

                break;

            default:
                {

                    console.log("Something unexpected option clicked in contest controls menu: ", e);

                }


                break;
        }

        console.log("Bhai ", idOfContestMenuControlsElement, " is clicked and now....");
        console.log(visiblePart);

    };


    // Whenever User, Token changes check if the user's details are there or not and if not then redirect to login page
    useEffect(() => {

        if (!user) {
            toast.error("Sorry! You Need to login to View Dashboard....");
            navigate("/login");

            return;
        }
    }, [token, user]);



    // Websocket Event Listening Logic - Starts Here


    // Websocket Event Listening Logic - Ends Here



    return <>

        <Layout>

            {/* Dashboard's Details Section - Starts Here */}

            <div className="flex flex-col items-center px-8 lg:px-16 py-16 lg:py-8">


                {/* Dashboard's Content & Menu Section - Starts Here  */}
                <div className="w-full my-8 flex flex-row gap-4">

                    {/* Dashboard's Menu Controls - Starts Here */}
                    <div className="w-70 flex flex-col gap-8">

                        <ul className="flex flex-col gap-4 poppins-medium">
                            <li
                                id="dashboard"
                                className={`transition-all duration-[0.4s] ease-in-out hover:scale-[1.02] active:scale-[0.8] cursor-pointer border border-1 border-[#0a173233] hover:border-[#0a1732cc] rounded-xl px-2 lg:px-4 py-1 lg:py-2 ${visiblePart["dashboard"] === false ? "opacity-[0.8]" : "scale-[1.08] border-[#0a1732]"}`}
                                onClick={handleClickOnContestMenuControls}
                            >
                                Dashboard
                            </li>

                            <li
                                id="profile"
                                className={`transition-all duration-[0.4s] ease-in-out hover:scale-[1.02] active:scale-[0.8] cursor-pointer border border-1 border-[#0a173233] hover:border-[#0a1732cc] rounded-xl px-2 lg:px-4 py-1 lg:py-2 ${visiblePart["profile"] === false ? "opacity-[0.8]" : "scale-[1.08] border-[#0a1732]"}`}
                                onClick={handleClickOnContestMenuControls}
                            >
                                Profile
                            </li>

                            {/* <li
                                id="problems"
                                className={`transition-all duration-[0.4s] ease-in-out hover:scale-[1.02] active:scale-[0.8] cursor-pointer border border-1 border-[#0a173233] hover:border-[#0a1732cc] rounded-xl px-2 lg:px-4 py-1 lg:py-2 ${visiblePart["problems"] === false ? "opacity-[0.8]" : "scale-[1.08] border-[#0a1732]"}`}
                                onClick={handleClickOnContestMenuControls}
                            >
                                Problems
                            </li>


                            <li
                                id="contests"
                                className={`transition-all duration-[0.4s] ease-in-out hover:scale-[1.02] active:scale-[0.8] cursor-pointer border border-1 border-[#0a173233] hover:border-[#0a1732cc] rounded-xl px-2 lg:px-4 py-1 lg:py-2 ${visiblePart["contests"] === false ? "opacity-[0.8]" : "scale-[1.08] border-[#0a1732]"}`}
                                onClick={handleClickOnContestMenuControls}
                            >
                                Contests
                            </li>


                             <li
                                id="supportTickets"
                                className={`transition-all duration-[0.4s] ease-in-out hover:scale-[1.02] active:scale-[0.8] cursor-pointer border border-1 border-[#0a173233] hover:border-[#0a1732cc] rounded-xl px-2 lg:px-4 py-1 lg:py-2 ${visiblePart["supportTickets"] === false ? "opacity-[0.8]" : "scale-[1.08] border-[#0a1732]"}`}
                                onClick={handleClickOnContestMenuControls}
                            >
                                Support Tickets
                            </li> */}


                            <li
                                id="controlPanel"
                                className={`transition-all duration-[0.4s] ease-in-out hover:scale-[1.02] active:scale-[0.8] cursor-pointer border border-1 border-[#0a173233] hover:border-[#0a1732cc] rounded-xl px-2 lg:px-4 py-1 lg:py-2 ${visiblePart["controlPanel"] === false ? "opacity-[0.8]" : "scale-[1.08] border-[#0a1732]"}`}
                                onClick={handleClickOnContestMenuControls}
                            >
                                Control Panel
                            </li>




                        </ul>


                    </div>
                    {/* Dashboard's Menu Controls - Ends Here */}


                    {/* User's Profile, Attempted Problems, Participated Contests, Support Tickets Description - Starts Here */}
                    <div className="ms-2 border border-0 border-s-2 border-[#0a173233] px-8 w-full min-h-screen">

                        {/* Dashboard Section - Starts Here */}
                        {visiblePart.dashboard ? <>
                            <div className="text-xl flex flex-col items-center gap-4 lg:gap-8 poppins-regular">

                                <div className="">
                                    {/* User's Name Section - Starts Here */}
                                    <h2 className="text-2xl lg:text-4xl poppins-semibold">
                                        Hi, {user?.name}
                                    </h2>
                                    {/* User's Name Section - Ends Here */}

                                    <p className="text-sm lg:text-lg black-80-text">
                                        Let's level up more today : )
                                    </p>

                                </div>


                                {/* User's Data Overview Section - Starts Here */}
                                <div className="flex flex-row flex-wrap justify-center items-center gap-12">

                                    <FeatureBox
                                        imageInfo={{
                                            url: codeIcon,
                                            altText: "Icon Representing the Code used for Problem Attempted Analytics demostration"
                                        }}
                                        name={user?.tried_problems?.length}
                                        description={"Problems Attempted"}
                                    />

                                    <FeatureBox
                                        imageInfo={{
                                            url: badgeIcon,
                                            altText: "Icon Representing the Badge used for Contest Participated Analytics demostration"
                                        }}
                                        name={user?.participated_in_contests?.length}
                                        description={"Contests Participated"}
                                    />

                                </div>
                                {/* User's Data Overview Section - Ends Here */}




                            </div>
                        </> : <></>}
                        {/* Dashboard Section - Ends Here */}


                        {/* Profile Section - Starts Here */}
                        {visiblePart.profile ? <>
                            <div className="flex flex-col gap-4 lg:gap-8 text-xl poppins-regular">

                                <div className="flex flex-row gap-4">
                                    <h3 className="text-lg lg:text-xl">
                                        Name:
                                    </h3>
                                    <p className="black-80-text poppins-regular">
                                        {user?.name}
                                    </p>
                                </div>

                                <div className="flex flex-row gap-4">
                                    <h3 className="text-lg lg:text-xl">
                                        Username:
                                    </h3>
                                    <p className="black-80-text poppins-regular">
                                        {user.user_name}
                                    </p>
                                </div>

                                <div className="flex flex-row gap-4">
                                    <h3 className="text-lg lg:text-xl">
                                        Email:
                                    </h3>
                                    <p className="black-80-text poppins-regular">
                                        {user.email}
                                    </p>
                                </div>

                                <div className="flex flex-row gap-4">
                                    <h3 className="text-lg lg:text-xl">
                                        Mobile No. :
                                    </h3>
                                    <p className="black-80-text poppins-regular">
                                        {user.mobile_no}
                                    </p>
                                </div>

                                <div className="flex flex-row gap-4">
                                    <h3 className="text-lg lg:text-xl">
                                        Activation Status:
                                    </h3>
                                    <p className="black-80-text poppins-regular">
                                        {user.activation_status}
                                    </p>
                                </div>


                                <div className="flex flex-row gap-4">
                                    <h3 className="text-lg lg:text-xl">
                                        Role:
                                    </h3>
                                    <p className="black-80-text poppins-regular">
                                        {user.role}
                                    </p>
                                </div>



                                <div className="flex flex-row gap-4 mt-8">
                                    <Link to={"/logout"}>
                                        <h4 className="text-2xl px-16 py-4 rounded-full text-white bg-[#ff2929] poppins-semibold">
                                            Logout
                                        </h4>
                                    </Link>
                                </div>


                            </div>
                        </> : <></>}
                        {/* Profile Section - Ends Here */}


                        {/* Attempted Problems' List Section  - Starts Here */}
                        {visiblePart.problems ? <>
                            <div className="text-xl h-full flex flex-col gap-16 poppins-regular">
                                Bhai Main Attempted Problems' List Hoon :)

                            </div>
                        </> : <></>}
                        {/* Attempted Problems' List Section  - Ends Here */}


                        {/* Participated Contests Section  - Starts Here */}
                        {visiblePart.contests ? <>
                            <div className="text-xl h-full flex flex-col gap-16 poppins-regular">
                                Bhai Main Participated Contests Hoon :)

                            </div>
                        </> : <></>}
                        {/* Participated Contests Section  - Ends Here */}


                        {/* Support Tickets' List Section  - Starts Here */}
                        {visiblePart.supportTickets ? <>
                            <div className="text-xl h-full flex flex-col gap-16 poppins-regular">
                                Bhai Main Support Tickets' List Hoon :)

                            </div>
                        </> : <></>}
                        {/* Support Tickets' List Section  - Ends Here */}


                    </div>
                    {/* User's Profile, Attempted Problems, Participated Contests, Support Tickets Description - Ends Here */}

                </div>
                {/* Dashboard's Content & Menu Section - Ends Here  */}


            </div>

            {/* Dashboard's Details Section - Ends Here */}

        </Layout>


    </>;
};

export default UserDashboard;