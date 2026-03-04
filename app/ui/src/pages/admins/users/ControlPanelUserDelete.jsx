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


const ControlPanelUserDelete = () => {

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
        password: "007",
        mobile_no: "7275589766",
        tried_problems: ["697058df5d836f6d1b37e6e7", "697058df5d836f6d1b37e6e7"],
        participated_in_contests: ["697058df5d836f6d1b37e6e7", "697058df5d836f6d1b37e6e7"],
        createdAt: "2026-01-21T04:41:03.589Z",
        updatedAt: "2026-01-21T04:41:03.589Z"
    }
    ); // null or Object


    const handleClickOnDeleteUserButton = async () => {
        console.log("Inside handleClickOnDeleteUserButton()....");

        if(prompt("You can Choose to deactivate the User Instead of Deleting. If you are sure to delete then please type 'delete' to confirm: ") !== "delete"){
            return ;

        }

        console.log("Confirmed User Deletion Making API Call....");
        

        const payload = {
            _id: userDetails._id,
        };

        try {

            console.log("Payload to the API call: ");
            console.log(payload);
            
            

            const response = await fetch(`${API_BASE}/users/delete`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "client-id": clientId,
                    "authorization": token,
                },
                body: JSON.stringify(payload),
            });

            // PLEASE NOTE: Using the "axios" package like this way below while making the "DELETE" method call was preventing to send the "headers" and  "body" thus used the "fetch" 
            // const response = await axios.delete(`${API_BASE}/users/delete/${userId}`, {
            //     headers: {
            //         "Content-Type": "application/json",
            //         "client-id": clientId,
            //         "authorization": token,
            //     }
            // })

            toast.success(response.data.message);


        } catch (error) {
            console.log(error);
            console.log("Something Went Wrong While Making the USERS' API Call....", error);
            toast.error("Something went Wrong....");
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

    // Listener 2: Handle Valid Delete User's Details Response
    useSocketListener(
        // Selector: "Is this message for me?"
        (msg) => msg.type?.includes('response') && msg.metadata.operation?.includes("users.control.delete"),

        // Handler: "What do I do with it?"
        async (msg) => {
            // Clear the Previous Toast Notifications
            toast.dismiss();

            const { data, metadata } = msg;

            // If Delete User's Details is Success then navigate to the List of Users Page
            if (metadata?.success === true) {
                console.log(data);
                console.log(metadata);

                // Show Toast Notification that Successfully Got User's Details
                toast.success(metadata.message);

                // Sleep for 1s to show Toast Notification
                await sleep(1000);

                // navigate to the Users' List page
                navigate(`/admins/control-panel/users/all`);


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
                    text={`Delete User`}
                />

                <div className="w-full overflow-x-auto mt-8 px-2 lg:px-4 py-16 lg:py-8">

                    {userDetails ? <>

                        <div className="text-nowrap flex flex-col gap-4">

                            <div className="mb-2 lg:mb-4 flex flex-row items-center justify-between">
                                <h2 className="text-xl lg:text-2xl poppins-semibold">
                                    {userDetails?.name}
                                </h2>

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
                                                    className="px-4 py-1 border border-2 border-[#0a173266] text-[#0a1732] rounded-full text-xs poppins-regular">
                                                    {triedProblem}
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

                            <br />
                            <br />


                            {/* Delete User Button - Starts Here */}
                            <button
                                onClick={handleClickOnDeleteUserButton}
                                className="transition-all duration-[0.4s] ease-in-out hover:scale-[1.02] active:scale-[0.8] bg-[#ff2929] cursor-pointer py-3 lg:py-4 px-2 lg:px-4 text-lg lg:text-2xl text-white rounded-full disabled:opacity-[0.2] text-center poppins-semibold custom-smooth-drop-shadow">
                                Delete

                            </button>
                            {/* Delete User Button - Ends Here */}


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

export default ControlPanelUserDelete;