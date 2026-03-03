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

const ControlPanelProblemsList = () => {

    const sleep = async (milliSeconds) => {
        return new Promise((resolve) => setTimeout(resolve, milliSeconds));
    };

    const navigate = useNavigate();

    const { token, user } = useAuthContext();

    const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000/api/v1";

    const { isConnected, clientId } = useWebSocketContext();

    const [tableHeadings, setTableHeadings] = useState([
        "Id",
        "Name",
        "Created By",
        "Difficulty",
        "URL",
    ]);


    const [tableRowsData, setTableRowsData] = useState([
        {
            _id: "1",
            name: "Calculate Factorial",
            slug: "calculate-factorial",
            tags: ["easy", "factorial", "mauj", "new"],
            description: "Calculate Factorial Description",
            difficulty: "easy", // Have values like: "easy", "medium", "hard"
            is_public: true, // boolean type i.e. true or false
            created_by: "SUPER",
        },

        {
            _id: "2",
            name: "Calculate Area",
            slug: "calculate-area",
            tags: ["medium", "area"],
            description: "Calculate Area Description",
            difficulty: "medium", // Have values like: "easy", "medium", "hard"
            is_public: false, // boolean type i.e. true or false
            created_by: "SUPER",
        },

        {
            _id: "3",
            name: "Calculate Volume",
            slug: "calculate-volume",
            tags: ["hard", "volume"],
            description: "Calculate Volume Description",
            difficulty: "hard", // Have values like: "easy", "medium", "hard"
            is_public: true, // boolean type i.e. true or false
            created_by: "SUPER",
        },

    ]);


    const [loadingProblems, setLoadingProblems] = useState(false);

    const [filterValue, setFilterValue] = useState({
        name: "",
        slug: "",
        tags: [],
        description: "",
        difficulty: "", // Have values like: "easy", "medium", "hard"
        is_public: true, // boolean type i.e. true or false
        created_by: "",
    });

    const handleClickOnCreateProblemButton = async () => {
        console.log("Inside handleClickOnCreateProblemButton()....");
        navigate("/admins/control-panel/problems/create");

    };


    const handleClickOnSearchEnterButton = async (searchText) => {
        try {


            if (loadingProblems) {
                console.log("Please Wait! Already Loading Problems....");
                toast.loading("Please Wait! Already Loading Problems....");
                return;
            }

            toast.loading("Loading Problems....");
            console.log("Search Text is....");
            console.log(searchText);
            console.log("Filter is....");
            console.log(filterValue);
            setLoadingProblems(true);

            const payload = {
                name: searchText,
                slug: searchText,
                tags: (filterValue?.tags).length > 0 ? filterValue?.tags || null : null,
                description: searchText,
                difficulty: (filterValue?.difficulty?.length > 0 ? (filterValue.difficulty === "all" ? null : filterValue.difficulty) : null) || null,
            };


            // console.log("Payload to search problems....");
            // console.log(payload);



            const response = await axios.post(`${API_BASE}/problems/search`, payload, {
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
            setLoadingProblems(false);


            console.log(error);
            console.log("Something Went Wrong While Making the PROBLEMS' API Call....", error);
            toast.error("Something went Wrong....");
        }
    };




    // If the WebSocket Connection Changes then Please Fetch All the Problems Again
    useEffect(() => {
        const fetchAllProblems = async () => {
            const payload = {};
            try {
                const response = await axios.post(`${API_BASE}/problems/control/search`, payload, {
                    headers: {
                        "Content-Type": "application/json",
                        "client-id": clientId,
                        "authorization": token,
                    }
                })

                toast.success(response.data.message);


            } catch (error) {
                console.log(error);
                console.log("Something Went Wrong While Making the PROBLEMS' API Call....", error);
                toast.error("Something went Wrong....");
            }
        };

        if (clientId) {
            fetchAllProblems();
        }

    }, [token, user, isConnected, clientId]);




    // Websocket Event Listening Logic - Starts Here
    // Listener 1: Handle Valid Get All Problems i.e. Search Without Filter Response
    useSocketListener(
        // Selector: "Is this message for me?"
        (msg) => msg.type?.includes('response') && msg.metadata.operation?.includes("problems.control.search"),

        // Handler: "What do I do with it?"
        async (msg) => {
            // Clear the Previous Toast Notifications
            toast.dismiss();

            const { data, metadata } = msg;

            // If Get All Problems i.e. Search Without Filter is Success then Save The Problems For further Accesses 
            if (metadata?.success === true) {
                console.log(data);
                console.log(metadata);

                // Setting All Problems from Event Data
                const allProblemsFromEventData = data.result;

                setTableRowsData(() => {
                    const newTableRowsData = allProblemsFromEventData.map((problem, index) => {
                        return {
                            id: index + 1,
                            name: problem.name,
                            difficulty: problem.difficulty,
                            slug: problem.slug,
                        };
                    });

                    return newTableRowsData;
                });

                setLoadingProblems(false);


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

    // Listener 2: Handle Valid Search Problems with Filter Made By User Response 
    useSocketListener(
        // Selector: "Is this message for me?"
        (msg) => msg.type?.includes('response') && msg.metadata.operation?.includes("problems.control.search"),

        // Handler: "What do I do with it?"
        async (msg) => {
            // Clear the Previous Toast Notifications
            toast.dismiss();

            const { data, metadata } = msg;

            // If Search Problems is Success then Save The Problems For further Accesses 
            if (metadata?.success === true) {
                console.log(data);
                console.log(metadata);

                // Setting All Problems from Event Data
                const allProblemsFromEventData = data.result;

                setTableRowsData(() => {
                    const newTableRowsData = allProblemsFromEventData.map((problem, index) => {
                        return { ...problem };
                    });

                    return newTableRowsData;
                });

                setLoadingProblems(false);


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
            activeMenuOptionId={'problems'}
        >

            {/* Control Panel's Details Section - Starts Here */}
            {/* Problems' List Section - Starts Here */}
            <div className="flex flex-col items-center px-2 lg:px-4">

                <div className="w-full border border-0 border-b-2 border-[#0a17320d] pb-2 lg:pb-4 mb-4 lg:mb-8">

                    <button
                        onClick={handleClickOnCreateProblemButton}
                        className="transition-all duration-[0.4s] ease-in-out hover:scale-[1.02] active:scale-[0.8] cursor-pointer py-2 lg:py-4 px-8 lg:px-16 text-lg lg:text-2xl text-white rounded-full disabled:opacity-[0.2] text-center poppins-semibold custom-smooth-drop-shadow primary-gradient-bg">
                        Create
                    </button>

                </div>


                <Heading
                    text={`Problems`}
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
                    {(tableRowsData && tableRowsData.length > 0) ? <>

                        <table className="w-full overflow-x-auto table-auto">
                            {/* Table Heading Fields - Starts Here */}
                            <thead className="text-lg lg:text-2xl poppins-semibold black-100-text">

                                <tr className="text-center border border-0 border-b-1 border-[#0a173266]">
                                    <th className="mb-4 py-4">
                                        Id
                                    </th>
                                    <th className="mb-4 py-4">
                                        Name
                                    </th>
                                    <th className="mb-4 py-4">
                                        Difficulty
                                    </th>
                                    <th className="mb-4 py-4">
                                        Created By
                                    </th>
                                    <th className="mb-4 py-4">
                                        Status
                                    </th>
                                    <th className="mb-4 py-4">
                                        Tags
                                    </th>
                                </tr>

                            </thead>
                            {/* Table Heading Fields - Ends Here */}


                            {/* Table Body Data - Starts Here */}
                            <tbody>

                                {tableRowsData.map((tableRow, index) => {

                                    return <tr className="text-center border border-0 border-b-1 border-[#0a17321a]" key={`table-heading-${index}`}>
                                        <td className="mb-4 py-4">
                                            {tableRow._id}
                                        </td>

                                        <td className="mb-4 py-4 text-blue-400 text-underline">
                                            <Link className="cursor-pointer underline primary-color-text" to={`/admins/control-panel/problems/${tableRow.slug}`}>
                                                {tableRow.name}
                                            </Link>
                                        </td>

                                        <td className="mb-4 py-4">
                                            <span className={`px-4 py-1 border rounded-full ${tableRow.difficulty === "easy" ? "text-green-400" : (tableRow.difficulty === "medium" ? "text-yellow-400" : "text-red-400")} text-sm poppins-semibold`}>

                                                {(tableRow.difficulty).toUpperCase()}
                                            </span>
                                        </td>

                                        <td className="mb-4 py-4">
                                            {tableRow.created_by}
                                        </td>

                                        <td className={`mb-4 py-4 ${tableRow.is_public === true ? "text-violet-400" : "text-blue-400"}`}>
                                            {tableRow.is_public === true ? "Public" : "Private"}
                                        </td>

                                        <td className={`mb-4 py-4 flex flex-row items-center justify-center`}>
                                            <div className="w-40 flex flex-row flex-wrap gap-2">

                                                {tableRow?.tags?.map((tag, index) => {
                                                    return <div
                                                        key={`${tableRow.slug}-tag-${index}`}
                                                        className="px-4 py-1 border border-2 border-[#0a173266] text-[#0a1732] rounded-full text-xs poppins-regular">
                                                        {tag}
                                                    </div>
                                                })}
                                            </div>
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
                            No Problems to Solve....
                        </div>
                    </>}
                </div>
            </div>
            {/* Problems' List Section - Ends Here */}


            {/* Control Panel's Details Section - Ends Here */}
        </ControlPanelLayout>
    </>
};

export default ControlPanelProblemsList;