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
import TextAreaInput from "../../../components/input/TextAreaInput";
import TagsInput from "../../../components/input/TagsInput";
import SingleSelectInput from "../../../components/input/SingleSelectInput";
import NumericInput from "../../../components/input/NumericInput";


const ControlPanelProblemUpdate = () => {

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

    const [supportedProgrammingLanguages, setSupportedProgrammingLanguages] = useState(
        [
            {
                language_id: 52,
                language_name: "C++ (GCC 7.4.0)",
            },
            {
                language_id: 62,
                language_name: "Java (OpenJDK 13.0.1)",
            },
            {
                language_id: 63,
                language_name: "JavaScript (Node.js 12.14.0)",
            },
            {
                language_id: 71,
                language_name: "Python (3.8.1)",
            },
        ]
        // We Can Add More Language Options Afterwards
    );

    const currTime = (new Date()).getTime();


    const [problemDetails, setProblemDetails] = useState({
        _id: "",
        name: "",
        slug: "",
        tags: [],
        description: "",
        difficulty: "", // have values like: "easy", "medium", "hard"
        is_public: null, // boolean type: true or false
        test_cases: []
    }
    ); // null or Object


    const isProblemDetailsValid = async () => {

        // Check for name
        if (problemDetails.name.length < 1) {
            toast.error("Please Provide Name");
            console.log("Sorry! Name is Required");
            return false;
        }

        // Check for slug
        if (problemDetails.slug.length < 1) {
            toast.error("Please Provide Slug");
            console.log("Sorry! Slug is Required");
            return false;
        }

        // Check for Tags
        if (problemDetails.tags.length < 4) {
            toast.error("Please Provide Minimum 4 Tags");
            console.log("Sorry! Minimum 4 Tags Required");
            return false;
        }

        // Check for difficulty
        if (["easy", "medium", "hard"].includes(problemDetails.difficulty) === false) {
            toast.error(`Please Provide Difficulty like: "easy", "medium", "hard"`);
            console.log(`Sorry! Difficulty can have values like: "easy", "medium", "hard"`);
            return false;
        }

        // Check for test_cases length
        if (problemDetails.test_cases.length < supportedProgrammingLanguages.length) {
            toast.error(`Please Provide Test Cases for Every Supported Programming Language`);
            console.log(`Sorry! Test Cases are Required for Every Supported Programming Language`);
            return false;
        }

        // Check for test_cases fields
        let isAllFieldsValid = true;
        let errorMessage = "";
        for (let index = 0; index < problemDetails.test_cases.length; index++) {
            const testCase = problemDetails.test_cases[index];

            // Check for Public Test Case
            for (let publicTestCaseIndex = 0; publicTestCaseIndex < testCase.public_test_cases.length; publicTestCaseIndex++) {
                const publicTestCase = testCase.public_test_cases[publicTestCaseIndex];

                if (parseInt(publicTestCase.cpu_time_limit || 0) < 2) {
                    isAllFieldsValid = false;
                    errorMessage = `For testcase with language_id: ${testCase.language_id} cpu_time_limit < 2 for publicTestCase with id: ${publicTestCase.id}`;
                    toast.error(errorMessage);
                    break;
                }

                if (parseInt(publicTestCase.memory_limit || 0) < 2048) {
                    isAllFieldsValid = false;
                    errorMessage = `For testcase with language_id: ${testCase.language_id} memory_limit < 2048 for publicTestCase with id: ${publicTestCase.id}`;
                    toast.error(errorMessage);
                    break;
                }

                if (parseInt(publicTestCase.stack_limit || 0) < 2048) {
                    isAllFieldsValid = false;
                    errorMessage = `For testcase with language_id: ${testCase.language_id} stack_limit < 2048 for publicTestCase with id: ${publicTestCase.id}`;
                    toast.error(errorMessage);
                    break;
                }
            }

            if (isAllFieldsValid === false) {
                break;
            }

            // Check for Private Test Case
            for (let privateTestCaseIndex = 0; privateTestCaseIndex < testCase.private_test_cases.length; privateTestCaseIndex++) {
                const privateTestCase = testCase.private_test_cases[privateTestCaseIndex];

                if (parseInt(privateTestCase.cpu_time_limit || 0) < 2) {
                    isAllFieldsValid = false;
                    errorMessage = `For testcase with language_id: ${testCase.language_id} cpu_time_limit < 2 for privateTestCase with id: ${privateTestCase.id}`;
                    toast.error(errorMessage);
                    break;
                }

                if (parseInt(privateTestCase.memory_limit || 0) < 2048) {
                    isAllFieldsValid = false;
                    errorMessage = `For testcase with language_id: ${testCase.language_id} memory_limit < 2048 for privateTestCase with id: ${privateTestCase.id}`;
                    toast.error(errorMessage);
                    break;
                }

                if (parseInt(privateTestCase.stack_limit || 0) < 2048) {
                    isAllFieldsValid = false;
                    errorMessage = `For testcase with language_id: ${testCase.language_id} stack_limit < 2048 for privateTestCase with id: ${privateTestCase.id}`;
                    toast.error(errorMessage);
                    break;
                }
            }
        }

        if (isAllFieldsValid === false) {
            return false;
        }

    };

    const handleClickOnUpdateProblemButton = async () => {
        console.log("Inside handleClickOnCreateProblemButton()....");

        if (await isProblemDetailsValid() === false) {
            await sleep(1000);
            console.log("Invalid Problem Details....");
            // toast.error("Please Fill Correct Details....");
            return;
        }

        toast.success("All Data Valid");
        console.log(problemDetails);

        // Pre Process the "problemDetails" for numeric inputs
        const payload = {
            ...problemDetails,
            is_public: problemDetails.is_public === "false" ? false : true,
            test_cases: problemDetails.test_cases.map((testCase) => {
                return {
                    ...testCase,
                    public_test_cases: testCase.public_test_cases.map((publicTestCase) => {
                        return {
                            ...publicTestCase,
                            cpu_time_limit: parseInt(publicTestCase.cpu_time_limit),
                            memory_limit: parseInt(publicTestCase.memory_limit),
                            stack_limit: parseInt(publicTestCase.stack_limit),
                        }
                    }),
                    private_test_cases: testCase.private_test_cases.map((privateTestCase) => {
                        return {
                            ...privateTestCase,
                            cpu_time_limit: parseInt(privateTestCase.cpu_time_limit),
                            memory_limit: parseInt(privateTestCase.memory_limit),
                            stack_limit: parseInt(privateTestCase.stack_limit),
                        }
                    }),
                }
            }),
        };

        // console.log("Payload: ");
        // console.log(payload);

        try {

            console.log("Payload For the API Call: ");
            console.log(payload);

            const response = await axios.put(`${API_BASE}/problems/control/update`, payload, {
                headers: {
                    "Content-Type": "application/json",
                    "client-id": clientId,
                    "authorization": token,
                }
            })

            // console.log("Response From the PROBLEMS' API Call: ");
            // console.log(response);
            toast.success(response.data.message);

        } catch (error) {
            console.log(error);
            console.log("Something Went Wrong While Making the PROBLEMS' API Call....", error);
            toast.error("Something went Wrong....");
        }


    };


    const handleChangeInProblemFormValues = async (e) => {
        // console.log(e);
        // console.log(e.target);
        console.log(e.target.id);


        const idOfElementInProblemForm = e.target.id;


        setProblemDetails((prev) => {
            const newProblemDetails = {
                ...prev,
                [idOfElementInProblemForm]: e.target.value,
            };
            return newProblemDetails;
        })

    };

    const handleChangeInTestCaseFields = async (valueToUpdate, testCaseIndex, type, subTypeTestCaseIndex, fieldName) => {

        console.log("We have got the things like: ", valueToUpdate, testCaseIndex, type, subTypeTestCaseIndex, fieldName);


        setProblemDetails((prev) => {
            // 1. Copy the top-level test_cases array
            const updatedTestCases = [...prev.test_cases];

            // 2. Copy the specific language object
            const updatedLanguageGroup = { ...updatedTestCases[testCaseIndex] };

            // 3. Copy the specific test case array (public or private)
            const updatedCases = [...updatedLanguageGroup[type]];

            // 4. Copy the specific test case object and update the field
            updatedCases[subTypeTestCaseIndex] = {
                ...updatedCases[subTypeTestCaseIndex],
                [fieldName]: valueToUpdate
            };

            // 5. Put it all back together
            updatedLanguageGroup[type] = updatedCases;
            updatedTestCases[testCaseIndex] = updatedLanguageGroup;

            return { ...prev, test_cases: updatedTestCases };
        });


        console.log(problemDetails);

    }


    // if "supportedProgrammingLanguages" changes then reset the "problemDetails.test_cases"
    useEffect(() => {

        setProblemDetails((prev) => {
            return {
                ...prev,
                test_cases: (supportedProgrammingLanguages.map((programmingLanguage) => {
                    return {
                        language_id: programmingLanguage.language_id,
                        public_test_cases: [
                            {
                                stdin: "",
                                expected_output: "",
                                cpu_time_limit: null,
                                memory_limit: null,
                                stack_limit: null,
                                id: (new Date(currTime + 1000)).toISOString()
                            },
                            {
                                stdin: "",
                                expected_output: "",
                                cpu_time_limit: null,
                                memory_limit: null,
                                stack_limit: null,
                                id: (new Date(currTime + 2000)).toISOString()
                            },
                        ],
                        private_test_cases: [
                            {
                                stdin: "",
                                expected_output: "",
                                cpu_time_limit: null,
                                memory_limit: null,
                                stack_limit: null,
                                id: (new Date(currTime + 1000)).toISOString()
                            },
                            {
                                stdin: "",
                                expected_output: "",
                                cpu_time_limit: null,
                                memory_limit: null,
                                stack_limit: null,
                                id: (new Date(currTime + 2000)).toISOString()
                            },
                            {
                                stdin: "",
                                expected_output: "",
                                cpu_time_limit: null,
                                memory_limit: null,
                                stack_limit: null,
                                id: (new Date(currTime + 3000)).toISOString()
                            },
                            {
                                stdin: "",
                                expected_output: "",
                                cpu_time_limit: null,
                                memory_limit: null,
                                stack_limit: null,
                                id: (new Date(currTime + 4000)).toISOString()
                            },
                            {
                                stdin: "",
                                expected_output: "",
                                cpu_time_limit: null,
                                memory_limit: null,
                                stack_limit: null,
                                id: (new Date(currTime + 5000)).toISOString()
                            },
                            {
                                stdin: "",
                                expected_output: "",
                                cpu_time_limit: null,
                                memory_limit: null,
                                stack_limit: null,
                                id: (new Date(currTime + 6000)).toISOString()
                            },
                            {
                                stdin: "",
                                expected_output: "",
                                cpu_time_limit: null,
                                memory_limit: null,
                                stack_limit: null,
                                id: (new Date(currTime + 7000)).toISOString()
                            },
                        ]
                    }
                })),
            };
        });

    }, [supportedProgrammingLanguages])


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


    // Listener 2: Handle Valid Update Problem's Response
    useSocketListener(
        // Selector: "Is this message for me?"
        (msg) => msg.type?.includes('response') && msg.metadata.operation?.includes("problems.control.update"),

        // Handler: "What do I do with it?"
        async (msg) => {
            // Clear the Previous Toast Notifications
            toast.dismiss();

            const { data, metadata } = msg;

            // If Update Problem's is Success then Save The Problems For further Accesses 
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

                // navigate to problem's details page
                navigate(`/admins/control-panel/problems/${problemDetailsFromEventData.slug}`);


            }
            // Else Request Processing is not done then Tell User What May Went Wrong
            else {
                console.log(data);
                console.log(metadata);

                toast.error(metadata.message);
                await sleep(1000);
                toast.error("Seems Like Problem Not Created....");
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

            {/* Problem's Form Input Section - Starts Here */}
            <div className="flex flex-col items-center px-2 lg:px-4">

                {/* <div className="w-full border border-0 border-b-2 border-[#0a17320d] pb-2 lg:pb-4 mb-4 lg:mb-8">

                    

                </div> */}

                <Heading
                    text={`Update Problem`}
                />

                <div className="w-full overflow-x-auto mt-8 px-2 lg:px-4 py-16 lg:py-8">

                    {problemDetails ? <>

                        <div className="mb-16 text-nowrap flex flex-col gap-4">

                            <div className="flex flex-row gap-2">
                                <h3 className="text-lg lg:text-xl poppins-semibold">
                                    name :
                                </h3>
                                <TextInput
                                    id={`name`}
                                    placeholderText={`Please give Problem's Unique Name like: Add Numbers, Factorial....`}
                                    value={problemDetails.name}
                                    onValueChange={handleChangeInProblemFormValues}
                                />
                            </div>


                            <div className="flex flex-row gap-2">
                                <h3 className="text-lg lg:text-xl poppins-semibold">
                                    slug :
                                </h3>
                                <TextInput
                                    id={`slug`}
                                    placeholderText={`Please give Problem's Unique Slug like: add-numbers, factorial....`}
                                    value={problemDetails.slug}
                                    onValueChange={handleChangeInProblemFormValues}
                                />
                            </div>


                            <div className="flex flex-row gap-2">
                                <h3 className="text-lg lg:text-xl poppins-semibold">
                                    tags :
                                </h3>
                                <TagsInput
                                    id={`tags`}
                                    placeholderText={`Please give Problem's Tags like: easy, array....`}
                                    value={problemDetails.tags}
                                    onValueChange={(newTags) => {
                                        setProblemDetails((prev) => {
                                            return {
                                                ...prev,
                                                tags: newTags,
                                            };
                                        });
                                    }}
                                    tagsHeading={` `}
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <h3 className="text-lg lg:text-xl poppins-semibold">
                                    description :
                                </h3>
                                <TextAreaInput
                                    id={`description`}
                                    placeholderText={`Please give Problem's Description like: We have....`}
                                    value={problemDetails.description}
                                    onValueChange={handleChangeInProblemFormValues}
                                />
                            </div>


                            <div className="flex flex-row gap-2">
                                <h3 className="text-lg lg:text-xl poppins-semibold">
                                    difficulty :
                                </h3>
                                <SingleSelectInput
                                    id={`difficulty`}
                                    placeholderText={`Select Problem's Difficulty....`}
                                    value={problemDetails.difficulty}
                                    onValueChange={handleChangeInProblemFormValues}
                                    options={[
                                        {
                                            label: "Easy", value: "easy"
                                        },
                                        {
                                            label: "Medium", value: "medium"
                                        },
                                        {
                                            label: "hard", value: "hard"
                                        },
                                    ]}
                                    optionsHeading={` `}
                                />

                            </div>


                            <div className="flex flex-row gap-2">
                                <h3 className="text-lg lg:text-xl poppins-semibold">
                                    is_public :
                                </h3>
                                <SingleSelectInput
                                    id={`is_public`}
                                    placeholderText={`Select Problem's Visibility....`}
                                    value={problemDetails.is_public}
                                    onValueChange={handleChangeInProblemFormValues}
                                    options={[
                                        {
                                            label: "Public", value: true
                                        },
                                        {
                                            label: "Private", value: false
                                        },
                                    ]}
                                    optionsHeading={` `}
                                />

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
                                                                                    <TextInput
                                                                                        id={`${testCase?.language_id}-public-test-case${publicTestCase?.id}-stdin`}
                                                                                        placeholderText={`Program Input like: 1, "hello",....`}
                                                                                        value={publicTestCase.stdin}
                                                                                        onValueChange={(e) => {
                                                                                            handleChangeInTestCaseFields(e.target.value, testCaseIndex, "public_test_cases", publicTestCaseIndex, "stdin");
                                                                                        }}
                                                                                    />
                                                                                </div>

                                                                                <div className="flex flex-row gap-2">
                                                                                    <h3 className="text-lg lg:text-xl poppins-semibold">
                                                                                        expected_output :
                                                                                    </h3>
                                                                                    <TextInput
                                                                                        id={`${testCase?.language_id}-public-test-case${publicTestCase?.id}-expected_output`}
                                                                                        placeholderText={`Program Expected Output like: 1, "hello",....`}
                                                                                        value={publicTestCase.expected_output}
                                                                                        onValueChange={(e) => {
                                                                                            handleChangeInTestCaseFields(e.target.value, testCaseIndex, "public_test_cases", publicTestCaseIndex, "expected_output");
                                                                                        }}
                                                                                    />
                                                                                </div>

                                                                                <div className="flex flex-row gap-2">
                                                                                    <h3 className="text-lg lg:text-xl poppins-semibold">
                                                                                        cpu_time_limit :
                                                                                    </h3>
                                                                                    <NumericInput
                                                                                        id={`${testCase?.language_id}-public-test-case${publicTestCase?.id}-cpu_time_limit`}
                                                                                        placeholderText={`Program CPU Time Limit In Seconds Minimum 2s like: 20,....`}
                                                                                        value={publicTestCase.cpu_time_limit}
                                                                                        onValueChange={(e) => {
                                                                                            handleChangeInTestCaseFields(e.target.value, testCaseIndex, "public_test_cases", publicTestCaseIndex, "cpu_time_limit");
                                                                                        }}
                                                                                    />
                                                                                </div>

                                                                                <div className="flex flex-row gap-2">
                                                                                    <h3 className="text-lg lg:text-xl poppins-semibold">
                                                                                        memory_limit :
                                                                                    </h3>
                                                                                    <NumericInput
                                                                                        id={`${testCase?.language_id}-public-test-case${publicTestCase?.id}-memory_limit`}
                                                                                        placeholderText={`Program Memory Limit In KB Minimum 2048 like: 4096,....`}
                                                                                        value={publicTestCase.memory_limit}
                                                                                        onValueChange={(e) => {
                                                                                            handleChangeInTestCaseFields(e.target.value, testCaseIndex, "public_test_cases", publicTestCaseIndex, "memory_limit");
                                                                                        }}
                                                                                    />
                                                                                </div>

                                                                                <div className="flex flex-row gap-2">
                                                                                    <h3 className="text-lg lg:text-xl poppins-semibold">
                                                                                        stack_limit :
                                                                                    </h3>
                                                                                    <NumericInput
                                                                                        id={`${testCase?.language_id}-public-test-case${publicTestCase?.id}-stack_limit`}
                                                                                        placeholderText={`Program Stack Limit In KB Minimum 2048 like: 4096,....`}
                                                                                        value={publicTestCase.stack_limit}
                                                                                        onValueChange={(e) => {
                                                                                            handleChangeInTestCaseFields(e.target.value, testCaseIndex, "public_test_cases", publicTestCaseIndex, "stack_limit");
                                                                                        }}
                                                                                    />
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
                                                                key={`${problemDetails?.privatelug}-language-${testCase.language_id}-private-test-case-${privateTestCaseIndex}`}
                                                                className="px-4">

                                                                <ExpandCollapseControls>
                                                                    <ExpandCollapseControls.ParentContent>
                                                                        <>
                                                                            <div className="flex flex-row gap-2">

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
                                                                                    <TextInput
                                                                                        id={`${testCase?.language_id}-private-test-case${privateTestCase?.id}-stdin`}
                                                                                        placeholderText={`Program Input like: 1, "hello",....`}
                                                                                        value={privateTestCase.stdin}
                                                                                        onValueChange={(e) => {
                                                                                            handleChangeInTestCaseFields(e.target.value, testCaseIndex, "private_test_cases", privateTestCaseIndex, "stdin");
                                                                                        }}
                                                                                    />
                                                                                </div>

                                                                                <div className="flex flex-row gap-2">
                                                                                    <h3 className="text-lg lg:text-xl poppins-semibold">
                                                                                        expected_output :
                                                                                    </h3>
                                                                                    <TextInput
                                                                                        id={`${testCase?.language_id}-private-test-case${privateTestCase?.id}-expected_output`}
                                                                                        placeholderText={`Program Expected Output like: 1, "hello",....`}
                                                                                        value={privateTestCase.expected_output}
                                                                                        onValueChange={(e) => {
                                                                                            handleChangeInTestCaseFields(e.target.value, testCaseIndex, "private_test_cases", privateTestCaseIndex, "expected_output");
                                                                                        }}
                                                                                    />
                                                                                </div>

                                                                                <div className="flex flex-row gap-2">
                                                                                    <h3 className="text-lg lg:text-xl poppins-semibold">
                                                                                        cpu_time_limit :
                                                                                    </h3>
                                                                                    <NumericInput
                                                                                        id={`${testCase?.language_id}-private-test-case${privateTestCase?.id}-cpu_time_limit`}
                                                                                        placeholderText={`Program CPU Time Limit In Seconds Minimum 2s like: 20,....`}
                                                                                        value={privateTestCase.cpu_time_limit}
                                                                                        onValueChange={(e) => {
                                                                                            handleChangeInTestCaseFields(e.target.value, testCaseIndex, "private_test_cases", privateTestCaseIndex, "cpu_time_limit");
                                                                                        }}
                                                                                    />
                                                                                </div>

                                                                                <div className="flex flex-row gap-2">
                                                                                    <h3 className="text-lg lg:text-xl poppins-semibold">
                                                                                        memory_limit :
                                                                                    </h3>
                                                                                    <NumericInput
                                                                                        id={`${testCase?.language_id}-private-test-case${privateTestCase?.id}-memory_limit`}
                                                                                        placeholderText={`Program Memory Limit In KB Minimum 2048 like: 4096,....`}
                                                                                        value={privateTestCase.memory_limit}
                                                                                        onValueChange={(e) => {
                                                                                            handleChangeInTestCaseFields(e.target.value, testCaseIndex, "private_test_cases", privateTestCaseIndex, "memory_limit");
                                                                                        }}
                                                                                    />
                                                                                </div>

                                                                                <div className="flex flex-row gap-2">
                                                                                    <h3 className="text-lg lg:text-xl poppins-semibold">
                                                                                        stack_limit :
                                                                                    </h3>
                                                                                    <NumericInput
                                                                                        id={`${testCase?.language_id}-private-test-case${privateTestCase?.id}-stack_limit`}
                                                                                        placeholderText={`Program Stack Limit In KB Minimum 2048 like: 4096,....`}
                                                                                        value={privateTestCase.stack_limit}
                                                                                        onValueChange={(e) => {
                                                                                            handleChangeInTestCaseFields(e.target.value, testCaseIndex, "private_test_cases", privateTestCaseIndex, "stack_limit");
                                                                                        }}
                                                                                    />
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


                            <br />
                            <br />

                            <button
                                onClick={handleClickOnUpdateProblemButton}
                                className="transition-all duration-[0.4s] ease-in-out hover:scale-[1.02] active:scale-[0.8] cursor-pointer py-2 lg:py-4 px-8 lg:px-16 text-lg lg:text-2xl text-white rounded-full disabled:opacity-[0.2] text-center bg-[#135BEB] poppins-semibold custom-smooth-drop-shadow">
                                Update
                            </button>

                        </div>

                    </> : <>
                        <h2 className="text-xl">Sorry! Seems like Something Went Wrong....</h2>
                    </>}

                </div>
            </div>
            {/* Problem's Form Input Section - Ends Here */}


            {/* Control Panel's Details Section - Ends Here */}
        </ControlPanelLayout>
    </>
};

export default ControlPanelProblemUpdate;