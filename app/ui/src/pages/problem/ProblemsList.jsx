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





    // If the WebSocket Connection Changes then Please Fetch All the Problems Again
    useEffect(() => {
        const fetchAllProblems = async () => {
            try {
                const response = await axios.get(`${API_BASE}/problems/all`, {
                    headers: {
                        "client-id": clientId
                    }
                })

                // console.log("Response From the AUTH API Call: ");
                // console.log(res);
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
    // Listener 1: Handle Valid Signup Response
    useSocketListener(
        // Selector: "Is this message for me?"
        (msg) => msg.type?.includes('response') && msg.metadata.operation?.includes("problems.getAllProblems"),

        // Handler: "What do I do with it?"
        async (msg) => {
            const { data, metadata } = msg;

            // If Signup is Success then Save The Token For further Accesses 
            if (metadata?.success === true) {
                // alert("Signed up Successfully....");
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

                <SearchControls
                />

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
                                            <span className={`px-4 py-1 border rounded-full ${tableRow.difficulty == "easy" ? "text-green-400" : (tableRow.difficulty === "medium" ? "text-yellow-400" : "text-red-400")} text-sm poppins-semibold`}>

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