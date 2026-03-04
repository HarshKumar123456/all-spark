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
import TextInput from "../../../components/input/TextInput";
import SingleSelectInput from "../../../components/input/SingleSelectInput";
import EmailInput from "../../../components/input/EmailInput";
import MobileNumberInput from "../../../components/input/MobileNumberInput";


const ControlPanelUserUpdate = () => {

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


    const handleChangeInUserDetails = async (e) => {

        const idOfChangingUserDetailsField = e.target.id;

        setUserDetails((prev) => {
            let valueToChange = e.target.value;

            if (idOfChangingUserDetailsField === "email") {
                valueToChange = valueToChange.toLowerCase();
            }

            return {
                ...prev,
                [`${idOfChangingUserDetailsField}`]: valueToChange,
            };
        });

    };



    const handleClickOnUpdateUserButton = async () => {
        console.log("Inside handleClickOnUpdateUserButton()....");

        const payload = {
            ...userDetails,
        };

        try {

            console.log("Payload For the API Call: ");
            console.log(payload);

            const response = await axios.put(`${API_BASE}/users/update`, payload, {
                headers: {
                    "Content-Type": "application/json",
                    "client-id": clientId,
                    "authorization": token,
                }
            })

            // console.log("Response From the USERS' API Call: ");
            // console.log(response);
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

    // Listener 2: Handle Valid Update User's Details Response
    useSocketListener(
        // Selector: "Is this message for me?"
        (msg) => msg.type?.includes('response') && msg.metadata.operation?.includes("users.control.update"),

        // Handler: "What do I do with it?"
        async (msg) => {
            // Clear the Previous Toast Notifications
            toast.dismiss();

            const { data, metadata } = msg;

            // If Update User's Details is Success then Navigate to User's Details Page
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


                // Navigate to User's Details Page
                navigate(`/admins/control-panel/users/${userDetails._id}`);


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
                    text={`Update User`}
                />

                <div className="w-full overflow-x-auto mt-8 px-2 lg:px-4 py-16 lg:py-8">

                    {userDetails ? <>

                        <div className="text-nowrap flex flex-col gap-4">

                            <div className="flex flex-row gap-2">
                                <h3 className="text-lg lg:text-xl poppins-semibold">
                                    name :
                                </h3>
                                <TextInput
                                    id={`name`}
                                    value={userDetails.name}
                                    onValueChange={handleChangeInUserDetails}
                                    placeholderText={`Put User's Name Like: Harsh Kumar,....`}
                                />
                            </div>


                            <div className="flex flex-row gap-2">
                                <h3 className="text-lg lg:text-xl poppins-semibold">
                                    user_name :
                                </h3>
                                <TextInput
                                    id={`user_name`}
                                    value={userDetails.user_name}
                                    onValueChange={handleChangeInUserDetails}
                                    placeholderText={`Put User's Name Like: harshku007,....`}
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <h3 className="text-lg lg:text-xl poppins-semibold">
                                    role :
                                </h3>
                                <SingleSelectInput
                                    id={`role`}
                                    value={userDetails.role}
                                    onValueChange={handleChangeInUserDetails}
                                    placeholderText={`Select User's Role`}
                                    options={[
                                        {
                                            label: "SUPPORT", value: "SUPPORT"
                                        },
                                        {
                                            label: "CONTEST_SCHEDULER", value: "CONTEST_SCHEDULER"
                                        },
                                        {
                                            label: "ADMIN", value: "ADMIN"
                                        },
                                    ]}
                                    optionsHeading={` `}

                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <h3 className="text-lg lg:text-xl poppins-semibold">
                                    activation_status :
                                </h3>
                                <SingleSelectInput
                                    id={`activation_status`}
                                    value={userDetails.activation_status}
                                    onValueChange={handleChangeInUserDetails}
                                    placeholderText={`Select User's Activation Status`}
                                    options={[
                                        {
                                            label: "active", value: "active"
                                        },
                                        {
                                            label: "suspended", value: "suspended"
                                        },
                                        {
                                            label: "deactive", value: "deactive"
                                        },
                                    ]}
                                    optionsHeading={` `}
                                />
                            </div>

                            <div className="flex flex-row gap-2">
                                <h3 className="text-lg lg:text-xl poppins-semibold">
                                    email :
                                </h3>
                                <EmailInput
                                    id={`email`}
                                    value={userDetails.email}
                                    onValueChange={handleChangeInUserDetails}
                                    placeholderText={`Enter User's Email Like: harshkumar92200@gmail.com,....`}
                                />

                            </div>

                            <div className="flex flex-row gap-2">
                                <h3 className="text-lg lg:text-xl poppins-semibold">
                                    mobile_no :
                                </h3>
                                <MobileNumberInput
                                    id={`mobile_no`}
                                    value={userDetails.mobile_no}
                                    onValueChange={handleChangeInUserDetails}
                                    placeholderText={`Enter User's Mobile No Like: 7275589766,....`}
                                />

                            </div>


                            <br />
                            <br />

                            {/* Update User Button - Starts Here */}
                            <button
                                onClick={handleClickOnUpdateUserButton}
                                className="transition-all duration-[0.4s] ease-in-out hover:scale-[1.02] active:scale-[0.8] bg-[#135BEB] cursor-pointer py-3 lg:py-4 px-2 lg:px-4 text-lg lg:text-2xl text-white rounded-full disabled:opacity-[0.2] text-center poppins-semibold custom-smooth-drop-shadow">
                                Update

                            </button>
                            {/* Update User Button - Ends Here */}


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

export default ControlPanelUserUpdate;