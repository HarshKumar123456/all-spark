import React, { useEffect } from "react";
import { useAuthContext } from "../../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { useWebSocketContext } from "../../contexts/WebSocketContext";
import { toast } from "sonner";



const ControlPanelLayout = ({ children, activeMenuOptionId }) => {

    const sleep = async (milliSeconds) => {
        return new Promise((resolve) => setTimeout(resolve, milliSeconds));
    };

    const { token, user, setUser } = useAuthContext();

    let navigate = useNavigate();

    const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000/api/v1";

    const { isConnected, clientId } = useWebSocketContext();

    // Please Note: Edit this If Any Other Role Can Access the Control Panel 
    const controlPanelAllowedUserRoles = ["ADMIN", "CONTEST_SCHEDULER", "SUPPORT"];

    if (!activeMenuOptionId) {
        activeMenuOptionId = "overview";
    }




    // Whenever User, Token changes check if the user's details are there or not and if not then redirect to login page
    useEffect(() => {

        if (!user || (user && !(controlPanelAllowedUserRoles.includes(user.role)))) {
            toast.error("Sorry! You Need to login with Admin Account to Access The Control Panel....");
            navigate("/login");

            return;
        }

        // Also Check if we are connected to WebSocket Or not
        if (!(isConnected && clientId)) {
            toast.error("Sorry! Websocket Connection is broken....");

            return;
        }


    }, [token, user, isConnected, clientId]);

    return <>

        {/* Header Section - Starts Here */}
        <div className="flex flex-row justify-between items-center px-8 lg:px-16 py-4 lg:py-8 border border-b-1 border-[#0a173233]">

            {/* Logo - Starts Here */}
            <Link to={"/"}>
                <div className="text-3xl lg:text-4xl poppins-bold primary-gradient-text">AllSpark</div>
            </Link>
            {/* Logo - Ends Here */}


            {/* User's Name and Username Section - Starts Here */}
            <div className="w-1/2 flex flex-col">
                {/* User's Name Section - Starts Here */}
                <h2 className="text-center text-xl lg:text-2xl poppins-bold">
                    Hi, {user?.name || "Anonymous"}
                </h2>
                {/* User's Name Section - Ends Here */}


                {/* Username Section - Starts Here */}
                <p className="text-center text-xs lg:text-sm black-80-text poppins-semibold">
                    {user?.user_name || "Anonymous"}
                </p>
                {/* Username Section - Ends Here */}
            </div>
            {/* User's Name and Username Section - Ends Here */}


            {/* User's Role Section - Starts Here */}
            <h2 className="px-2 lg:px-4 py-1 lg:py-2 border border-1 border-[#0a173233] rounded-xl text-center text-xl lg:text-2xl black-100-text poppins-semibold">
                {user?.role || "Anonymous"}
            </h2>
            {/* User's Role Section - Ends Here */}




        </div>
        {/* Header Section - Ends Here */}


        {/* Body Section - Starts Here */}
        <div className="w-full flex flex-col lg:flex-row gap-4 px-8 lg:px-16 py-4 lg:py-8">

            {/* Control Panel Menu Section - Starts Here */}
            <div className="w-70 flex flex-col gap-8 text-nowrap">

                <ul className="flex flex-col gap-4">
                    <Link to={"/admins/control-panel/overview"}>
                        <li
                            id="overview"
                            className={`transition-all duration-[0.4s] ease-in-out hover:scale-[1.02] active:scale-[0.8] cursor-pointer border border-1 border-[#0a173233] hover:border-[#0a1732cc] rounded-xl px-2 lg:px-4 py-1 lg:py-2 ${activeMenuOptionId === "overview" ? "scale-[1.08] border-[#0a1732]" : "opacity-[0.8]"}`}
                        >
                            Overview
                        </li>
                    </Link>


                    {/* <Link to={"/admins/control-panel/special-access"}>
                        <li
                            id="specialAccess"
                            className={`transition-all duration-[0.4s] ease-in-out hover:scale-[1.02] active:scale-[0.8] cursor-pointer border border-1 border-[#0a173233] hover:border-[#0a1732cc] rounded-xl px-2 lg:px-4 py-1 lg:py-2 ${activeMenuOptionId === "specialAccess" ? "scale-[1.08] border-[#0a1732]" : "opacity-[0.8]"}`}
                        >
                            Special Access
                        </li>
                    </Link> */}


                    {/* <Link to={"/admins/control-panel/support-tickets"}>
                        <li
                            id="supportTickets"
                            className={`transition-all duration-[0.4s] ease-in-out hover:scale-[1.02] active:scale-[0.8] cursor-pointer border border-1 border-[#0a173233] hover:border-[#0a1732cc] rounded-xl px-2 lg:px-4 py-1 lg:py-2 ${activeMenuOptionId === "supportTickets" ? "scale-[1.08] border-[#0a1732]" : "opacity-[0.8]"}`}
                        >
                            Support Tickets
                        </li>
                    </Link> */}


                    <Link to={"/admins/control-panel/users"}>
                        <li
                            id="users"
                            className={`transition-all duration-[0.4s] ease-in-out hover:scale-[1.02] active:scale-[0.8] cursor-pointer border border-1 border-[#0a173233] hover:border-[#0a1732cc] rounded-xl px-2 lg:px-4 py-1 lg:py-2 ${activeMenuOptionId === "users" ? "scale-[1.08] border-[#0a1732]" : "opacity-[0.8]"}`}
                        >
                            Users
                        </li>
                    </Link>

                    <Link to={"/admins/control-panel/problems"}>
                        <li
                            id="problems"
                            className={`transition-all duration-[0.4s] ease-in-out hover:scale-[1.02] active:scale-[0.8] cursor-pointer border border-1 border-[#0a173233] hover:border-[#0a1732cc] rounded-xl px-2 lg:px-4 py-1 lg:py-2 ${activeMenuOptionId === "problems" ? "scale-[1.08] border-[#0a1732]" : "opacity-[0.8]"}`}
                        >
                            Problems
                        </li>
                    </Link>


                    {/* <Link to={"/admins/control-panel/contests"}>
                        <li
                            id="contests"
                            className={`transition-all duration-[0.4s] ease-in-out hover:scale-[1.02] active:scale-[0.8] cursor-pointer border border-1 border-[#0a173233] hover:border-[#0a1732cc] rounded-xl px-2 lg:px-4 py-1 lg:py-2 ${activeMenuOptionId === "contests" ? "scale-[1.08] border-[#0a1732]" : "opacity-[0.8]"}`}
                        >
                            Contests
                        </li>
                    </Link> */}


                    {/* <Link to={"/admins/control-panel/permissions"}>
                        <li
                            id="permissions"
                            className={`transition-all duration-[0.4s] ease-in-out hover:scale-[1.02] active:scale-[0.8] cursor-pointer border border-1 border-[#0a173233] hover:border-[#0a1732cc] rounded-xl px-2 lg:px-4 py-1 lg:py-2 ${activeMenuOptionId === "permissions" ? "scale-[1.08] border-[#0a1732]" : "opacity-[0.8]"}`}
                        >
                            Permissions
                        </li>
                    </Link> */}

                </ul>

            </div>
            {/* Control Panel Menu Section - Ends Here */}



            <div className="ms-2 border border-0 lg:border-s-2 w-full overflow-auto border-[#0a173233] w-full min-h-screen">
                
                {children}

            </div>

        </div>
        {/* Body Section - Ends Here */}

    </>;
};


export default ControlPanelLayout;