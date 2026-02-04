import React, { useState } from "react";
import Layout from "../../../components/layout/Layout";
import techCubeImage from "../../../assets/images/tech-cube.png";
import TextInput from "../../../components/input/TextInput";
import { useWebSocketContext } from "../../../contexts/WebSocketContext";

import axios from "axios";
import { useAuthContext } from "../../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";


const LogOut = () => {

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
        confirmationField: "",
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

    const isValidLogoutFormData = (loginFormData) => {
        if (formData.confirmationField === "logout") {
            return true;
        }

        return false;
    };

    const handleLogoutFormSubmitButtonClick = async (e) => {
        e.preventDefault();


        console.log("Hello Form Is Submitted....");
        console.log("WebSocket Id is: ", clientId);

        if (isValidLogoutFormData(formData) === true) {

            // Destroy User and Token From Client Side & localStorage When Logout is Clicked
            localStorage.removeItem("user");
            localStorage.removeItem("token");

            setToken(null);
            setUser(null);

            // Show toast notification that logged out Successully
            toast.success("Logged Out Successfully....");
            
            // Sleep for 1s to show notification
            await sleep(1000);
            
            // After Successful Logout Navigate to Previous Page
            navigateToPreviousPage();
        }
        else {
            // alert("Please Type 'logout' to confirm logout or else explore more....");
            toast.warning("Please Type 'logout' to confirm logout or else explore more....");
        }


    };




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

                    <div className="flex flex-col gap-2">
                        <h2 className="text-2xl poppins-semibold">
                            Hi, {user?.name || "Anonymous"}
                        </h2>
                        <h3 className="text-xl poppins-medium">
                            Your'e about to Logout
                        </h3>
                    </div>

                    <form className="flex flex-col gap-4">
                        <TextInput
                            id={`confirmationField`}
                            onValueChange={onInputChangeOfForm}
                            value={`${formData.confirmationField}`}
                            placeholderText={`Type 'logout' to Confirm....`}
                        />


                        <button onClick={handleLogoutFormSubmitButtonClick} className="transition-all duration-[0.4s] ease-in-out hover:scale-[1.02] active:scale-[0.8] bg-[#135BEB] cursor-pointer py-3 mt-8 lg:py-4 px-18 lg:px-20 text-lg lg:text-xl text-white rounded-full poppins-semibold custom-smooth-drop-shadow">
                            Logout
                        </button>

                    </form>


                </div>
                {/* Form Inputs Section - Ends Here */}



            </div>
            {/* Sign Up Form Section - Ends Here */}
        </Layout>
    </>;
};


export default LogOut;