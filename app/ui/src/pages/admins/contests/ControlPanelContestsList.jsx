import React, { useEffect, useState } from "react";
import Layout from "../../../components/layout/Layout";
import { Link, useNavigate } from "react-router-dom";
import Heading from "../../../components/heading/Heading";
import ControlPanelLayout from "../../../components/layout/ControlPanelLayout";
import TextInput from "../../../components/input/TextInput";
import SearchControls from "../../../components/controls/SearchControls";
import { useAuthContext } from "../../../contexts/AuthContext";
import { useWebSocketContext } from "../../../contexts/WebSocketContext";
import axios from "axios";
import { toast } from "sonner";
import { useSocketListener } from "../../../hooks/useSocketListener";
import TagsInput from "../../../components/input/TagsInput";
import SingleSelectInput from "../../../components/input/SingleSelectInput";

const ControlPanelContestsList = () => {

    const sleep = async (milliSeconds) => {
        return new Promise((resolve) => setTimeout(resolve, milliSeconds));
    };

    const getLocalDateTimeStringFromISOString = (ISOString) => {

        const ISOStringDate = new Date(ISOString);
        let localDateTimeString = ISOStringDate.toDateString() + " " + ISOStringDate.toLocaleTimeString();

        return localDateTimeString;

    };

    const navigate = useNavigate();

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
            _id: "169889d99d55e626d8ec4493e",
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
            _id: "269889d99d55e626d8ec4493e",
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
            _id: "369889d99d55e626d8ec4493e",
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
            _id: "469889d99d55e626d8ec4493e",
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
            const payload = {};
            try {
                const response = await axios.post(`${API_BASE}/contests/control/search`, payload, {
                    headers: {
                        "Content-Type": "application/json",
                        "client-id": clientId,
                        "authorization": token,
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


    const handleClickOnCreateContestButton = async () => {
        console.log("Inside handleClickOnCreateContestButton()....");
        if (["ADMIN", "CONTEST_SCHEDULER"].includes(user.role) === false) {
            toast.error("Sorry! ADMIN, CONTEST_SCHEDULER Users can Create the Contests....");
            return;
        }

        
        navigate(`/admins/control-panel/contests/create`);
    };




    // Websocket Event Listening Logic - Starts Here
    // Listener 1: Handle Valid Get All Contests Response
    useSocketListener(
        // Selector: "Is this message for me?"
        (msg) => msg.type?.includes('response') && msg.metadata.operation?.includes("contests.control.search"),

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
                            ...contest,
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
        (msg) => msg.type?.includes('response') && msg.metadata.operation?.includes("contests.control.search"),

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
                            ...contest
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
        <ControlPanelLayout
            activeMenuOptionId={'contests'}
        >

            {/* Control Panel's Details Section - Starts Here */}
            {/* Contests' List Section - Starts Here */}
            <div className="flex flex-col items-center px-2 lg:px-4">

                <div className="w-full border border-0 border-b-2 border-[#0a17320d] pb-2 lg:pb-4 mb-4 lg:mb-8">

                    <button
                        onClick={handleClickOnCreateContestButton}
                        className="transition-all duration-[0.4s] ease-in-out hover:scale-[1.02] active:scale-[0.8] cursor-pointer py-2 lg:py-4 px-8 lg:px-16 text-lg lg:text-2xl text-white rounded-full disabled:opacity-[0.2] text-center poppins-semibold custom-smooth-drop-shadow primary-gradient-bg">
                        Create
                    </button>

                </div>


                <Heading
                    text={`Contests`}
                />


                {/* Search Controls - Starts Here */}
                {/* <div
                    className={`w-full ${loadingProblems ? "animate-pulse" : ""}`}
                >

                    <SearchControls
                        placeholderText={`Search: Add Numbers, Factorial....`}
                        onClickSubmitSearchButton={handleClickOnSearchEnterButton}
                    >
                        <SearchControls.Filter>

                            <>
                                <div className="w-full px-4 py-8 my-8 flex flex-col gap-8 border border-2 border-[#0a13720d] rounded-xl">

                                    <Heading
                                        text={`Filters`}
                                    />

                                    <TagsInput
                                        id={`problems-filter-tags`}
                                        value={filterValue.tags}
                                        onValueChange={(tags) => {
                                            setFilterValue((prev) => {
                                                return {
                                                    ...prev,
                                                    tags: tags,
                                                };
                                            });
                                        }}
                                        placeholderText={`Add Problem's Tags like array, string....`}
                                        tagsHeading={`Problem's Tags`}
                                    />

                                    <SingleSelectInput
                                        id="problems-filter-difficulty"
                                        value={filterValue.difficulty}
                                        onValueChange={(e) =>
                                            setFilterValue(prev => ({
                                                ...prev,
                                                difficulty: e.target.value
                                            }))
                                        }
                                        placeholderText="Select Problem's difficulty...."
                                        options={[
                                            { label: "All", value: "all" },
                                            { label: "Easy", value: "easy" },
                                            { label: "Medium", value: "medium" },
                                            { label: "Hard", value: "hard" },
                                        ]}
                                        optionsHeading={`Difficulty`}
                                    />
                                </div>
                            </>

                        </SearchControls.Filter>
                    </SearchControls>

                </div> */}

                {/* Search Controls - Ends Here */}


                <div className="w-full overflow-x-auto mt-8 px-2 lg:px-4 py-16 lg:py-8">
                    {(contestsData && contestsData.length > 0) ? <>

                        <table className="w-full text-nowrap overflow-x-auto table-auto">
                            {/* Table Heading Fields - Starts Here */}
                            <thead className="text-lg lg:text-2xl poppins-semibold black-100-text">

                                <tr className="text-center border border-0 border-b-1 border-[#0a173266]">
                                    <th className="mb-4 py-4 px-4">
                                        Id
                                    </th>
                                    <th className="mb-4 py-4 px-4">
                                        Name
                                    </th>
                                    <th className="mb-4 py-4 px-4">
                                        Created By
                                    </th>
                                    <th className="mb-4 py-4 px-4">
                                        Start Time
                                    </th>
                                    <th className="mb-4 py-4 px-4">
                                        End Time
                                    </th>
                                    <th className="mb-4 py-4 px-4">
                                        Support End Time
                                    </th>
                                </tr>

                            </thead>
                            {/* Table Heading Fields - Ends Here */}


                            {/* Table Body Data - Starts Here */}
                            <tbody>

                                {contestsData.map((contest, index) => {

                                    return <tr className="text-center border border-0 border-b-1 border-[#0a17321a]" key={`table-heading-${index}`}>
                                        <td className="mb-4 py-4 px-4">
                                            {contest._id}
                                        </td>

                                        <td className="mb-4 py-4 text-blue-400 text-underline">
                                            <Link className="cursor-pointer underline primary-color-text" to={`/admins/control-panel/contests/${contest.slug}`}>
                                                {contest.name}
                                            </Link>
                                        </td>

                                        <td className="mb-4 py-4 px-4">
                                            {contest.created_by}
                                        </td>

                                        <td className="mb-4 py-4 px-4">
                                            {getLocalDateTimeStringFromISOString(contest.start_time)}
                                        </td>

                                        <td className="mb-4 py-4 px-4">
                                            {getLocalDateTimeStringFromISOString(contest.end_time)}
                                        </td>

                                        <td className="mb-4 py-4 px-4">
                                            {getLocalDateTimeStringFromISOString(contest.support_end_time)}
                                        </td>



                                    </tr>;
                                })}

                            </tbody>
                            {/* Table Body Data - Ends Here */}
                        </table>

                        {/* <button
                        className="mt-16 px-16 py-4 rounded-full text-white text-lg lg:text-xl primary-gradient-bg poppins-semibold"
                        onClick={handleClickOnMoreButton}
                    >
                        Get More
                    </button> */}

                    </> : <>
                        <div className="flex items-center justify-center text-4xl poppins-semibold">
                            No Contests to Participate....
                        </div>
                    </>}
                </div>
            </div>
            {/* Contests' List Section - Ends Here */}


            {/* Control Panel's Details Section - Ends Here */}
        </ControlPanelLayout>
    </>
};

export default ControlPanelContestsList;