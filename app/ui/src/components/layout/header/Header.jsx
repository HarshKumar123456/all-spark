import React, { useState } from "react";
import { Link } from "react-router-dom";
import menuBarIcon from "../../../assets/icons/menu-icon.png";

const Header = () => {
    const [showMobileMenu, setShowMobileMenu] = useState(false);

    const toggleMobileMenuVisibility = () => {
        setShowMobileMenu(!showMobileMenu);
    };

    return <>
        <div className="flex flex-row justify-between items-center px-8 lg:px-16 py-4 lg:py-8 border border-b-1 border-[#0a173233]">
            {/* Logo - Starts Here */}
            <div className="text-3xl lg:text-4xl poppins-bold primary-gradient-text">AllSpark</div>
            {/* Logo - Ends Here */}


            {/* Large Screen Menu - Starts Here */}
            <div className="hidden lg:flex flex-row items-center gap-16">

                {/* Menu Items - Starts Here */}
                <ul className="flex flex-row gap-8">
                    <Link to="/">
                        <li className="text-xl poppins-regular">
                            Home
                        </li>
                    </Link>

                    <Link to="/about">
                        <li className="text-xl poppins-regular">
                            About
                        </li>
                    </Link>

                    <Link to="/career">
                        <li className="text-xl poppins-regular">
                            Career
                        </li>
                    </Link>

                    <Link to="/problems">
                        <li className="text-xl poppins-regular">
                            Problems
                        </li>
                    </Link>

                    <Link to="/contests">
                        <li className="text-xl poppins-regular">
                            Contests
                        </li>
                    </Link>

                </ul>
                {/* Menu Items - Ends Here */}


                {/* Sign Up & Login Buttons - Starts Here */}
                <div className="flex flex-row flex-nowrap gap-4">
                    <Link to={"/signup"} className="text-center px-8 py-2 bg-[#47FF4E] rounded-full text-xl text-white poppins-semibold custom-smooth-drop-shadow">
                        Sign Up
                    </Link>
                    <Link to={"/login"} className="text-center px-8 py-2 rounded-full text-xl text-white poppins-semibold custom-smooth-drop-shadow primary-gradient-bg">
                        Login
                    </Link>
                </div>
                {/* Sign Up & Login Buttons - Ends Here */}

            </div>
            {/* Large Screen Menu - Ends Here */}


            {/* Small Screen Menu Visibility Control Icon - Starts Here */}
            <div className="lg:hidden cursor-pointer">
                <img
                    onClick={toggleMobileMenuVisibility}
                    className="w-6 object-fit"
                    src={menuBarIcon}
                    alt="Menu bar Icon"
                />
            </div>
            {/* Small Screen Menu Visibility Control Icon - Ends Here */}


        </div>

        {/* Small Screen Menu - Starts Here */}
        {showMobileMenu ?
            <>
                <div className="lg:hidden flex flex-col py-12 gap-4">

                    {/* Menu Items - Starts Here */}
                    <ul className="flex flex-col px-16 gap-8">
                        <Link to="/">
                            <li className="border border-0 border-b-1 border-[#0a173233] hover:border-[#0a1732cc] text-xl poppins-regular">
                                Home
                            </li>
                        </Link>

                        <Link to="/about">
                            <li className="border border-0 border-b-1 border-[#0a173233] hover:border-[#0a1732cc] text-xl poppins-regular">
                                About
                            </li>
                        </Link>

                        <Link to="/career">
                            <li className="border border-0 border-b-1 border-[#0a173233] hover:border-[#0a1732cc] text-xl poppins-regular">
                                Career
                            </li>
                        </Link>

                        <Link to="/problems">
                            <li className="border border-0 border-b-1 border-[#0a173233] hover:border-[#0a1732cc] text-xl poppins-regular">
                                Problems
                            </li>
                        </Link>

                        <Link to="/contests">
                            <li className="border border-0 border-b-1 border-[#0a173233] hover:border-[#0a1732cc] text-xl poppins-regular">
                                Contests
                            </li>
                        </Link>
                    </ul>
                    {/* Menu Items - Ends Here */}


                    {/* Sign Up & Login Buttons - Starts Here */}
                    <div className="flex flex-col py-8 px-16 gap-8">
                        <Link to={"/signup"} className="text-center px-8 py-2 bg-[#47FF4E] rounded-full text-xl text-white poppins-semibold custom-smooth-drop-shadow">
                            Sign Up
                        </Link>
                        <Link to={"/login"} className="text-center px-8 py-2 rounded-full text-xl text-white poppins-semibold custom-smooth-drop-shadow primary-gradient-bg">
                            Login
                        </Link>
                    </div>
                    {/* Sign Up & Login Buttons - Ends Here */}

                </div>
            </>
            : <></>}
        {/* Small Screen Menu - Ends Here */}
    </>;
};


export default Header;