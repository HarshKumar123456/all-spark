import React, { useState } from "react";
import Layout from "../../../components/layout/Layout";
import techCubeImage from "../../../assets/images/tech-cube.png";
import TextInput from "../../../components/input/TextInput";
import EmailInput from "../../../components/input/EmailInput";
import MobileNumberInput from "../../../components/input/MobileNumberInput";
import PasswordInput from "../../../components/input/PasswordInput";
import { useWebSocketContext } from "../../../contexts/WebSocketContext";
import { useSocketListener } from "../../../hooks/useSocketListener";

import axios from "axios";
import { useAuthContext } from "../../../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";


// For Toast Notification & Sorry if You were Expecting some other package here for this use case :)
import { toast } from 'sonner';




const Login = () => {
    const sleep = async (milliSeconds) => {
        return new Promise((resolve) => setTimeout(resolve, milliSeconds));
    };


    const { token, user, setToken, setUser } = useAuthContext();

    let navigate = useNavigate();

    const navigateToPreviousPage = () => {
        navigate(-1);
    };

    const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000/api/v1";

    const { isConnected, clientId } = useWebSocketContext();

    const [formData, setFormData] = useState({
        identificationField: "",
        password: "",
    });


    const onInputChangeOfForm = (e) => {
        const idOfInput = e.target.id;
        const valueOfInput = e.target.value;
        console.log("Hello Brother yo change ho raha hai....", e.target.id);

        setFormData((prev) => {
            const updatedFormData = {
                ...prev,
                [idOfInput]: valueOfInput,
            };

            return updatedFormData;
        });


    };


    const isValidLoginFormData = (loginFormData) => {
        const { identificationField, password } = loginFormData;

        if (password.length <= 7) {
            toast.error("Password minimum length should be 8....");
            sleep(1000);
            return false;
        }


        console.log("Checked Form Data returning true....");
        return true;
    };

    const isEmail = (identificationFieldText) => {
        const regex = /^[a-zA-Z0-9_.+\-]+[\x40][a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
        const isValid = regex.test(identificationFieldText);
        return isValid;
    };

    const handleLoginFormSubmitButtonClick = async (e) => {
        e.preventDefault();


        console.log("Hello Form Is Submitted....");
        console.log("WebSocket Id is: ", clientId);

        const payload = {
            password: formData.password,
        };

        if (isEmail(formData.identificationField) === true) {
            payload.email = (formData.identificationField).toLowerCase();
        }
        else {
            payload.user_name = (formData.identificationField).toLowerCase();
        }


        // Make Signup Request to API 
        try {
            const valueAfterFormCheck = isValidLoginFormData(formData);
            console.log("Value After Form Check: ", valueAfterFormCheck);
            if (valueAfterFormCheck === true) {
                console.log("Login API Call is Being Made....");

                const res = await axios.post(`${API_BASE}/auth/login`, payload, {
                    headers: {
                        "Content-Type": "application/json",
                        "client-id": clientId
                    }
                });



                // console.log("Response From the AUTH API Call: ");
                // console.log(res);

                toast.success(res.data.message);
                await sleep(1000);
                
            }
            else {
                // alert("Sorry Form Data Is Not Valid....");
                toast.warning("Sorry Form Data Is Not Valid....");
                console.log(formData);
                await sleep(1000);
            }


        } catch (error) {
            console.log(error);
            console.log("Something Went Wrong While Making the AUTH API Call....", error);
            toast.error("Something Went Wrong....");
            await sleep(1000);
        }


        console.log(formData);
    };





    // Websocket Event Listening Logic - Starts Here
    // Listener 1: Handle Valid Signup Response
    useSocketListener(
        // Selector: "Is this message for me?"
        (msg) => msg.type?.includes('response') && msg.metadata.operation?.includes("login"),

        // Handler: "What do I do with it?"
        async (msg) => {
            const { data, metadata } = msg;

            // If Signup is Success then Save The Token For further Accesses 
            if (metadata?.success === true) {
                // alert("Logged In Successfully....");
                console.log(data);
                console.log(metadata);

                // Setting token into the localStorage
                const tokenFromEventData = data.token;
                const userFromEventData = data.result;
                localStorage.setItem("token", JSON.stringify(tokenFromEventData));
                localStorage.setItem("user", JSON.stringify(userFromEventData));
                setToken(tokenFromEventData);
                setUser(userFromEventData);



                // Show Sonner Toast Notification
                toast.success(metadata.message);

                // sleep for 1s to show the Toast Notification that logged in Successfully
                await sleep(1000);

                // After Successful Login Redirect the User to the Previous Page From where he Needed to Login
                navigateToPreviousPage();
            }
            // Else Signup is not done then Tell User What May Went Wrong
            else {
                // alert("Probably The Username or Email and/or Password is not valid....");
                toast.error(metadata.message);
                await sleep(1000);

                console.log(data);
                console.log(metadata);
            }
        }
    );

    // Websocket Event Listening Logic - Ends Here

    return <>
        <Layout>
            {/* Sign Up Form Section - Starts Here */}
            <div className="flex flex-row items-center px-8 lg:px-16 py-16 lg:py-8">
                {/* Image Section - Starts Here */}
                <div className="hidden lg:w-1/2 lg:flex flex-col items-center">
                    <img src={techCubeImage} alt="decorative image showing the technology illustration via a cube bursting out" className="object-fill rounded-lg" />
                </div>
                {/* Image Section - Ends Here */}


                {/* Form Inputs Section - Starts Here */}
                <div className="lg:w-1/2 mx-auto flex flex-col gap-16 lg:gap-20 lg:px-24">
                    <form className="flex flex-col gap-4">
                        <TextInput
                            id={`identificationField`}
                            onValueChange={onInputChangeOfForm}
                            value={`${formData.identificationField}`}
                            placeholderText={`Email or Username`}
                        />


                        <PasswordInput
                            id={`password`}
                            onValueChange={onInputChangeOfForm}
                            value={`${formData.password}`}
                            placeholderText={`Password like: @#$h143r`}
                        />


                        <button onClick={handleLoginFormSubmitButtonClick} className="transition-all duration-[0.4s] ease-in-out hover:scale-[1.02] active:scale-[0.8] bg-[#135BEB] cursor-pointer py-3 mt-8 lg:py-4 px-18 lg:px-20 text-lg lg:text-xl text-white rounded-full poppins-semibold custom-smooth-drop-shadow">
                            Login
                        </button>

                    </form>

                    {/* New User Signup Section - Starts Here */}
                    <p className="text-center text-lg poppins-medium">
                        New User ?
                        <Link
                        to={"/signup"}
                        className="ms-2 text-xl poppins-semibold primary-gradient-text"
                        >
                            Sign Up Here
                        </Link>
                    </p>
                    {/* New User Signup Section - Ends Here */}
                </div>
                {/* Form Inputs Section - Ends Here */}



            </div>
            {/* Sign Up Form Section - Ends Here */}
        </Layout>
    </>;
};


export default Login;