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


const SignUp = () => {
    const API_BASE = "http://localhost:8000/api/v1"

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
        console.log("Hello Brother yo change ho raha hai....", e.target.id);

        setFormData((prev) => {
            const updatedFormData = {
                ...prev,
                [idOfInput]: valueOfInput,
            };

            return updatedFormData;
        });


    };


    const isValidSignUpFormData = (signupFormData) => {
        return true;
    };

    const handleSignUpFormSubmitButtonClick = async (e) => {
        e.preventDefault();

        console.log("Hello Form Is Submitted....");
        console.log("WebSocket Id is: ", clientId);


        // Make Signup Request to API 
        try {

            if (isValidSignUpFormData(formData) === true) {
                console.log("Signup API Call is Being Made....");

                const res = await axios.post(`${API_BASE}/auth/signup`, {
                    name: formData.name,
                    user_name: formData.userName,
                    email: formData.email,
                    password: formData.password,
                    mobile_no: formData.mobileNo,
                }, {
                    headers: {
                        "Content-Type": "application/json",
                        "client-id": clientId
                    }
                });

                /*
                {
                    method: "POST",
                        headers: { "Content-Type": "application/json", },
                    body: JSON.stringify({ ...formData }),
                });
                */


                console.log("Response From the AUTH API Call: ");
                console.log(res);


            }
            else {
                alert("Sorry Form Data Is Not Valid....");
            }


        } catch (error) {
            console.log(error);
            console.log("Something Went Wrong While Making the AUTH API Call....", error);
        }


        console.log(formData);
    };





    // Websocket Event Listening Logic - Starts Here
    // Listener 1: Handle Valid Signup Response
    useSocketListener(
        // Selector: "Is this message for me?"
        (msg) => msg.type?.includes('response'),

        // Handler: "What do I do with it?"
        (msg) => {
            console.log("Bhai We got the Message As: ");
            console.log(msg);
        }
    );


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

                        <button onClick={handleSignUpFormSubmitButtonClick} className="bg-[#135BEB] cursor-pointer py-3 mt-8 lg:py-4 px-18 lg:px-20 text-lg lg:text-xl text-white rounded-full poppins-semibold custom-smooth-drop-shadow">
                            Sign Up
                        </button>

                    </form>


                </div>
                {/* Form Inputs Section - Ends Here */}



            </div>
            {/* Sign Up Form Section - Ends Here */}
        </Layout>
    </>;
};


export default SignUp;