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
import PasswordInput from "../../../components/input/PasswordInput";


const ControlPanelUserCreate = () => {

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


    const [userDetails, setUserDetails] = useState({
        name: "",
        user_name: "",
        email: "",
        password: "",
        mobile_no: "",
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



    const handleClickOnCreateUserButton = async () => {
        console.log("Inside handleClickOnCreateUserButton()....");

        const payload = {
            ...userDetails,
        };

        try {

            console.log("Payload For the API Call: ");
            console.log(payload);

            const response = await axios.post(`${API_BASE}/users/create`, payload, {
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


    // Websocket Event Listening Logic - Starts Here

    // Listener 1: Handle Valid Create User's Details Response
    useSocketListener(
        // Selector: "Is this message for me?"
        (msg) => msg.type?.includes('response') && msg.metadata.operation?.includes("users.control.create"),

        // Handler: "What do I do with it?"
        async (msg) => {
            // Clear the Previous Toast Notifications
            toast.dismiss();

            const { data, metadata } = msg;

            // If Create User's Details is Success then Navigate to User's Details Page
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
                navigate(`/admins/control-panel/users/${userDetailsFromEventData._id}`);


            }
            // Else Request Processing is not done then Tell User What May Went Wrong
            else {
                console.log(data);
                console.log(metadata);

                toast.error(metadata.message);
                await sleep(1000);
                toast.error("Seems Like Username or email Exists Already....");
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
                    text={`Create User`}
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
                                    placeholderText={`Enter User's Name Like: Harsh Kumar,....`}
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
                                    placeholderText={`Enter User's Name Like: harshku007,....`}
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
                                    password :
                                </h3>
                                <PasswordInput
                                    id={`password`}
                                    value={userDetails.password}
                                    onValueChange={handleChangeInUserDetails}
                                    placeholderText={`Enter User's Password Like: 2$i7GVwiubvWYC7....`}
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

                            {/* Create User Button - Starts Here */}
                            <button
                                onClick={handleClickOnCreateUserButton}
                                className="transition-all duration-[0.4s] ease-in-out hover:scale-[1.02] active:scale-[0.8] cursor-pointer py-3 lg:py-4 px-2 lg:px-4 text-lg lg:text-2xl text-white rounded-full disabled:opacity-[0.2] text-center poppins-semibold custom-smooth-drop-shadow primary-gradient-bg">
                                Create

                            </button>
                            {/* Create User Button - Ends Here */}


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

export default ControlPanelUserCreate;