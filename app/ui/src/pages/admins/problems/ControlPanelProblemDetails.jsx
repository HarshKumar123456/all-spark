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


const ControlPanelProblemDetails = () => {

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

    const [problemDetails, setProblemDetails] = useState({
        _id: "69776729fb3546d61ad44ed8",
        name: "Problem 1",
        slug: "problem-1",
        tags: ["easy", "problem-1", "problem 1", "mauj"],
        description: "Ye to Pahli Problem hai Bhai",
        difficulty: "hard",
        is_public: false,
        created_by: "697058df5d836f6d1b37e6e5",
        test_cases: [],
        createdAt: "2026-01-26T13:07:53.529Z",
        updatedAt: "2026-01-26T13:07:53.529Z"
    }
    ); // null or Object




    const handleClickOnUpdateProblemButton = async () => {
        console.log("Inside handleClickOnUpdateProblemButton()....");
        if(problemDetails.created_by === user._id) {
            navigate(`/admins/control-panel/problems/update/${slug}`)
        }
        else{
            toast.error(`This cannot be updated by You as You Didn't Created it`);
        }
        
    };
    

    const handleClickOnDeleteProblemButton = async () => {
        console.log("Inside handleClickOnDeleteProblemButton()....");
        if(problemDetails.created_by === user._id) {
            navigate(`/admins/control-panel/problems/delete/${slug}`)
        }
        else{
            toast.error(`This cannot be deleted by You as You Didn't Created it`);
        }

    };




    // If the WebSocket Connection or "slug" Changes then Please Fetch the Problem's Details Again
    useEffect(() => {
        const fetchProblemDetails = async () => {
            try {
                const response = await axios.get(`${API_BASE}/problems/control/${slug}`, {
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
            fetchProblemDetails();
        }

    }, [token, user, slug, isConnected, clientId]);




    // Websocket Event Listening Logic - Starts Here

    // Listener 1: Handle Valid Get Problem's Details Response
    useSocketListener(
        // Selector: "Is this message for me?"
        (msg) => msg.type?.includes('response') && msg.metadata.operation?.includes("problems.control.getProblem"),

        // Handler: "What do I do with it?"
        async (msg) => {
            // Clear the Previous Toast Notifications
            toast.dismiss();

            const { data, metadata } = msg;

            // If Get Problem's Details is Success then Save The Problems For further Accesses 
            if (metadata?.success === true) {
                console.log(data);
                console.log(metadata);

                // Setting Problem's Details From Event Data
                const problemDetailsFromEventData = data.result;

                setProblemDetails(problemDetailsFromEventData);

                // Show Toast Notification that Successfully Got Problem's Details
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
                toast.error("Seems Like Problem Doesn't Exists Now....");
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
            
            {/* Problem's Details Section - Starts Here */}
            <div className="mt-8 flex flex-col items-center px-2 lg:px-4">
                <Heading
                    text={`Problem's Details`}
                />

                <div className="w-full overflow-x-auto mt-8 px-2 lg:px-4 py-16 lg:py-8">

                    {problemDetails ? <>

                        <div className="text-nowrap flex flex-col gap-4">

                            <div className="mb-2 lg:mb-4 flex flex-row items-center justify-between">
                                <h2 className="text-xl lg:text-2xl poppins-semibold">
                                    {problemDetails?.name}
                                </h2>

                                {/* Problem's Action Buttons - Starts Here */}
                                <div className="w-2/3 lg:w-1/3 grid grid-cols-2 gap-4 lg:gap-8">
                                    {/* Update Problem Button - Starts Here */}
                                    <button
                                        onClick={handleClickOnUpdateProblemButton}
                                        className="transition-all duration-[0.4s] ease-in-out hover:scale-[1.02] active:scale-[0.8] bg-[#135BEB] cursor-pointer py-3 lg:py-4 px-2 lg:px-4 text-lg lg:text-2xl text-white rounded-full disabled:opacity-[0.2] text-center poppins-semibold custom-smooth-drop-shadow">
                                        Update

                                    </button>
                                    {/* Update Problem Button - Ends Here */}

                                    {/* Delete Problem Button - Starts Here */}
                                    <button
                                        onClick={handleClickOnDeleteProblemButton}
                                        className="transition-all duration-[0.4s] ease-in-out hover:scale-[1.02] active:scale-[0.8] bg-[#ff2929] cursor-pointer py-3 lg:py-4 px-2 lg:px-4 text-lg lg:text-2xl text-white rounded-full disabled:opacity-[0.2] text-center poppins-semibold custom-smooth-drop-shadow">
                                        Delete

                                    </button>
                                    {/* Delete Problem Button - Ends Here */}
                                </div>
                                {/* Problem's Action Buttons - Ends Here */}

                            </div>

                            <div className="flex flex-row gap-2">
                                <h3 className="text-lg lg:text-xl poppins-semibold">
                                    _id :
                                </h3>
                                <p className="text-lg lg:text-xl black-80-text poppins-regular">
                                    {problemDetails?._id}
                                </p>
                            </div>


                            <div className="flex flex-row gap-2">
                                <h3 className="text-lg lg:text-xl poppins-semibold">
                                    name :
                                </h3>
                                <p className="text-lg lg:text-xl black-80-text poppins-regular">
                                    {problemDetails?.name}
                                </p>
                            </div>


                            <div className="flex flex-row gap-2">
                                <h3 className="text-lg lg:text-xl poppins-semibold">
                                    slug :
                                </h3>
                                <p className="text-lg lg:text-xl black-80-text poppins-regular">
                                    {problemDetails?.slug}
                                </p>
                            </div>


                            <div className="flex flex-row gap-2">
                                <h3 className="text-lg lg:text-xl poppins-semibold">
                                    tags :
                                </h3>
                                <div className="flex flex-row flex-wrap gap-2">
                                    {problemDetails?.tags?.map((tag, index) => {
                                        return <div
                                            key={`${problemDetails?.slug}-tag-${index}`}
                                            className="px-4 py-1 border border-2 border-[#0a173266] text-[#0a1732] rounded-full text-xs poppins-regular">
                                            {tag}
                                        </div>
                                    })}
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <h3 className="text-lg lg:text-xl poppins-semibold">
                                    description :
                                </h3>
                                <p className="whitespace-pre-line w-full text-wrap text-lg lg:text-xl black-80-text poppins-regular">
                                    {problemDetails?.description}
                                </p>
                            </div>


                            <div className="flex flex-row gap-2">
                                <h3 className="text-lg lg:text-xl poppins-semibold">
                                    difficulty :
                                </h3>
                                <p className="text-lg lg:text-xl black-80-text poppins-regular">
                                    <span className={`px-4 py-1 border rounded-full ${problemDetails?.difficulty === "easy" ? "text-green-400" : (problemDetails?.difficulty === "medium" ? "text-yellow-400" : "text-red-400")} text-sm poppins-semibold`}>

                                        {(problemDetails?.difficulty).toUpperCase()}
                                    </span>
                                </p>
                            </div>


                            <div className="flex flex-row gap-2">
                                <h3 className="text-lg lg:text-xl poppins-semibold">
                                    is_public :
                                </h3>
                                <p className={`text-lg lg:text-xl ${problemDetails?.is_public === true ? "text-violet-400" : "text-blue-400"} poppins-regular`}>
                                    {problemDetails?.is_public === true ? "Public" : "Private"}
                                </p>
                            </div>


                            <div className="flex flex-row gap-2">
                                <h3 className="text-lg lg:text-xl poppins-semibold">
                                    created_by :
                                </h3>
                                <p className={`text-lg lg:text-xl black-80-text poppins-regular`}>
                                    {problemDetails?.created_by}
                                </p>
                            </div>

                            <div className="flex flex-row gap-2">
                                <h3 className="text-lg lg:text-xl poppins-semibold">
                                    createdAt :
                                </h3>
                                <p className={`text-lg lg:text-xl black-80-text poppins-regular`}>
                                    {getLocalDateTimeStringFromISOString(problemDetails?.createdAt)}
                                </p>
                            </div>

                            <div className="flex flex-row gap-2">
                                <h3 className="text-lg lg:text-xl poppins-semibold">
                                    updatedAt :
                                </h3>
                                <p className={`text-lg lg:text-xl black-80-text poppins-regular`}>
                                    {getLocalDateTimeStringFromISOString(problemDetails?.updatedAt)}
                                </p>
                            </div>


                            <div className="flex flex-col gap-2">
                                <h3 className="text-lg lg:text-xl poppins-semibold">
                                    test_cases :
                                </h3>
                                <div className="px-4 flex flex-col gap-4">

                                    {problemDetails?.test_cases?.map((testCase, testCaseIndex) => {
                                        return <div
                                            key={`${problemDetails?.slug}-test-case-${testCaseIndex}`}
                                            className="border border-2 border-[#0a1732cc] rounded-xl px-4 lg:px-8 py-2 lg:py-4 flex flex-col gap-2 black-80-text"
                                        >
                                            <div className="flex flex-row gap-2">
                                                <h3 className="text-lg lg:text-xl poppins-semibold">
                                                    language_id :
                                                </h3>
                                                <p className="text-lg lg:text-xl poppins-semibold black-80-text">
                                                    {testCase?.language_id}
                                                </p>
                                            </div>

                                            {/* Public Test Cases Section - Starts Here */}
                                            <ExpandCollapseControls>
                                                <ExpandCollapseControls.ParentContent>
                                                    <>
                                                        <h3 className="text-lg lg:text-xl text-violet-400 poppins-semibold">
                                                            public_test_cases :
                                                        </h3>
                                                    </>
                                                </ExpandCollapseControls.ParentContent>

                                                <ExpandCollapseControls.ChildContent>
                                                    <>

                                                        {/* Public Test Case Info Section - Starts Here */}
                                                        {testCase?.public_test_cases?.map((publicTestCase, publicTestCaseIndex) => {

                                                            return <div
                                                                key={`${problemDetails?.slug}-language-${testCase.language_id}-public-test-case-${publicTestCaseIndex}`}
                                                                className="px-4">

                                                                <ExpandCollapseControls>
                                                                    <ExpandCollapseControls.ParentContent>
                                                                        <>
                                                                            <div className="flex flex-row gap-2">

                                                                                <h3 className="text-lg lg:text-xl poppins-semibold">
                                                                                    id :
                                                                                </h3>
                                                                                <p className="text-lg lg:text-xl poppins-semibold">
                                                                                    {publicTestCase?.id}
                                                                                </p>

                                                                            </div>
                                                                        </>

                                                                    </ExpandCollapseControls.ParentContent>
                                                                    <ExpandCollapseControls.ChildContent>
                                                                        <>
                                                                            <div className="mx-4 py-4 px-4 lg:px-8 border border-1 border-[#0a173233] rounded-xl flex flex-col gap-4">
                                                                                <div className="flex flex-row gap-2">
                                                                                    <h3 className="text-lg lg:text-xl poppins-semibold">
                                                                                        id :
                                                                                    </h3>
                                                                                    <p className={`text-lg lg:text-xl black-80-text poppins-regular`}>
                                                                                        {publicTestCase?.id}
                                                                                    </p>
                                                                                </div>

                                                                                <div className="flex flex-row gap-2">
                                                                                    <h3 className="text-lg lg:text-xl poppins-semibold">
                                                                                        stdin :
                                                                                    </h3>
                                                                                    <p className={`text-lg lg:text-xl black-80-text poppins-regular`}>
                                                                                        {publicTestCase?.stdin}
                                                                                    </p>
                                                                                </div>

                                                                                <div className="flex flex-row gap-2">
                                                                                    <h3 className="text-lg lg:text-xl poppins-semibold">
                                                                                        expected_output :
                                                                                    </h3>
                                                                                    <p className={`text-lg lg:text-xl black-80-text poppins-regular`}>
                                                                                        {publicTestCase?.expected_output}
                                                                                    </p>
                                                                                </div>

                                                                                <div className="flex flex-row gap-2">
                                                                                    <h3 className="text-lg lg:text-xl poppins-semibold">
                                                                                        cpu_time_limit :
                                                                                    </h3>
                                                                                    <p className={`text-lg lg:text-xl black-80-text poppins-regular`}>
                                                                                        {publicTestCase?.cpu_time_limit}
                                                                                    </p>
                                                                                </div>

                                                                                <div className="flex flex-row gap-2">
                                                                                    <h3 className="text-lg lg:text-xl poppins-semibold">
                                                                                        memory_limit :
                                                                                    </h3>
                                                                                    <p className={`text-lg lg:text-xl black-80-text poppins-regular`}>
                                                                                        {publicTestCase?.memory_limit}
                                                                                    </p>
                                                                                </div>

                                                                                <div className="flex flex-row gap-2">
                                                                                    <h3 className="text-lg lg:text-xl poppins-semibold">
                                                                                        stack_limit :
                                                                                    </h3>
                                                                                    <p className={`text-lg lg:text-xl black-80-text poppins-regular`}>
                                                                                        {publicTestCase?.stack_limit}
                                                                                    </p>
                                                                                </div>

                                                                            </div>
                                                                        </>

                                                                    </ExpandCollapseControls.ChildContent>
                                                                </ExpandCollapseControls>

                                                            </div>
                                                        })}

                                                        {/* Public Test Case Info Section - Ends Here */}

                                                    </>
                                                </ExpandCollapseControls.ChildContent>
                                            </ExpandCollapseControls>
                                            {/* Public Test Cases Section - Ends Here */}

                                            {/* Private Test Cases Section - Starts Here */}
                                            <ExpandCollapseControls>
                                                <ExpandCollapseControls.ParentContent>
                                                    <>
                                                        <h3 className="text-lg lg:text-xl text-blue-400 poppins-semibold">
                                                            private_test_cases :
                                                        </h3>
                                                    </>
                                                </ExpandCollapseControls.ParentContent>

                                                <ExpandCollapseControls.ChildContent>
                                                    <>

                                                        {/* Private Test Case Info Section - Starts Here */}
                                                        {testCase?.private_test_cases?.map((privateTestCase, privateTestCaseIndex) => {

                                                            return <div
                                                                key={`${problemDetails?.slug}-language-${testCase.language_id}-public-test-case-${privateTestCaseIndex}`}
                                                                className="px-4">

                                                                <ExpandCollapseControls>
                                                                    <ExpandCollapseControls.ParentContent>
                                                                        <>
                                                                            <div className="px-4 flex flex-row gap-2">

                                                                                <h3 className="text-lg lg:text-xl poppins-semibold">
                                                                                    id :
                                                                                </h3>
                                                                                <p className="text-lg lg:text-xl poppins-semibold">
                                                                                    {privateTestCase?.id}
                                                                                </p>

                                                                            </div>
                                                                        </>

                                                                    </ExpandCollapseControls.ParentContent>
                                                                    <ExpandCollapseControls.ChildContent>
                                                                        <>
                                                                            <div className="mx-4 py-4 px-4 lg:px-8 border border-1 border-[#0a173233] rounded-xl flex flex-col gap-4">
                                                                                <div className="flex flex-row gap-2">
                                                                                    <h3 className="text-lg lg:text-xl poppins-semibold">
                                                                                        id :
                                                                                    </h3>
                                                                                    <p className={`text-lg lg:text-xl black-80-text poppins-regular`}>
                                                                                        {privateTestCase?.id}
                                                                                    </p>
                                                                                </div>

                                                                                <div className="flex flex-row gap-2">
                                                                                    <h3 className="text-lg lg:text-xl poppins-semibold">
                                                                                        stdin :
                                                                                    </h3>
                                                                                    <p className={`text-lg lg:text-xl black-80-text poppins-regular`}>
                                                                                        {privateTestCase?.stdin}
                                                                                    </p>
                                                                                </div>

                                                                                <div className="flex flex-row gap-2">
                                                                                    <h3 className="text-lg lg:text-xl poppins-semibold">
                                                                                        expected_output :
                                                                                    </h3>
                                                                                    <p className={`text-lg lg:text-xl black-80-text poppins-regular`}>
                                                                                        {privateTestCase?.expected_output}
                                                                                    </p>
                                                                                </div>

                                                                                <div className="flex flex-row gap-2">
                                                                                    <h3 className="text-lg lg:text-xl poppins-semibold">
                                                                                        cpu_time_limit :
                                                                                    </h3>
                                                                                    <p className={`text-lg lg:text-xl black-80-text poppins-regular`}>
                                                                                        {privateTestCase?.cpu_time_limit}
                                                                                    </p>
                                                                                </div>

                                                                                <div className="flex flex-row gap-2">
                                                                                    <h3 className="text-lg lg:text-xl poppins-semibold">
                                                                                        memory_limit :
                                                                                    </h3>
                                                                                    <p className={`text-lg lg:text-xl black-80-text poppins-regular`}>
                                                                                        {privateTestCase?.memory_limit}
                                                                                    </p>
                                                                                </div>

                                                                                <div className="flex flex-row gap-2">
                                                                                    <h3 className="text-lg lg:text-xl poppins-semibold">
                                                                                        stack_limit :
                                                                                    </h3>
                                                                                    <p className={`text-lg lg:text-xl black-80-text poppins-regular`}>
                                                                                        {privateTestCase?.stack_limit}
                                                                                    </p>
                                                                                </div>

                                                                            </div>
                                                                        </>

                                                                    </ExpandCollapseControls.ChildContent>
                                                                </ExpandCollapseControls>

                                                            </div>
                                                        })}

                                                        {/* Private Test Case Info Section - Ends Here */}

                                                    </>
                                                </ExpandCollapseControls.ChildContent>
                                            </ExpandCollapseControls>
                                            {/* Private Test Cases Section - Ends Here */}

                                        </div>
                                    })}

                                </div>
                            </div>



                        </div>

                    </> : <>
                        <h2 className="text-xl">Sorry! Seems like Something Went Wrong....</h2>
                    </>}

                </div>
            </div>
            {/* Problem's Details Section - Ends Here */}


            {/* Control Panel's Details Section - Ends Here */}
        </ControlPanelLayout>
    </>
};

export default ControlPanelProblemDetails;