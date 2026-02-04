import React, { useState } from "react";
import Layout from "../../../components/layout/Layout";
import techCubeImage from "../../../assets/images/tech-cube.png";
import TextInput from "../../../components/input/TextInput";
import EmailInput from "../../../components/input/EmailInput";
import MobileNumberInput from "../../../components/input/MobileNumberInput";
import PasswordInput from "../../../components/input/PasswordInput";


const Login = () => {
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

    const handleLoginFormSubmitButtonClick = (e) => {
        e.preventDefault();

        console.log("Hello Form Is Submitted....");

        console.log(formData);
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


                        <button onClick={handleLoginFormSubmitButtonClick} className="bg-[#135BEB] cursor-pointer py-3 mt-8 lg:py-4 px-18 lg:px-20 text-lg lg:text-xl text-white rounded-full poppins-semibold custom-smooth-drop-shadow">
                            Login
                        </button>

                    </form>


                </div>
                {/* Form Inputs Section - Ends Here */}



            </div>
            {/* Sign Up Form Section - Ends Here */}
        </Layout>
    </>;
};


export default Login;