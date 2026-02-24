import React, { useEffect, useState } from "react";
import Layout from "../../components/layout/Layout";
import { Link } from "react-router-dom";
import Heading from "../../components/heading/Heading";
import SearchControls from "../../components/controls/SearchControls";
import linkIcon from "../../assets/icons/link-icon.png";
import { useAuthContext } from "../../contexts/AuthContext";
import { useWebSocketContext } from "../../contexts/WebSocketContext";
import { useSocketListener } from "../../hooks/useSocketListener";
import { toast } from "sonner";
import axios from "axios";
import TagsInput from "../../components/input/TagsInput";
import SingleSelectInput from "../../components/input/SingleSelectInput";

const ProblemsList = () => {

    const sleep = async (milliSeconds) => {
        return new Promise((resolve) => setTimeout(resolve, milliSeconds));
    };

    const { token, user } = useAuthContext();

    const [tableHeadings, setTableHeadings] = useState([
        "S.No.",
        "Name",
        "Difficulty",
        "URL",
    ]);


    const [tableRowsData, setTableRowsData] = useState([
        // {
        //     id: 1,
        //     name: "Calculate Factorial",
        //     difficulty: "easy",
        //     slug: "calculate-factorial",
        // },

        // {
        //     id: 2,
        //     name: "Calculate Area",
        //     difficulty: "medium",
        //     slug: "calculate-area",
        // },

        // {
        //     id: 3,
        //     name: "Calculate Volume",
        //     difficulty: "hard",
        //     slug: "calculate-volume",
        // },
    ]);


    const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000/api/v1";

    const { isConnected, clientId } = useWebSocketContext();

    const [loadingProblems, setLoadingProblems] = useState(false);

    const [filterValue, setFilterValue] = useState({
        tags: [],
        difficulty: "",
    });

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
            try {
                const response = await axios.get(`${API_BASE}/problems/all`, {
                    headers: {
                        "client-id": clientId
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
    // Listener 1: Handle Valid Get All Problems Response
    useSocketListener(
        // Selector: "Is this message for me?"
        (msg) => msg.type?.includes('response') && msg.metadata.operation?.includes("problems.getAllProblems"),

        // Handler: "What do I do with it?"
        async (msg) => {
            // Clear the Previous Toast Notifications
            toast.dismiss();

            const { data, metadata } = msg;

            // If Get All Problems is Success then Save The Problems For further Accesses 
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
        (msg) => msg.type?.includes('response') && msg.metadata.operation?.includes("problems.search"),

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


    // Websocket Event Listening Logic - Ends Here




    return <>
        <Layout>

            {/* Problems' List Section - Starts Here */}
            <div className="mt-8 flex flex-col items-center px-8 lg:px-16 py-16 lg:py-8">
                <Heading
                    text={`Problems`}
                />


                {/* Search Controls - Starts Here */}
                <div
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

                </div>

                {/* Search Controls - Ends Here */}


                <div className="w-full flex flex-col items-center mt-8 px-8 lg:px-16 py-16 lg:py-8">
                    {(tableRowsData && tableRowsData.length > 0) ? <>

                        <table className="w-full table-auto">
                            {/* Table Heading Fields - Starts Here */}
                            <thead className="text-lg lg:text-2xl poppins-semibold black-100-text">

                                <tr className="text-center border border-0 border-b-1 border-[#0a173266]">
                                    <th className="mb-4 py-4">
                                        S.No.
                                    </th>
                                    <th className="mb-4 py-4">
                                        Name
                                    </th>
                                    <th className="mb-4 py-4">
                                        Difficulty
                                    </th>
                                    <th className="mb-4 py-4">
                                        URL
                                    </th>
                                </tr>

                            </thead>
                            {/* Table Heading Fields - Ends Here */}


                            {/* Table Body Data - Starts Here */}
                            <tbody>

                                {tableRowsData.map((tableRow, index) => {

                                    return <tr className="text-center border border-0 border-b-1 border-[#0a17321a]" key={`table-heading-${index}`}>
                                        <td className="mb-4 py-4">
                                            {tableRow.id}
                                        </td>
                                        <td className="mb-4 py-4">
                                            {tableRow.name}
                                        </td>
                                        <td className="mb-4 py-4">
                                            <span className={`px-4 py-1 border rounded-full ${tableRow.difficulty === "easy" ? "text-green-400" : (tableRow.difficulty === "medium" ? "text-yellow-400" : "text-red-400")} text-sm poppins-semibold`}>

                                                {(tableRow.difficulty).toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="mb-4 py-4">
                                            <Link className="cursor-pointer primary-color-text" to={`/problems/${tableRow.slug}`}>
                                                <img className="m-auto w-12 object-fit" src={linkIcon} alt="link icon" />
                                            </Link>
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

        </Layout>
    </>;
};


export default ProblemsList;