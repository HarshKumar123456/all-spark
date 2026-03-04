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

const ControlPanelUsersList = () => {

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
            _id: "697058df5d836f6d1b37e6e7",
            name: "Harsh Kumar",
            role: "ADMIN",
            user_name: "harshku007",
            activation_status: "active",
            email: "harshkumar92200@gmail.com",
            password: "007",
            mobile_no: "7275589766",
            tried_problems: [],
            participated_in_contests: [],
            createdAt: "2026-01-21T04:41:03.589Z",
            updatedAt: "2026-01-21T04:41:03.589Z"
        },
        {
            _id: "697058df5d836f6d1b37e6e5",
            name: "Harsh Kumar",
            role: "ADMIN",
            user_name: "harshku1",
            activation_status: "active",
            email: "harshku1@gmail.com",
            password: "password",
            mobile_no: "7275589766",
            tried_problems: [],
            participated_in_contests: [],
            createdAt: "2026-01-21T04:42:04.589Z",
            updatedAt: "2026-01-21T04:42:04.589Z"
        },
        {
            _id: "697058df5d836f6d1b37e6e5",
            name: "Harsh Kumar",
            role: "SUPPORT",
            user_name: "harshku1",
            activation_status: "deactive",
            email: "harshku1@gmail.com",
            password: "password",
            mobile_no: "7275589766",
            tried_problems: [],
            participated_in_contests: [],
            createdAt: "2026-01-21T04:42:04.589Z",
            updatedAt: "2026-01-21T04:42:04.589Z"
        },
        {
            _id: "697058df5d836f6d1b37e6e5",
            name: "Harsh Kumar",
            role: "CONTEST_SCHEDULER",
            user_name: "harshku1",
            activation_status: "suspended",
            email: "harshku1@gmail.com",
            password: "password",
            mobile_no: "7275589766",
            tried_problems: [],
            participated_in_contests: [],
            createdAt: "2026-01-21T04:42:04.589Z",
            updatedAt: "2026-01-21T04:42:04.589Z"
        },

        {
            _id: "697058df5d836f6d1b37e6e5",
            name: "Harsh Kumar",
            role: "USER",
            user_name: "harshku1",
            activation_status: "suspended",
            email: "harshku1@gmail.com",
            password: "password",
            mobile_no: "7275589766",
            tried_problems: [],
            participated_in_contests: [],
            createdAt: "2026-01-21T04:42:04.589Z",
            updatedAt: "2026-01-21T04:42:04.589Z"
        },

    ]);


    const [loadingUsers, setLoadingUsers] = useState(false);

    const [filterValue, setFilterValue] = useState({
        email: "",
        password: "",
        mobile_no: "",
    });

    const handleClickOnCreateUserButton = async () => {
        console.log("Inside handleClickOnCreateUserButton()....");
        navigate("/admins/control-panel/users/create");

    };


    const handleClickOnSearchEnterButton = async (searchText) => {
        try {


            if (loadingUsers) {
                console.log("Please Wait! Already Loading Users....");
                toast.loading("Please Wait! Already Loading Users....");
                return;
            }

            toast.loading("Loading Users....");
            console.log("Search Text is....");
            console.log(searchText);
            console.log("Filter is....");
            console.log(filterValue);
            setLoadingUsers(true);

            const payload = {
                name: searchText,
                user_name: searchText,
                email: filterValue.email,
                password: filterValue.password,
                mobile_no: filterValue.mobile_no,
            };


            // console.log("Payload to search users....");
            // console.log(payload);



            const response = await axios.post(`${API_BASE}/users/search`, payload, {
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
            setLoadingUsers(false);


            console.log(error);
            console.log("Something Went Wrong While Making the USERS' API Call....", error);
            toast.error("Something went Wrong....");
        }
    };




    // If the WebSocket Connection Changes then Please Fetch All the Users Again
    useEffect(() => {
        const fetchAllUsers = async () => {
            const payload = {};
            try {
                const response = await axios.post(`${API_BASE}/users/search`, payload, {
                    headers: {
                        "Content-Type": "application/json",
                        "client-id": clientId,
                        "authorization": token,
                    }
                })

                toast.success(response.data.message);


            } catch (error) {
                console.log(error);
                console.log("Something Went Wrong While Making the USERS' API Call....", error);
                toast.error("Something went Wrong....");
            }
        };

        if (clientId) {
            fetchAllUsers();
        }

    }, [token, user, isConnected, clientId]);




    // Websocket Event Listening Logic - Starts Here
    // Listener 1: Handle Valid Get All Users i.e. Search Without Filter Response
    useSocketListener(
        // Selector: "Is this message for me?"
        (msg) => msg.type?.includes('response') && msg.metadata.operation?.includes("users.control.search"),

        // Handler: "What do I do with it?"
        async (msg) => {
            // Clear the Previous Toast Notifications
            toast.dismiss();

            const { data, metadata } = msg;

            // If Get All Users i.e. Search Without Filter is Success then Save The Users For further Accesses 
            if (metadata?.success === true) {
                console.log(data);
                console.log(metadata);

                // Setting All Users from Event Data
                const allUsersFromEventData = data.result;

                setTableRowsData(() => {
                    const newTableRowsData = allUsersFromEventData.map((user, index) => {
                        return {
                            ...user
                        };
                    });

                    return newTableRowsData;
                });

                setLoadingUsers(false);


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

    // Listener 2: Handle Valid Search Users with Filter Made By User Response 
    useSocketListener(
        // Selector: "Is this message for me?"
        (msg) => msg.type?.includes('response') && msg.metadata.operation?.includes("users.control.search"),

        // Handler: "What do I do with it?"
        async (msg) => {
            // Clear the Previous Toast Notifications
            toast.dismiss();

            const { data, metadata } = msg;

            // If Get All Users i.e. Search Without Filter is Success then Save The Users For further Accesses 
            if (metadata?.success === true) {
                console.log(data);
                console.log(metadata);

                // Setting All Users from Event Data
                const allUsersFromEventData = data.result;

                setTableRowsData(() => {
                    const newTableRowsData = allUsersFromEventData.map((user, index) => {
                        return {
                            ...user
                        };
                    });

                    return newTableRowsData;
                });

                setLoadingUsers(false);


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
            activeMenuOptionId={'users'}
        >

            {/* Control Panel's Details Section - Starts Here */}
            {/* Users' List Section - Starts Here */}
            <div className="flex flex-col items-center px-2 lg:px-4">

                <div className="w-full border border-0 border-b-2 border-[#0a17320d] pb-2 lg:pb-4 mb-4 lg:mb-8">

                    <button
                        onClick={handleClickOnCreateUserButton}
                        className="transition-all duration-[0.4s] ease-in-out hover:scale-[1.02] active:scale-[0.8] cursor-pointer py-2 lg:py-4 px-8 lg:px-16 text-lg lg:text-2xl text-white rounded-full disabled:opacity-[0.2] text-center poppins-semibold custom-smooth-drop-shadow primary-gradient-bg">
                        Create
                    </button>

                </div>


                <Heading
                    text={`Users`}
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

                        <table className="text-nowrap w-full overflow-x-auto table-auto">
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
                                        Role
                                    </th>
                                    <th className="mb-4 py-4">
                                        Username
                                    </th>
                                    <th className="mb-4 py-4">
                                        Activation Status
                                    </th>
                                    <th className="mb-4 py-4">
                                        Email
                                    </th>
                                    <th className="mb-4 py-4">
                                        Mobile No
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
                                            <Link className="cursor-pointer underline primary-color-text" to={`/admins/control-panel/users/${tableRow._id}`}>
                                                {tableRow.name}
                                            </Link>
                                        </td>

                                        <td className="mb-4 py-4">
                                            <span className={`px-4 py-1 border rounded-full ${tableRow.role === "ADMIN" ? "text-red-400" : (tableRow.role === "CONTEST_SCHEDULER" ? "text-green-400" : (tableRow.role === "SUPPORT" ? "text-violet-400" : "text-blue-400"))} text-sm poppins-semibold`}>

                                                {(tableRow.role).toUpperCase()}
                                            </span>
                                        </td>

                                        <td className="mb-4 py-4">
                                            {tableRow.user_name}
                                        </td>

                                        <td className={`mb-4 py-4 ${tableRow.activation_status === "active" ? "text-green-400" : "text-red-400"}`}>
                                            {tableRow.activation_status}
                                        </td>

                                        <td className="mb-4 py-4">
                                            {tableRow.email}
                                        </td>

                                        <td className="mb-4 py-4">
                                            {tableRow.mobile_no}
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
                            No Users....
                        </div>
                    </>}
                </div>
            </div>
            {/* Users' List Section - Ends Here */}


            {/* Control Panel's Details Section - Ends Here */}
        </ControlPanelLayout>
    </>
};

export default ControlPanelUsersList;