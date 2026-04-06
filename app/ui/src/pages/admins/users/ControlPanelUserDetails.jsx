import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Heading from "../../../components/heading/Heading";
import ControlPanelLayout from "../../../components/layout/ControlPanelLayout";
import { useAuthContext } from "../../../contexts/AuthContext";
import { useWebSocketContext } from "../../../contexts/WebSocketContext";
import axios from "axios";
import { toast } from "sonner";
import { useSocketListener } from "../../../hooks/useSocketListener";
import ExpandCollapseControls from "../../../components/controls/ExpandCollapseControls";


const ControlPanelUserDetails = () => {

    const sleep = async (milliSeconds) => {
        return new Promise((resolve) => setTimeout(resolve, milliSeconds));
    };

    const navigate = useNavigate();

    const getLocalDateTimeStringFromISOString = (ISOString) => {

        const ISOStringDate = new Date(ISOString);
        let localDateTimeString = ISOStringDate.toDateString() + " " + ISOStringDate.toLocaleTimeString();

        return localDateTimeString;

    };

    const { token, user } = useAuthContext();

    const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000/api/v1";

    const { isConnected, clientId } = useWebSocketContext();

    const { userId } = useParams();

    const [userDetails, setUserDetails] = useState({
        _id: "697058df5d836f6d1b37e6e7",
        name: "Harsh Kumar",
        role: "ADMIN",
        user_name: "harshku007",
        activation_status: "active",
        email: "harshkumar92200@gmail.com",
        password: "password",
        mobile_no: "7275589766",
        tried_problems: [
            {
                problem_id: "69808ce921ed087cf5a28f0c",
                status: "solved",
                submissions:
                    [
                        "698f179750d9fb4a87b2c728", "698f17b150d9fb4a87b2c72f", "698f185150d9fb4a87b2c743", "698f187150d9fb4a87b2c74a", "698f18e250d9fb4a87b2c75b", "698f190950d9fb4a87b2c762", "698f192750d9fb4a87b2c769", "698f193250d9fb4a87b2c77a", "698f195f50d9fb4a87b2c781", "698f198150d9fb4a87b2c788"
                    ],
            }
            ,
            {
                problem_id: "698c81fa2e5a28804e909bb2",
                status: "solved",
                submissions:
                    [
                        "698f1a2150d9fb4a87b2c79a", "698f1a2b50d9fb4a87b2c7a1", "698f2390e83a12770b8562f5", "698f2399e83a12770b8562fc", "698f23a5e83a12770b85630d", "698f23afe83a12770b856314", "698f2402e83a12770b856325", "698f2422e83a12770b85632c"
                    ],
            }
        ],
        participated_in_contests: ["697058df5d836f6d1b37e6e7", "697058df5d836f6d1b37e6e7"],
        createdAt: "2026-01-21T04:41:03.589Z",
        updatedAt: "2026-01-21T04:41:03.589Z"
    }
    ); // null or Object




    const handleClickOnUpdateUserButton = async () => {
        console.log("Inside handleClickOnUpdateUserButton()....");
        if (user.role === "ADMIN") {
            navigate(`/admins/control-panel/users/update/${userId}`);
        }
        else {
            toast.error("Sorry! Only ADMIN user can Update the User's Details....");
        }
    };


    const handleClickOnDeleteUserButton = async () => {
        console.log("Inside handleClickOnDeleteUserButton()....");
        if (user.role === "ADMIN") {
            navigate(`/admins/control-panel/users/delete/${userId}`);
        }
        else {
            toast.error("Sorry! Only ADMIN user can Delete the User's Details....");
        }
    };




    // If the WebSocket Connection or "userId" Changes then Please Fetch the User's Details Again
    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const response = await axios.get(`${API_BASE}/users/${userId}`, {
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
            fetchUserDetails();
        }

    }, [token, user, userId, isConnected, clientId]);




    // Websocket Event Listening Logic - Starts Here

    // Listener 1: Handle Valid Get User's Details Response
    useSocketListener(
        // Selector: "Is this message for me?"
        (msg) => msg.type?.includes('response') && msg.metadata.operation?.includes("users.getUser"),

        // Handler: "What do I do with it?"
        async (msg) => {
            // Clear the Previous Toast Notifications
            toast.dismiss();

            const { data, metadata } = msg;

            // If Get User's Details is Success then Save The User Details For further Accesses 
            if (metadata?.success === true) {
                console.log(data);
                console.log(metadata);

                // Setting User's Details From Event Data
                const userDetailsFromEventData = data.result;

                setUserDetails(userDetailsFromEventData);

                // Show Toast Notification that Successfully Got User's Details
                toast.success(metadata.message);

                // Sleep for 1s to show Toast Notification
                await sleep(1000);


            }
            // Else Request Processing is not done then Tell User What May Went Wrong
            else {
                console.log(data);
                console.log(metadata);

                toast.error(metadata.message);
                await sleep(1000);
                toast.error("Seems Like User Doesn't Exists Now....");
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

            {/* User's Details Section - Starts Here */}
            <div className="mt-8 flex flex-col items-center px-2 lg:px-4">
                <Heading
                    text={`User's Details`}
                />

                <div className="w-full overflow-x-auto mt-8 px-2 lg:px-4 py-16 lg:py-8">

                    {userDetails ? <>

                        <div className="text-nowrap flex flex-col gap-4">

                            <div className="mb-2 lg:mb-4 flex flex-row items-center justify-between">
                                <h2 className="text-xl lg:text-2xl poppins-semibold">
                                    {userDetails?.name}
                                </h2>

                                {/* User's Action Buttons - Starts Here */}
                                <div className="w-2/3 lg:w-1/3 grid grid-cols-2 gap-4 lg:gap-8">
                                    {/* Update User Button - Starts Here */}
                                    <button
                                        onClick={handleClickOnUpdateUserButton}
                                        className="transition-all duration-[0.4s] ease-in-out hover:scale-[1.02] active:scale-[0.8] bg-[#135BEB] cursor-pointer py-3 lg:py-4 px-2 lg:px-4 text-lg lg:text-2xl text-white rounded-full disabled:opacity-[0.2] text-center poppins-semibold custom-smooth-drop-shadow">
                                        Update

                                    </button>
                                    {/* Update User Button - Ends Here */}

                                    {/* Delete User Button - Starts Here */}
                                    <button
                                        onClick={handleClickOnDeleteUserButton}
                                        className="transition-all duration-[0.4s] ease-in-out hover:scale-[1.02] active:scale-[0.8] bg-[#ff2929] cursor-pointer py-3 lg:py-4 px-2 lg:px-4 text-lg lg:text-2xl text-white rounded-full disabled:opacity-[0.2] text-center poppins-semibold custom-smooth-drop-shadow">
                                        Delete

                                    </button>
                                    {/* Delete User Button - Ends Here */}
                                </div>
                                {/* User's Action Buttons - Ends Here */}

                            </div>

                            <div className="flex flex-row gap-2">
                                <h3 className="text-lg lg:text-xl poppins-semibold">
                                    _id :
                                </h3>
                                <p className="text-lg lg:text-xl black-80-text poppins-regular">
                                    {userDetails?._id}
                                </p>
                            </div>


                            <div className="flex flex-row gap-2">
                                <h3 className="text-lg lg:text-xl poppins-semibold">
                                    name :
                                </h3>
                                <p className="text-lg lg:text-xl black-80-text poppins-regular">
                                    {userDetails?.name}
                                </p>
                            </div>


                            <div className="flex flex-row gap-2">
                                <h3 className="text-lg lg:text-xl poppins-semibold">
                                    user_name :
                                </h3>
                                <p className="text-lg lg:text-xl black-80-text poppins-regular">
                                    {userDetails?.user_name}
                                </p>
                            </div>

                            <div className="flex flex-row gap-2">
                                <h3 className="text-lg lg:text-xl poppins-semibold">
                                    role :
                                </h3>
                                <p className="text-lg lg:text-xl black-80-text poppins-regular">
                                    <span className={`px-4 py-1 border rounded-full ${userDetails.role === "ADMIN" ? "text-red-400" : (userDetails.role === "CONTEST_SCHEDULER" ? "text-green-400" : (userDetails.role === "SUPPORT" ? "text-violet-400" : "text-blue-400"))} text-sm poppins-semibold`}>

                                        {(userDetails.role).toUpperCase()}
                                    </span>
                                </p>
                            </div>

                            <div className="flex flex-row gap-2">
                                <h3 className="text-lg lg:text-xl poppins-semibold">
                                    activation_status :
                                </h3>
                                <p className={`${userDetails.activation_status === "active" ? "text-green-400" : "text-red-400"}`}>
                                    {userDetails.activation_status}
                                </p>
                            </div>

                            <div className="flex flex-row gap-2">
                                <h3 className="text-lg lg:text-xl poppins-semibold">
                                    email :
                                </h3>
                                <p className="text-lg lg:text-xl black-80-text poppins-regular">
                                    {userDetails?.email}
                                </p>
                            </div>

                            <div className="flex flex-row gap-2">
                                <h3 className="text-lg lg:text-xl poppins-semibold">
                                    mobile_no :
                                </h3>
                                <p className="text-lg lg:text-xl black-80-text poppins-regular">
                                    {userDetails?.mobile_no}
                                </p>
                            </div>

                            <ExpandCollapseControls>
                                <ExpandCollapseControls.ParentContent>
                                    <>
                                        <h3 className="text-lg lg:text-xl poppins-semibold">
                                            password :
                                        </h3>
                                    </>
                                </ExpandCollapseControls.ParentContent>
                                <ExpandCollapseControls.ChildContent>
                                    <>
                                        <p className="text-lg lg:text-xl black-80-text poppins-regular">
                                            {userDetails?.password}
                                        </p>
                                    </>
                                </ExpandCollapseControls.ChildContent>
                            </ExpandCollapseControls>



                            <ExpandCollapseControls>
                                <ExpandCollapseControls.ParentContent>
                                    <>
                                        <h3 className="text-lg lg:text-xl poppins-semibold">
                                            tried_problems :
                                        </h3>
                                    </>
                                </ExpandCollapseControls.ParentContent>
                                <ExpandCollapseControls.ChildContent>
                                    <>
                                        <div className="flex flex-row flex-wrap gap-2">
                                            {userDetails?.tried_problems?.map((triedProblem, index) => {
                                                return <div
                                                    key={`${userDetails?.user_name}-triedProblem-${index}`}
                                                    className={`px-4 py-1 border border-2 border-[#0a173266] text-[#0a1732] rounded-full text-xs poppins-regular ${triedProblem?.status === "solved" ? "bg-green-400" : ""}`}>
                                                    {triedProblem?.problem_id}
                                                </div>
                                            })}
                                        </div>
                                    </>
                                </ExpandCollapseControls.ChildContent>
                            </ExpandCollapseControls>


                            <ExpandCollapseControls>
                                <ExpandCollapseControls.ParentContent>
                                    <>
                                        <h3 className="text-lg lg:text-xl poppins-semibold">
                                            participated_in_contests :
                                        </h3>
                                    </>
                                </ExpandCollapseControls.ParentContent>
                                <ExpandCollapseControls.ChildContent>
                                    <>
                                        <div className="flex flex-row flex-wrap gap-2">
                                            {userDetails?.participated_in_contests?.map((participatedInContest, index) => {
                                                return <div
                                                    key={`${userDetails?.user_name}-participatedInContest-${index}`}
                                                    className="px-4 py-1 border border-2 border-[#0a173266] text-[#0a1732] rounded-full text-xs poppins-regular">
                                                    {participatedInContest}
                                                </div>
                                            })}
                                        </div>
                                    </>
                                </ExpandCollapseControls.ChildContent>
                            </ExpandCollapseControls>

                            <div className="flex flex-row gap-2">
                                <h3 className="text-lg lg:text-xl poppins-semibold">
                                    createdAt :
                                </h3>
                                <p className={`text-lg lg:text-xl black-80-text poppins-regular`}>
                                    {getLocalDateTimeStringFromISOString(userDetails?.createdAt)}
                                </p>
                            </div>

                            <div className="flex flex-row gap-2">
                                <h3 className="text-lg lg:text-xl poppins-semibold">
                                    updatedAt :
                                </h3>
                                <p className={`text-lg lg:text-xl black-80-text poppins-regular`}>
                                    {getLocalDateTimeStringFromISOString(userDetails?.updatedAt)}
                                </p>
                            </div>

                        </div>

                    </> : <>
                        <h2 className="text-xl">Sorry! Seems like Something Went Wrong....</h2>
                    </>}

                </div>
            </div>
            {/* User's Details Section - Ends Here */}


            {/* Control Panel's Details Section - Ends Here */}
        </ControlPanelLayout>
    </>
};

export default ControlPanelUserDetails;