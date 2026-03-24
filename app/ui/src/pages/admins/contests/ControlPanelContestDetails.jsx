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


const ControlPanelContestDetails = () => {

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

    const { slug } = useParams();

    const [contestDetails, setContestDetails] = useState({
        _id: "169889d99d55e626d8ec4493e",
        name: "Contest 1",
        slug: "contest-1",
        description: "This is Contest 1 Description transition-all duration-[0.4s] ease-in-out hover:scale-[1.02] border border-2 border-[#0a173233] hover:border-[#0a1732cc] px-4 lg:px-8 py-8 lg:pt-8 lg:pb-16 rounded-xl flex flex-col w-100 transition-all duration-[0.4s] ease-in-out hover:scale-[1.02] border border-2 border-[#0a173233] hover:border-[#0a1732cc] px-4 lg:px-8 py-8 lg:pt-8 lg:pb-16 rounded-xl flex flex-col w-100",
        created_by: "idOfCreatorLike71nv923hb32v2b",
        start_time: "2026-02-25T11:37:18.917Z",
        end_time: "2026-02-25T11:47:18.917Z",
        duration: 600000, // Milliseconds
        support_end_time: "2026-02-26T11:37:18.917Z",


        support_team: ["169889d99d55e626d8ec4493e", "169889d99d55e626d8ec4493e"],
        problems: ["169889d99d55e626d8ec4493e", "169889d99d55e626d8ec4493e"],

    }
    ); // null or Object




    const handleClickOnUpdateContestButton = async () => {
        console.log("Inside handleClickOnUpdateContestButton()....");
        if ((contestDetails.created_by === user._id) || true) {
            navigate(`/admins/control-panel/contests/update/${slug}`)
        }
        else {
            toast.error(`This cannot be updated by You as You Didn't Created it`);
        }

    };


    const handleClickOnDeleteContestButton = async () => {
        console.log("Inside handleClickOnDeleteContestButton()....");
        if ((contestDetails.created_by === user._id) || true) {
            navigate(`/admins/control-panel/contests/delete/${slug}`)
        }
        else {
            toast.error(`This cannot be deleted by You as You Didn't Created it`);
        }

    };




    // If the WebSocket Connection or "slug" Changes then Please Fetch the Contest's Details Again
    useEffect(() => {
        const fetchContestDetails = async () => {
            try {
                const response = await axios.get(`${API_BASE}/contests/control/${slug}`, {
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
            fetchContestDetails();
        }

    }, [token, user, slug, isConnected, clientId]);




    // Websocket Event Listening Logic - Starts Here

    // Listener 1: Handle Valid Get Contest's Details Response
    useSocketListener(
        // Selector: "Is this message for me?"
        (msg) => msg.type?.includes('response') && msg.metadata.operation?.includes("contests.control.getContest"),

        // Handler: "What do I do with it?"
        async (msg) => {
            // Clear the Previous Toast Notifications
            toast.dismiss();

            const { data, metadata } = msg;

            // If Get Contest's Details is Success then Save The Details For further Accesses 
            if (metadata?.success === true) {
                console.log(data);
                console.log(metadata);

                // Setting Contest's Details From Event Data
                const contestDetailsFromEventData = data.result;

                setContestDetails(contestDetailsFromEventData);

                // Show Toast Notification that Successfully Got Contest's Details
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
                toast.error("Seems Like Contest Doesn't Exists Now....");
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

            {/* Contest's Details Section - Starts Here */}
            <div className="mt-8 flex flex-col items-center px-2 lg:px-4">
                <Heading
                    text={`Contest's Details`}
                />

                <div className="w-full overflow-x-auto mt-8 px-2 lg:px-4 py-16 lg:py-8">

                    {contestDetails ? <>

                        <div className="text-nowrap flex flex-col gap-4">

                            <div className="mb-2 lg:mb-4 flex flex-row items-center justify-between">
                                <h2 className="text-xl lg:text-2xl poppins-semibold">
                                    {contestDetails?.name}
                                </h2>

                                {/* Contest's Action Buttons - Starts Here */}
                                <div className="w-2/3 lg:w-1/3 grid grid-cols-2 gap-4 lg:gap-8">
                                    {/* Update Contest Button - Starts Here */}
                                    <button
                                        onClick={handleClickOnUpdateContestButton}
                                        className="transition-all duration-[0.4s] ease-in-out hover:scale-[1.02] active:scale-[0.8] bg-[#135BEB] cursor-pointer py-3 lg:py-4 px-2 lg:px-4 text-lg lg:text-2xl text-white rounded-full disabled:opacity-[0.2] text-center poppins-semibold custom-smooth-drop-shadow">
                                        Update

                                    </button>
                                    {/* Update Contest Button - Ends Here */}

                                    {/* Delete Contest Button - Starts Here */}
                                    <button
                                        onClick={handleClickOnDeleteContestButton}
                                        className="transition-all duration-[0.4s] ease-in-out hover:scale-[1.02] active:scale-[0.8] bg-[#ff2929] cursor-pointer py-3 lg:py-4 px-2 lg:px-4 text-lg lg:text-2xl text-white rounded-full disabled:opacity-[0.2] text-center poppins-semibold custom-smooth-drop-shadow">
                                        Delete

                                    </button>
                                    {/* Delete Contest Button - Ends Here */}
                                </div>
                                {/* Contest's Action Buttons - Ends Here */}

                            </div>

                            <div className="flex flex-row gap-2">
                                <h3 className="text-lg lg:text-xl poppins-semibold">
                                    _id :
                                </h3>
                                <p className="text-lg lg:text-xl black-80-text poppins-regular">
                                    {contestDetails?._id}
                                </p>
                            </div>


                            <div className="flex flex-row gap-2">
                                <h3 className="text-lg lg:text-xl poppins-semibold">
                                    name :
                                </h3>
                                <p className="text-lg lg:text-xl black-80-text poppins-regular">
                                    {contestDetails?.name}
                                </p>
                            </div>


                            <div className="flex flex-row gap-2">
                                <h3 className="text-lg lg:text-xl poppins-semibold">
                                    slug :
                                </h3>
                                <p className="text-lg lg:text-xl black-80-text poppins-regular">
                                    {contestDetails?.slug}
                                </p>
                            </div>


                            <div className="flex flex-col gap-2">
                                <h3 className="text-lg lg:text-xl poppins-semibold">
                                    description :
                                </h3>
                                <p className="whitespace-pre-line w-full text-wrap text-lg lg:text-xl black-80-text poppins-regular">
                                    {contestDetails?.description}
                                </p>
                            </div>


                            <div className="flex flex-row gap-2">
                                <h3 className="text-lg lg:text-xl poppins-semibold">
                                    created_by :
                                </h3>
                                <p className={`text-lg lg:text-xl black-80-text poppins-regular`}>
                                    {contestDetails?.created_by}
                                </p>
                            </div>

                            <div className="flex flex-row gap-2">
                                <h3 className="text-lg lg:text-xl poppins-semibold">
                                    start_time :
                                </h3>
                                <p className={`text-lg lg:text-xl black-80-text poppins-regular`}>
                                    {getLocalDateTimeStringFromISOString(contestDetails?.start_time)}
                                </p>
                            </div>

                            <div className="flex flex-row gap-2">
                                <h3 className="text-lg lg:text-xl poppins-semibold">
                                    end_time :
                                </h3>
                                <p className={`text-lg lg:text-xl black-80-text poppins-regular`}>
                                    {getLocalDateTimeStringFromISOString(contestDetails?.end_time)}
                                </p>
                            </div>

                            <div className="flex flex-row gap-2">
                                <h3 className="text-lg lg:text-xl poppins-semibold">
                                    support_end_time :
                                </h3>
                                <p className={`text-lg lg:text-xl black-80-text poppins-regular`}>
                                    {getLocalDateTimeStringFromISOString(contestDetails?.support_end_time)}
                                </p>
                            </div>


                            <div className="flex flex-row gap-2">
                                <h3 className="text-lg lg:text-xl poppins-semibold">
                                    createdAt :
                                </h3>
                                <p className={`text-lg lg:text-xl black-80-text poppins-regular`}>
                                    {getLocalDateTimeStringFromISOString(contestDetails?.createdAt)}
                                </p>
                            </div>

                            <div className="flex flex-row gap-2">
                                <h3 className="text-lg lg:text-xl poppins-semibold">
                                    updatedAt :
                                </h3>
                                <p className={`text-lg lg:text-xl black-80-text poppins-regular`}>
                                    {getLocalDateTimeStringFromISOString(contestDetails?.updatedAt)}
                                </p>
                            </div>


                            <ExpandCollapseControls>
                                <ExpandCollapseControls.ParentContent>
                                    <>
                                        <h3 className="text-lg lg:text-xl poppins-semibold">
                                            support_team :
                                        </h3>
                                    </>
                                </ExpandCollapseControls.ParentContent>
                                <ExpandCollapseControls.ChildContent>
                                    <>
                                        <div className="flex flex-row flex-wrap gap-4">
                                            {contestDetails?.support_team?.map((supportUser, index) => {
                                                    return <div
                                                        key={`${contestDetails.slug}-supportUser-${index}`}
                                                        className="px-4 py-1 border border-2 border-[#0a173266] text-[#0a1732] rounded-full text-xs poppins-regular">
                                                        {supportUser}
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
                                            problems :
                                        </h3>
                                    </>
                                </ExpandCollapseControls.ParentContent>
                                <ExpandCollapseControls.ChildContent>
                                    <>
                                        <div className="flex flex-row flex-wrap gap-4">
                                            {contestDetails?.problems?.map((problem, index) => {
                                                    return <div
                                                        key={`${contestDetails.slug}-problem-${index}`}
                                                        className="px-4 py-1 border border-2 border-[#0a173266] text-[#0a1732] rounded-full text-xs poppins-regular">
                                                        {problem}
                                                    </div>
                                                })}
                                        </div>
                                    </>
                                </ExpandCollapseControls.ChildContent>
                            </ExpandCollapseControls>



                        </div>

                    </> : <>
                        <h2 className="text-xl">Sorry! Seems like Something Went Wrong....</h2>
                    </>}

                </div>
            </div>
            {/* Contest's Details Section - Ends Here */}


            {/* Control Panel's Details Section - Ends Here */}
        </ControlPanelLayout>
    </>
};

export default ControlPanelContestDetails;