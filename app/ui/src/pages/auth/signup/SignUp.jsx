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
import { toast } from "sonner";


const SignUp = () => {

    const sleep = async (milliSeconds) => {
        return new Promise((resolve) => setTimeout(resolve, milliSeconds));
    };

    const { token, user, setToken, setUser } = useAuthContext();

    let navigate = useNavigate();

    const navigateToPreviousPage = () => {
        navigate(-1);
    };

    // console.log("Bhai Ye lo Auth Token: ", token);

    const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000/api/v1";

    const { isConnected, clientId } = useWebSocketContext();

    const [formData, setFormData] = useState({
        name: "",
        userName: "",
        email: "",
        mobileNo: "",
        password: "",
        confirmPassword: "",
    });


    const onInputChangeOfForm = (e) => {
        const idOfInput = e.target.id;
        const valueOfInput = e.target.value;
        // console.log("Hello Brother yo change ho raha hai....", e.target.id);

        setFormData((prev) => {
            const updatedFormData = {
                ...prev,
                [idOfInput]: valueOfInput,
            };

            return updatedFormData;
        });


    };


    const isEmail = (identificationFieldText) => {
        const regex = /^[a-zA-Z0-9_.+\-]+[\x40][a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
        const isValid = regex.test(identificationFieldText);
        return isValid;
    };


    const isValidMobileNo = (identificationFieldText) => {
        console.log("Inside Check Valid Phone No. :");
        console.log(identificationFieldText);
        console.log(identificationFieldText.length);
        const isValid = identificationFieldText.length === 10;
        return isValid;
    };


    const isValidSignUpFormData = (signupFormData) => {
        // console.log("Bhai Ye lo Form ka Data Validity Check karne ke liye: ");
        // console.log(signupFormData);

        const { name, userName, email, mobileNo, password, confirmPassword } = signupFormData;

        if (isEmail(email) === false) {
            toast.error("Please Enter Correct Email....");
            return false;
        }

        if(password.length <= 7) {
            toast.error("Password minimum length should be 8....");
            return false;
        }


        if (password !== confirmPassword) {
            toast.error("Password and Confirm Password Doesn't Match....");
            return false;
        }

        if (isValidMobileNo(mobileNo) === false) {
            toast.error("Please Enter a Valid 10 Digit Mobile No....");
            return false;
        }


        return true;
    };

    const handleSignUpFormSubmitButtonClick = async (e) => {
        e.preventDefault();

        // console.log("Hello Form Is Submitted....");
        // console.log("WebSocket Id is: ", clientId);

        const payload = {
            name: formData.name,
            user_name: (formData.userName).toLowerCase(),
            email: (formData.email).toLowerCase(),
            password: formData.password,
            mobile_no: formData.mobileNo,
        };


        // Make Signup Request to API 
        try {

            if (isValidSignUpFormData(formData) === true) {
                console.log("Signup API Call is Being Made....");

                const res = await axios.post(`${API_BASE}/auth/signup`, payload, {
                    headers: {
                        "Content-Type": "application/json",
                        "client-id": clientId
                    }
                });

                // console.log("Response From the AUTH API Call: ");
                // console.log(res);
                toast.success(res.data.message);


            }
            else {
                // alert("Sorry Form Data Is Not Valid....");
                toast.warning("Sorry Form Data Is Not Valid....");
            }


        } catch (error) {
            console.log(error);
            console.log("Something Went Wrong While Making the AUTH API Call....", error);
            toast.error("Something went Wrong....");
        }


        console.log(formData);
    };





    // Websocket Event Listening Logic - Starts Here
    // Listener 1: Handle Valid Signup Response
    useSocketListener(
        // Selector: "Is this message for me?"
        (msg) => msg.type?.includes('response') && msg.metadata.operation?.includes("signup"),

        // Handler: "What do I do with it?"
        async (msg) => {
            const { data, metadata } = msg;

            // If Signup is Success then Save The Token For further Accesses 
            if (metadata?.success === true) {
                // alert("Signed up Successfully....");
                console.log(data);
                console.log(metadata);

                // Setting token into the localStorage
                const tokenFromEventData = data.token;
                const userFromEventData = data.result;
                localStorage.setItem("token", JSON.stringify(tokenFromEventData));
                localStorage.setItem("user", JSON.stringify(userFromEventData));
                setToken(tokenFromEventData);
                setUser(userFromEventData);

                // Show Toast Notification that Successfully Signed Up
                toast.success(metadata.message);

                // Sleep for 1s to show Toast Notification
                await sleep(1000);

                // After Successful Login Redirect the User to the Previous Page From where he Needed to Login
                navigateToPreviousPage();
            }
            // Else Signup is not done then Tell User What May Went Wrong
            else {
                // alert("Probably The Username or Email is taken Please Changing One or Both Of Them....");
                console.log(data);
                console.log(metadata);

                toast.error(metadata.message);
                await sleep(1000);
                toast.error("Seems Like You Already Have An Account....");
                await sleep(1000);
                toast.error("Please try changing Username and/or Email....");
                await sleep(1000);

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
                            id={`name`}
                            onValueChange={onInputChangeOfForm}
                            value={`${formData.name}`}
                            placeholderText={`Name like: Harsh Kumar`}
                        />
                        <TextInput
                            id={`userName`}
                            onValueChange={onInputChangeOfForm}
                            value={`${formData.userName}`}
                            placeholderText={`Username like: harshku007`}
                        />
                        <EmailInput
                            id={`email`}
                            onValueChange={onInputChangeOfForm}
                            value={`${formData.email}`}
                            placeholderText={`Email like: harshkumar922200@gmail.com`}
                        />
                        <MobileNumberInput
                            id={`mobileNo`}
                            onValueChange={onInputChangeOfForm}
                            value={`${formData.mobileNo}`}
                            placeholderText={`Phone No. like: 7275589766`}
                        />
                        <PasswordInput
                            id={`password`}
                            onValueChange={onInputChangeOfForm}
                            value={`${formData.password}`}
                            placeholderText={`Password like: @#$h143r`}
                        />
                        <PasswordInput
                            id={`confirmPassword`}
                            onValueChange={onInputChangeOfForm}
                            value={`${formData.confirmPassword}`}
                            placeholderText={`Confirm Password`}
                        />

                        <button onClick={handleSignUpFormSubmitButtonClick} className="transition-all duration-[0.4s] ease-in-out hover:scale-[1.02] active:scale-[0.8] bg-[#135BEB] cursor-pointer py-3 mt-8 lg:py-4 px-18 lg:px-20 text-lg lg:text-xl text-white rounded-full poppins-semibold custom-smooth-drop-shadow">
                            Sign Up
                        </button>

                    </form>



                     {/* Already Have an Account Login Section - Starts Here */}
                    <p className="text-center text-lg poppins-medium">
                        Already Have an Account
                        <Link
                        to={"/login"}
                        className="ms-2 text-xl poppins-semibold primary-gradient-text"
                        >
                            Login Here
                        </Link>
                    </p>
                    {/* Already Have an Account Login Section - Ends Here */}


                </div>
                {/* Form Inputs Section - Ends Here */}



            </div>
            {/* Sign Up Form Section - Ends Here */}
        </Layout>
    </>;
};


export default SignUp;