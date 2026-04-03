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
import DateTimeInput from "../../../components/input/DateTimeInput";
import MultiSelectCheckBoxInput from "../../../components/input/MultiSelectCheckBoxInput";


const ControlPanelContestCreate = () => {

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

    const currTime = (new Date()).getTime();


    const [contestDetails, setContestDetails] = useState({
        name: "",
        slug: "",
        description: "",
        start_time: "",
        end_time: "",
        duration: undefined, // Milliseconds
        support_end_time: "",

        support_team: [],
        problems: [],

    }
    ); // null or Object

    const [supportUsersList, setSupportUsersList] = useState([
        {
            _id: "697058df5d836f6d1b37e6e7",
            name: "Harsh Kumar",
            role: "SUPPORT",
            user_name: "harshku1",
            activation_status: "active",
            email: "harshku1@gmail.com",
            password: "007",
            mobile_no: "7275589766",
            tried_problems: ["697058df5d836f6d1b37e6e7", "697058df5d836f6d1b37e6e7"],
            participated_in_contests: ["697058df5d836f6d1b37e6e7", "697058df5d836f6d1b37e6e7"],
            createdAt: "2026-01-21T04:41:03.589Z",
            updatedAt: "2026-01-21T04:41:03.589Z",
        },
        {
            _id: "697058df5d836f6d1b37e6f7",
            name: "Harsh Kumar",
            role: "SUPPORT",
            user_name: "harshku2",
            activation_status: "active",
            email: "harshku2@gmail.com",
            password: "007",
            mobile_no: "7275589766",
            tried_problems: ["697058df5d836f6d1b37e6e7", "697058df5d836f6d1b37e6e7"],
            participated_in_contests: ["697058df5d836f6d1b37e6e7", "697058df5d836f6d1b37e6e7"],
            createdAt: "2026-01-21T04:41:03.589Z",
            updatedAt: "2026-01-21T04:41:03.589Z",
        },

    ]);


    const [problemsList, setProblemsList] = useState([
        {
            _id: "1",
            name: "Calculate Factorial",
            slug: "calculate-factorial",
            tags: ["easy", "factorial", "mauj", "new"],
            description: "Calculate Factorial Description",
            difficulty: "easy", // Have values like: "easy", "medium", "hard"
            is_public: true, // boolean type i.e. true or false
            created_by: "SUPER",
        },

        {
            _id: "2",
            name: "Calculate Area",
            slug: "calculate-area",
            tags: ["medium", "area"],
            description: "Calculate Area Description",
            difficulty: "medium", // Have values like: "easy", "medium", "hard"
            is_public: false, // boolean type i.e. true or false
            created_by: "SUPER",
        },

        {
            _id: "3",
            name: "Calculate Volume",
            slug: "calculate-volume",
            tags: ["hard", "volume"],
            description: "Calculate Volume Description",
            difficulty: "hard", // Have values like: "easy", "medium", "hard"
            is_public: true, // boolean type i.e. true or false
            created_by: "SUPER",
        },


    ]);

    const [loadingProblems, setLoadingProblems] = useState(false);
    const [loadingUsers, setLoadingUsers] = useState(false);



    const isContestDetailsValid = async () => {

        console.log("Inside isContestDetailsValid()....");
        console.log(contestDetails);

        const currDateISOString = new Date().toISOString();


        // Check for name
        if (contestDetails.name.length < 1) {
            toast.error("Please Provide Name");
            console.log("Sorry! Name is Required");
            return false;
        }

        // Check for slug
        if (contestDetails.slug.length < 1) {
            toast.error("Please Provide Slug");
            console.log("Sorry! Slug is Required");
            return false;
        }

        // Check for description
        if (contestDetails.description.length < 1) {
            toast.error("Please Provide Description");
            console.log("Sorry! Description is Required");
            return false;
        }

        // Check for duration
        if (parseInt(contestDetails.duration || 0) < 600000) {
            toast.error("Please Provide Atleast 10 Minute long Contest's Duration");
            console.log("Sorry! Atleast 10 Minute long Contest Required");
            return false;
        }


        // Check for start_time
        if (new Date(contestDetails.start_time || currDateISOString).getTime() < (new Date(currDateISOString).getTime() + 2 * 24 * 60 * 60 * 1000)) {
            toast.error("Please Enter Start Date in Future From Current Date. Atleast 2 Days Future Date is Required");
            console.log("Sorry! Atleast 2 Days Future Date From Current Date is Required");
            return false;
        }

        // Check for end_time
        if (new Date(contestDetails.end_time || currDateISOString).getTime() < (new Date(contestDetails.start_time).getTime() + 4 * contestDetails.duration)) {
            toast.error("Please Enter End Date in Future From Start Date. Atleast 4 Times Duration of Contest Start Date is Required");
            console.log("Sorry! Atleast 4 Times Duration of Contest Future Date From the Start Date is Required");
            return false;
        }

        // Check for support_end_time
        if (new Date(contestDetails.support_end_time || currDateISOString).getTime() < (new Date(contestDetails.end_time).getTime() + 8 * contestDetails.duration)) {
            toast.error("Please Enter Support End Date in Future From End Date Atleast 8 Times Duration of Contest End Date is Required");
            console.log("Sorry! Atleast 8 Times Duration of Contest Future Date From the End Date is Required");
            return false;
        }

        // Check for support_team
        if (contestDetails.support_team.length < 1) {
            toast.error("Please Provide Atleast 1 Support Team Member. Required in Contest");
            console.log("Sorry! Atleast 1 Support Team Member is Required in Contest");
            return false;
        }

        // Check for problems
        if (contestDetails.problems.length < 1) {
            toast.error("Please Provide Atleast 1 Problem. Required in Contest");
            console.log("Sorry! Atleast 1 Problem is Required in Contest");
            return false;
        }

    };

    const handleClickOnCreateContestButton = async () => {
        console.log("Inside handleClickOnCreateContestButton()....");

        if (await isContestDetailsValid() === false) {
            await sleep(1000);
            console.log("Invalid Contest Details....");
            // toast.error("Please Fill Correct Details....");
            return;
        }

        toast.success("All Data Valid");
        console.log(contestDetails);

        // Pre Process the "contestDetails" for numeric inputs
        const payload = {
            ...contestDetails,
        };

        // console.log("Payload: ");
        // console.log(payload);

        try {

            console.log("Payload For the API Call: ");
            console.log(payload);

            console.log({
                "Content-Type": "application/json",
                "client-id": clientId,
                "authorization": token,
            });


            const response = await axios.post(`${API_BASE}/contests/control/create`, payload, {
                headers: {
                    "Content-Type": "application/json",
                    "client-id": clientId,
                    "authorization": token,
                }
            })

            // console.log("Response From the CONTESTS' API Call: ");
            // console.log(response);
            toast.success(response.data.message);

        } catch (error) {
            console.log(error);
            console.log("Something Went Wrong While Making the CONTESTS' API Call....", error);
            toast.error("Something went Wrong....");
        }


    };


    const handleChangeInContestFormValues = async (e) => {
        // console.log(e);
        // console.log(e.target);
        console.log(e.target.id);


        const idOfElementInContestForm = e.target.id;


        setContestDetails((prev) => {
            const newContestDetails = {
                ...prev,
                [idOfElementInContestForm]: e.target.value,
            };
            return newContestDetails;
        });

        console.log(contestDetails);


    };





    // If the WebSocket Connection Changes then Please Fetch All the Support Users, Private Problems Again
    useEffect(() => {
        const fetchAllSupportRoleUsers = async () => {
            const payload = {
                role: "SUPPORT",
            };
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

        const fetchAllPrivateProblems = async () => {
            const payload = {
                is_public: false,
            };
            try {
                const response = await axios.post(`${API_BASE}/problems/control/search`, payload, {
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
            fetchAllSupportRoleUsers();
            fetchAllPrivateProblems();
        }

    }, [token, user, isConnected, clientId]);




    // Websocket Event Listening Logic - Starts Here

    // Listener 1: Handle Valid Create Contest's Response
    useSocketListener(
        // Selector: "Is this message for me?"
        (msg) => msg.type?.includes('response') && msg.metadata.operation?.includes("contests.control.create"),

        // Handler: "What do I do with it?"
        async (msg) => {
            // Clear the Previous Toast Notifications
            toast.dismiss();

            const { data, metadata } = msg;

            // If Create Contest's is Success then Save The Contest For further Accesses 
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

                // navigate to Contest's details page
                navigate(`/admins/control-panel/contests/${contestDetailsFromEventData.slug}`);



            }
            // Else Request Processing is not done then Tell User What May Went Wrong
            else {
                console.log(data);
                console.log(metadata);

                toast.error(metadata.message);
                await sleep(1000);
                toast.error("Seems Like Contest Not Created....");
                await sleep(1000);

            }
        }
    );


    // Listener 2: Handle Valid Get Support Role User's List Response
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

                setSupportUsersList(() => {
                    const newSupportUsersList = allUsersFromEventData.map((user, index) => {
                        return {
                            ...user
                        };
                    });

                    return newSupportUsersList;
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

    // Listener 3: Handle Valid Get All Private Problems' List Response
    useSocketListener(
        // Selector: "Is this message for me?"
        (msg) => msg.type?.includes('response') && msg.metadata.operation?.includes("problems.control.search"),

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

                setProblemsList(() => {
                    const newProblemsList = allProblemsFromEventData.map((problem, index) => {
                        return { ...problem };
                    });

                    return newProblemsList;
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
        <ControlPanelLayout
            activeMenuOptionId={'contests'}
        >

            {/* Control Panel's Details Section - Starts Here */}

            {/* Contest's Form Input Section - Starts Here */}
            <div className="flex flex-col items-center px-2 lg:px-4">

                <Heading
                    text={`Create Contest`}
                />

                <div className="w-full overflow-x-auto mt-8 px-2 lg:px-4 py-16 lg:py-8">

                    {contestDetails ? <>

                        <div className="mb-16 text-nowrap flex flex-col gap-4">

                            <div className="flex flex-row gap-2">
                                <h3 className="text-lg lg:text-xl poppins-semibold">
                                    name :
                                </h3>
                                <TextInput
                                    id={`name`}
                                    placeholderText={`Please give Contest's Unique Name like: AllSpark Contest 1, AllSpark Contest 2,....`}
                                    value={contestDetails.name}
                                    onValueChange={handleChangeInContestFormValues}
                                />
                            </div>


                            <div className="flex flex-row gap-2">
                                <h3 className="text-lg lg:text-xl poppins-semibold">
                                    slug :
                                </h3>
                                <TextInput
                                    id={`slug`}
                                    placeholderText={`Please give Contest's Unique Slug like: allspark-contest-1, allspark-contest-2,....`}
                                    value={contestDetails.slug}
                                    onValueChange={handleChangeInContestFormValues}
                                />
                            </div>


                            <div className="flex flex-col gap-2">
                                <h3 className="text-lg lg:text-xl poppins-semibold">
                                    description :
                                </h3>
                                <TextAreaInput
                                    id={`description`}
                                    placeholderText={`Please give Contest's Description like: We have....`}
                                    value={contestDetails.description}
                                    onValueChange={handleChangeInContestFormValues}
                                />
                            </div>


                            <div className="flex flex-col gap-2">
                                <h3 className="text-lg lg:text-xl poppins-semibold">
                                    start_time :
                                </h3>
                                <DateTimeInput
                                    id={`start_time`}
                                    placeholderText={`Please give Contest's Start Time"`}
                                    value={contestDetails.start_time}
                                    onValueChange={handleChangeInContestFormValues}
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <h3 className="text-lg lg:text-xl poppins-semibold">
                                    end_time :
                                </h3>
                                <DateTimeInput
                                    id={`end_time`}
                                    placeholderText={`Please give Contest's End Time"`}
                                    value={contestDetails.end_time}
                                    onValueChange={handleChangeInContestFormValues}
                                />
                            </div>


                            <div className="flex flex-col gap-2">
                                <h3 className="text-lg lg:text-xl poppins-semibold">
                                    duration :
                                </h3>
                                <NumericInput
                                    id={`duration`}
                                    placeholderText={`Please give Contest's Duration in MilliSeconds`}
                                    value={contestDetails.duration}
                                    onValueChange={handleChangeInContestFormValues}
                                />
                            </div>


                            <div className="flex flex-col gap-2">
                                <h3 className="text-lg lg:text-xl poppins-semibold">
                                    support_end_time :
                                </h3>
                                <DateTimeInput
                                    id={`support_end_time`}
                                    placeholderText={`Please give Contest's Support End Time"`}
                                    value={contestDetails.support_end_time}
                                    onValueChange={handleChangeInContestFormValues}
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <h3 className="text-lg lg:text-xl poppins-semibold">
                                    support_team :
                                </h3>
                                <MultiSelectCheckBoxInput
                                    id={`support_team`}
                                    placeholderText={`Please Provide Contest's Support Team Members"`}
                                    value={[]} // Array of values in this input Array of Id of Support Team User 
                                    onValueChange={(newValue) => {
                                        setContestDetails((prev) => {
                                            return {
                                                ...prev,
                                                [`support_team`]: newValue,
                                            };
                                        });
                                    }}
                                    options={supportUsersList.map((supportUser) => {
                                        return {
                                            value: supportUser._id,
                                            displayComponent: <>
                                                <div className="flex flex-col gap-1">
                                                    <h3 className="text-lg lg:text-xl poppins-semibold">
                                                        {supportUser.name}
                                                    </h3>
                                                    <p className="flex flex-col gap-2">
                                                        {supportUser.role}
                                                    </p>
                                                </div>
                                            </>,
                                        };
                                    })}
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <h3 className="text-lg lg:text-xl poppins-semibold">
                                    problems :
                                </h3>
                                <MultiSelectCheckBoxInput
                                    id={`problems`}
                                    placeholderText={`Please Provide Contest's Problems"`}
                                    value={[]} // Array of values in this input Array of Id of Problems 
                                    onValueChange={(newValue) => {
                                        setContestDetails((prev) => {
                                            return {
                                                ...prev,
                                                [`problems`]: newValue,
                                            };
                                        });
                                    }}
                                    options={problemsList.map((problem) => {
                                        return {
                                            value: problem._id,
                                            displayComponent: <>
                                                <div className="flex flex-col gap-1">
                                                    <h3 className="text-lg lg:text-xl poppins-semibold">
                                                        {problem.name}
                                                    </h3>
                                                    <p className="flex flex-col gap-2">
                                                        {problem.slug}
                                                    </p>
                                                </div>
                                            </>,
                                        };
                                    })}
                                />
                            </div>


                            <br />
                            <br />

                            <button
                                onClick={handleClickOnCreateContestButton}
                                className="transition-all duration-[0.4s] ease-in-out hover:scale-[1.02] active:scale-[0.8] cursor-pointer py-2 lg:py-4 px-8 lg:px-16 text-lg lg:text-2xl text-white rounded-full disabled:opacity-[0.2] text-center poppins-semibold custom-smooth-drop-shadow primary-gradient-bg">
                                Create
                            </button>

                        </div>

                    </> : <>
                        <h2 className="text-xl">Sorry! Seems like Something Went Wrong....</h2>
                    </>}

                </div>
            </div>
            {/* Contest's Form Input Section - Ends Here */}


            {/* Control Panel's Details Section - Ends Here */}
        </ControlPanelLayout>
    </>
};

export default ControlPanelContestCreate;