import React from "react";
import { Link } from "react-router-dom";
import gitHubIcon from "../../../assets/icons/github-icon.png"
import gMailIcon from "../../../assets/icons/gmail-icon.png"
import linkedinIcon from "../../../assets/icons/linkedin-icon.png"

const Footer = () => {
    return <>

        <div className="flex flex-col gap-16 lg:flex-row justify-between px-16 py-8 mt-4 border border-t-2 border-[#0a17321a]">
            <div className="flex flex-col gap-2">
                <div className="text-3xl lg:text-4xl poppins-bold">
                    AllSpark
                </div>

                <div className="flex flex-row gap-4">


                    <a href="https://github.com/harshkumar123456" className='text-blue-400 underline'>
                        <img src={gitHubIcon} alt="github-icon" className='object-cover w-8' />
                    </a>


                    <a href="mailto:harshkumar92200@gmail.com" className='text-blue-400 underline'>
                        <img src={gMailIcon} alt="gmail-icon" className='object-cover w-8' />
                    </a>


                    <a href="https://www.linkedin.com/in/harshku007" className='text-blue-400 underline'>
                        <img src={linkedinIcon} alt="linkedin-icon" className='object-cover w-8' />
                    </a>

                </div>


            </div>
            <div className="flex flex-col gap-2">

                <div className="text-sm lg:text-xl text-[#0a1732cc] poppins-regular">
                    Copyright © {new Date().getFullYear()} AllSpark Org. All rights reserved
                </div>
                <div className="mt-4 flex flex-col gap-2 text-xs lg:text-sm text-[#0a1732cc] poppins-regular">
                    <Link to={"/privacy-policy"}>Privacy Policy</Link>
                    <Link to={"/tnc"}>Terms & Conditions</Link>
                    <Link to={"/contact-us"}>Contact Us</Link>
                </div>
            </div>
        </div>

    </>;
};


export default Footer;