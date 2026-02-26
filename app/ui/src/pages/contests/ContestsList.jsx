import React, { useEffect, useState } from "react";
import Layout from "../../components/layout/Layout";
import Heading from "../../components/heading/Heading";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { useAuthContext } from "../../contexts/AuthContext";
import { useWebSocketContext } from "../../contexts/WebSocketContext";
import { useSocketListener } from "../../hooks/useSocketListener";
import SearchControls from "../../components/controls/SearchControls";
import SingleSelectInput from "../../components/input/SingleSelectInput";

const ContestsList = () => {

    const sleep = async (milliSeconds) => {
        return new Promise((resolve) => setTimeout(resolve, milliSeconds));
    };

    const { token, user } = useAuthContext();

    const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000/api/v1";

    const { isConnected, clientId } = useWebSocketContext();

    const [loadingContests, setLoadingContests] = useState(false);

    const [filterValue, setFilterValue] = useState({
        status: "", // can have values like "", "all", "upcoming", "ended"
        duration: "", // can have values like "", "9999", "4", "1"
    });

    const [contestsData, setContestsData] = useState([
        {
            id: "1",
            name: "Contest 1",
            slug: "contest-1",
            description: "This is Contest 1 Description transition-all duration-[0.4s] ease-in-out hover:scale-[1.02] border border-2 border-[#0a173233] hover:border-[#0a1732cc] px-4 lg:px-8 py-8 lg:pt-8 lg:pb-16 rounded-xl flex flex-col w-100 transition-all duration-[0.4s] ease-in-out hover:scale-[1.02] border border-2 border-[#0a173233] hover:border-[#0a1732cc] px-4 lg:px-8 py-8 lg:pt-8 lg:pb-16 rounded-xl flex flex-col w-100",
            created_by: "idOfCreatorLike71nv923hb32v2b",
            start_time: "2026-02-25T11:37:18.917Z",
            end_time: "2026-02-25T11:47:18.917Z",
            duration: 600000, // Milliseconds
            support_end_time: "2026-02-26T11:37:18.917Z",
        },
        {
            id: "2",
            name: "Contest 2",
            slug: "contest-2",
            description: "This is Contest 1 Description transition-all duration-[0.4s] ease-in-out hover:scale-[1.02] border border-2 border-[#0a173233] hover:border-[#0a1732cc] px-4 lg:px-8 py-8 lg:pt-8 lg:pb-16 rounded-xl flex flex-col w-100 transition-all duration-[0.4s] ease-in-out hover:scale-[1.02] border border-2 border-[#0a173233] hover:border-[#0a1732cc] px-4 lg:px-8 py-8 lg:pt-8 lg:pb-16 rounded-xl flex flex-col w-100",
            created_by: "idOfCreatorLike71nv923hb32v2b",
            start_time: "2026-02-25T11:47:18.917Z",
            end_time: "2026-02-25T11:57:18.917Z",
            duration: 600000, // Milliseconds
            support_end_time: "2026-02-26T11:37:18.917Z",
        },
        {
            id: "3",
            name: "Contest 3",
            slug: "contest-3",
            description: "This is Contest 3 Description transition-all duration-[0.4s] ease-in-out hover:scale-[1.02] border border-2 border-[#0a173233] hover:border-[#0a1732cc] px-4 lg:px-8 py-8 lg:pt-8 lg:pb-16 rounded-xl flex flex-col w-100 transition-all duration-[0.4s] ease-in-out hover:scale-[1.02] border border-2 border-[#0a173233] hover:border-[#0a1732cc] px-4 lg:px-8 py-8 lg:pt-8 lg:pb-16 rounded-xl flex flex-col w-100",
            created_by: "idOfCreatorLike71nv923hb32v2b",
            start_time: "2026-02-25T11:37:18.917Z",
            end_time: "2026-02-25T11:47:18.917Z",
            duration: 600000, // Milliseconds
            support_end_time: "2026-02-26T11:37:18.917Z",
        },
        {
            id: "4",
            name: "Contest 4",
            slug: "contest-4",
            description: "This is Contest 4 Description transition-all duration-[0.4s] ease-in-out hover:scale-[1.02] border border-2 border-[#0a173233] hover:border-[#0a1732cc] px-4 lg:px-8 py-8 lg:pt-8 lg:pb-16 rounded-xl flex flex-col w-100 transition-all duration-[0.4s] ease-in-out hover:scale-[1.02] border border-2 border-[#0a173233] hover:border-[#0a1732cc] px-4 lg:px-8 py-8 lg:pt-8 lg:pb-16 rounded-xl flex flex-col w-100",
            created_by: "idOfCreatorLike71nv923hb32v2b",
            start_time: "2026-02-25T11:37:18.917Z",
            end_time: "2026-02-25T11:44:18.917Z",
            duration: 600000, // Milliseconds
            support_end_time: "2026-02-26T11:37:18.917Z",
        },
    ]);

    const handleClickOnSearchEnterButton = async (searchText) => {
        try {


            if (loadingContests) {
                console.log("Please Wait! Already Loading Contests....");
                toast.loading("Please Wait! Already Loading Contests....");
                return;
            }

            toast.loading("Loading Contests....");
            console.log("Search Text is....");
            console.log(searchText);
            console.log("Filter is....");
            console.log(filterValue);
            setLoadingContests(true);

            const currDateISOString = (new Date()).toISOString();
            const beforeOneMinuteCurrDateISOString = new Date((new Date(currDateISOString)).getTime() - 60000).toISOString();
            const pastOneMinuteCurrDateISOString = new Date((new Date(currDateISOString)).getTime() + 60000).toISOString();

            const payload = {
                name: searchText,
                slug: searchText,
                description: searchText,
                start_time: filterValue.status === "all" ? null : (filterValue.status === "upcoming" ? pastOneMinuteCurrDateISOString : null),
                end_time: filterValue.status === "all" ? null : (filterValue.status === "ended" ? beforeOneMinuteCurrDateISOString : null),
                duration: parseInt(filterValue?.duration === "" ? 0 : filterValue.duration) || 9999999999,
            };


            console.log("Payload to search contests....");
            console.log(payload);



            const response = await axios.post(`${API_BASE}/contests/search`, payload, {
                headers: {
                    "Content-Type": "application/json",
                    "client-id": clientId
                }
            });

            toast.success(response.data.message);
            await sleep(1000);

        } catch (error) {
            // Clear All Toasts
            toast.dismiss();
            setLoadingContests(false);

            console.log(error);
            console.log("Something Went Wrong While Making the CONTESTS' API Call....", error);
            toast.error("Something went Wrong....");
        }
    };





    // If the WebSocket Connection Changes then Please Fetch All the Contests Again
    useEffect(() => {
        const fetchAllContests = async () => {
            try {
                const response = await axios.get(`${API_BASE}/contests/all`, {
                    headers: {
                        "client-id": clientId
                    }
                })


                toast.success(response.data.message);


            } catch (error) {
                console.log(error);
                console.log("Something Went Wrong While Making the CONTESTS' API Call....", error);
                toast.error("Something went Wrong....");
            }
        };

        if (clientId) {
            fetchAllContests();
        }

    }, [token, user, isConnected, clientId]);




    // Websocket Event Listening Logic - Starts Here
    // Listener 1: Handle Valid Get All Contests Response
    useSocketListener(
        // Selector: "Is this message for me?"
        (msg) => msg.type?.includes('response') && msg.metadata.operation?.includes("contests.getAllContests"),

        // Handler: "What do I do with it?"
        async (msg) => {
            const { data, metadata } = msg;

            // If Get All Contests is Success then Save The Contests For further Accesses 
            if (metadata?.success === true) {
                console.log(data);
                console.log(metadata);

                // Setting All Contests from Event Data
                const allContestsFromEventData = data.result;

                setContestsData(() => {
                    const newTableRowsData = allContestsFromEventData.map((contest, index) => {
                        return {
                            id: index + 1,
                            name: contest.name,
                            slug: contest.slug,
                            description: contest.description,
                            created_by: contest.created_by,
                            start_time: contest.start_time,
                            end_time: contest.end_time,
                            duration: contest.duration,
                            support_end_time: contest.support_end_time,
                        };
                    });

                    return newTableRowsData;
                });

                setLoadingContests(false);


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


    // Listener 2: Handle Valid Search Contests Response
    useSocketListener(
        // Selector: "Is this message for me?"
        (msg) => msg.type?.includes('response') && msg.metadata.operation?.includes("contests.search"),

        // Handler: "What do I do with it?"
        async (msg) => {
            // Clear the Previous Toast Notifications
            toast.dismiss();

            const { data, metadata } = msg;

            // If Search Contests is Success then Save The Contests For further Accesses 
            if (metadata?.success === true) {
                console.log(data);
                console.log(metadata);

                // Setting All Contests from Event Data
                const allContestsFromEventData = data.result;

                setContestsData(() => {
                    const newTableRowsData = allContestsFromEventData.map((contest, index) => {
                        return {
                            id: index + 1,
                            name: contest.name,
                            slug: contest.slug,
                            description: contest.description,
                            created_by: contest.created_by,
                            start_time: contest.start_time,
                            end_time: contest.end_time,
                            duration: contest.duration,
                            support_end_time: contest.support_end_time,
                        };
                    });

                    return newTableRowsData;
                });

                setLoadingContests(false);


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
            {/* Contests' List Section - Starts Here */}

            <div className="mt-8 flex flex-col items-center px-8 lg:px-16 py-16 lg:py-8">
                <Heading
                    text={"Contests"}
                />

                {/* Search Controls - Starts Here */}
                <div
                    className={`w-full ${loadingContests ? "animate-pulse" : ""}`}
                >

                    <SearchControls
                        placeholderText={`Search Contests....`}
                        onClickSubmitSearchButton={handleClickOnSearchEnterButton}
                    >
                        <SearchControls.Filter>

                            <>
                                <div className="w-full px-4 py-8 my-8 flex flex-col gap-8 border border-2 border-[#0a13720d] rounded-xl">

                                    <Heading
                                        text={`Filters`}
                                    />

                                    <SingleSelectInput
                                        id="contests-filter-status"
                                        value={filterValue.status}
                                        onValueChange={(e) =>
                                            setFilterValue(prev => ({
                                                ...prev,
                                                status: e.target.value
                                            }))
                                        }
                                        placeholderText="Select Contest's Status...."
                                        options={[
                                            { label: "All", value: "all" },
                                            { label: "Upcoming", value: "upcoming" },
                                            { label: "Ended", value: "ended" },
                                        ]}
                                        optionsHeading={`Status`}
                                    />

                                    <SingleSelectInput
                                        id="contests-filter-duration"
                                        value={filterValue.duration}
                                        onValueChange={(e) =>
                                            setFilterValue(prev => ({
                                                ...prev,
                                                duration: e.target.value
                                            }))
                                        }
                                        placeholderText="Select Contest's Duration...."
                                        options={[
                                            { label: "All", value: "9999999999" },
                                            { label: "Upto 1 Hour Long", value: "3600000" },
                                            { label: "Upto 4 Hour Long", value: "14400000" },
                                        ]}
                                        optionsHeading={`Duration`}
                                    />
                                </div>
                            </>

                        </SearchControls.Filter>
                    </SearchControls>

                </div>

                {/* Search Controls - Ends Here */}


                <div className="w-full flex flex-col lg:flex-row flex-wrap justify-center gap-16 mt-8 px-8 lg:px-16 py-16 lg:py-8">
                    {(contestsData && contestsData.length > 0) ? <>

                        {contestsData.map((contest) => {
                            const currDateISOString = (new Date()).toISOString();

                            const isStarted = contest.start_time < currDateISOString;
                            const isEnded = contest.end_time < currDateISOString;

                            const contestStatus =  isEnded ? "ended" : (isStarted ? "live" : "upcoming");
                            console.log(contestStatus,  " we have for contest ", contest.slug , contest.start_time, contest.end_time, currDateISOString);

                            return <div
                                key={`contest-${contest.id}`}
                                className="transition-all duration-[0.4s] ease-in-out border border-2 border-[#0a173233] hover:border-[#0a1732cc] px-4 lg:px-8 py-8 lg:pt-8 lg:pb-16 rounded-xl max-w-100 flex flex-col">

                                <div className="py-2">
                                    <h2 className="text-xl lg:text-2xl poppins-semibold">
                                        {contest.name}
                                    </h2>
                                    <p className={`text-sm tracking-widest ${contestStatus === "live" ? "text-green-400" : (contestStatus === "upcoming" ? "text-red-400" : "text-gray-400")} poppins-semibold`}>
                                        {contestStatus.toUpperCase()}
                                    </p>
                                </div>
                                <p className="mb-8 text-wrap black-80-text">
                                    {(contest.description).slice(0, 200)}....
                                </p>

                                <Link
                                    to={`/contests/${contest.slug}`}
                                    className="transition-all duration-[0.4s] ease-in-out hover:scale-[1.02] active:scale-[0.8] bg-[#135BEB] cursor-pointer py-3 mt-8 lg:py-4 px-18 lg:px-20 text-lg lg:text-xl text-white rounded-full poppins-semibold text-center mx-2 mb-2 custom-smooth-drop-shadow">
                                    Read More
                                </Link>
                            </div>
                        })}


                        {/* <button
                            className="mt-16 px-16 py-4 rounded-full text-white text-lg lg:text-xl primary-gradient-bg poppins-semibold"
                            onClick={handleClickOnMoreButton}
                        >
                            Get More
                        </button> */}

                    </> : <>
                        <div className="flex items-center justify-center text-4xl poppins-semibold">
                            No Contests to participate....
                        </div>
                    </>}
                </div>


            </div>

            {/* Contests' List Section - Ends Here */}

        </Layout>
    </>;
};

export default ContestsList;