import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import CodeEditor from "../../components/editor/CodeEditor";
import { useAuthContext } from "../../contexts/AuthContext";

const ProblemEditor = () => {

    const { token, user } = useAuthContext();

    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const { slug } = useParams();


    const [visiblePart, setVisiblePart] = useState({
        problemDescription: true,
        problemSubmissions: false,
    });

    const problemPublicTestCases = [

    ];

    const [showSubmissionsToThisProblem, setShowSubmissionsToThisProblem] = useState(false);



    // This Marks Visibility of All the Content As False on the First Half of the Page
    const hideAllContent = () => {
        setVisiblePart((prev) => {
            const newVisiblePart = {};
            for (let part in prev) {
                newVisiblePart[part] = false;
            }
            return newVisiblePart;
        })
    }


    const handleClickOnVisiblePartControls = (visiblePart) => {
        hideAllContent();
        setVisiblePart((prev) => {
            const newVisiblePart = { ...prev, [visiblePart]: true };
            return newVisiblePart;
        })
    };


    // If token or User is Changed then Update the Info Who is Logged in User's Information onto the Header
    useEffect(() => {
        setIsLoggedIn((token && user) ? true : false);
        console.log("Yo Bro We Got User: ");
        console.log(user);
    }, [token, user]);


    return <>
        {/* Navigation & Run and Submit Control Button Part - Starts Here */}
        <div className="px-8 py-2 border border-0 border-b-1 border-[#0a173266] flex flex-row items-center justify-between">
            {/* Logo - Starts Here */}
            <Link to={"/"} className="poppins-bold text-2xl primary-gradient-text">
                AllSpark
            </Link>
            {/* Logo - Ends Here */}

            <div className="lg:w-4/7 flex flex-row gap-4 items-center justify-between">

                {/* Run & Submit Button Controls - Starts Here */}
                <div className="flex flex-row text-sm lg:text-normal gap-2 lg:gap-4 poppins-semibold">
                    <button className="transition-all duration-[0.4s] cursor-pointer px-4 py-1 border border-2 border-blue-400 rounded-full hover:border-[#0a1732cc] active:scale-[0.8]">
                        Run
                    </button>
                    <button className="transition-all duration-[0.4s] cursor-pointer px-4 py-1 border border-2 border-green-400 rounded-full hover:border-[#0a1732cc] active:scale-[0.8]">
                        Submit
                    </button>
                </div>
                {/* Run & Submit Button Controls - Ends Here */}





                {(isLoggedIn === true) ? <>
                    {/* User's Profile Icon - Starts Here */}
                    <div className="flex items-center justify-center">
                        <Link to={"/users/dashboard"} className="transition-all duration-[0.4s] ease-in-out hover:scale-[1.08] active:scale-[0.8] cursor-pointer w-12 h-12 flex items-center justify-center rounded-full text-xl text-white poppins-semibold custom-smooth-drop-shadow primary-gradient-bg">
                            {user && (user.name).substr(0, 1)}
                        </Link>
                    </div>
                    {/* User's Profile Icon - Ends Here */}
                </> : <>
                    {/* Sign Up & Login Buttons - Starts Here */}
                    <div className="flex flex-row gap-2">
                        <Link to={"/signup"} className="text-center px-4 py-1 bg-[#47FF4E] rounded-full text-xs lg:text-sm text-white text-nowrap poppins-medium custom-smooth-drop-shadow">
                            Sign Up
                        </Link>
                        <Link to={"/login"} className="text-center px-4 py-1 rounded-full text-xs lg:text-sm text-white poppins-medium custom-smooth-drop-shadow primary-gradient-bg">
                            Login
                        </Link>
                    </div>
                    {/* Sign Up & Login Buttons - Ends Here */}
                </>}
            </div>

        </div>
        {/* Navigation & Run and Submit Control Button Part - Ends Here */}
        <div className="w-full mt-8 px-8 lg:px-16 py-4 lg:py-2 grid grid-cols-1 lg:grid-cols-2 gap-8">



            {/* Problem Details Section - Starts Here  */}
            <div className="flex flex-col gap-4">

                {/* Problem and Submission Navigation Controls - Starts Here */}
                <div className="flex flex-row gap-4 pb-4 border border-0 border-b-2 border-[#0a173266]">
                    <button
                        onClick={() => {
                            handleClickOnVisiblePartControls("problemDescription");
                        }}
                        className={`transition-all duration-[0.4s] cursor-pointer px-4 py-2 border border-1 border-[#0a1732cc] rounded-lg hover:border-[#0a173299] active:scale-[0.8] hover:opacity-[0.8] ${visiblePart.problemDescription ? "scale-[1.08]" : "opacity-[0.4]"}`}>
                        Description
                    </button>
                    <button
                        onClick={() => {
                            handleClickOnVisiblePartControls("problemSubmissions");
                        }}
                        className={`transition-all duration-[0.4s] cursor-pointer px-4 py-2 border border-1 border-[#0a1732cc] rounded-lg hover:border-[#0a173299] active:scale-[0.8] hover:opacity-[0.8] ${visiblePart.problemSubmissions ? "scale-[1.08]" : "opacity-[0.4]"}`}>
                        Submissions
                    </button>
                </div>
                {/* Problem and Submission Navigation Controls - Ends Here */}


                {/* Problem's Dercription - Starts Here */}
                {visiblePart.problemDescription ? <>
                    <div className="pt-2 pe-2 h-[70vh] overflow-y-scroll">

                        Hi i am Problem's Details Part for problem Slug: {slug}
                        <div className="p-4"></div>
                        <div>Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem dolorem, soluta repellendus pariatur, ut quidem minima dicta beatae, voluptates esse ipsam hic! Obcaecati quaerat nihil excepturi aut facere illo, inventore iure ullam dicta placeat odio asperiores cumque necessitatibus debitis in?</div>
                        <div>Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem dolorem, soluta repellendus pariatur, ut quidem minima dicta beatae, voluptates esse ipsam hic! Obcaecati quaerat nihil excepturi aut facere illo, inventore iure ullam dicta placeat odio asperiores cumque necessitatibus debitis in?</div>
                        <div>Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem dolorem, soluta repellendus pariatur, ut quidem minima dicta beatae, voluptates esse ipsam hic! Obcaecati quaerat nihil excepturi aut facere illo, inventore iure ullam dicta placeat odio asperiores cumque necessitatibus debitis in?</div>
                        <div>Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem dolorem, soluta repellendus pariatur, ut quidem minima dicta beatae, voluptates esse ipsam hic! Obcaecati quaerat nihil excepturi aut facere illo, inventore iure ullam dicta placeat odio asperiores cumque necessitatibus debitis in?</div>
                        <div>Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem dolorem, soluta repellendus pariatur, ut quidem minima dicta beatae, voluptates esse ipsam hic! Obcaecati quaerat nihil excepturi aut facere illo, inventore iure ullam dicta placeat odio asperiores cumque necessitatibus debitis in?</div>
                        <div>Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem dolorem, soluta repellendus pariatur, ut quidem minima dicta beatae, voluptates esse ipsam hic! Obcaecati quaerat nihil excepturi aut facere illo, inventore iure ullam dicta placeat odio asperiores cumque necessitatibus debitis in?</div>
                        <div>Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem dolorem, soluta repellendus pariatur, ut quidem minima dicta beatae, voluptates esse ipsam hic! Obcaecati quaerat nihil excepturi aut facere illo, inventore iure ullam dicta placeat odio asperiores cumque necessitatibus debitis in?</div>
                        <div>Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem dolorem, soluta repellendus pariatur, ut quidem minima dicta beatae, voluptates esse ipsam hic! Obcaecati quaerat nihil excepturi aut facere illo, inventore iure ullam dicta placeat odio asperiores cumque necessitatibus debitis in?</div>
                        <div>Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem dolorem, soluta repellendus pariatur, ut quidem minima dicta beatae, voluptates esse ipsam hic! Obcaecati quaerat nihil excepturi aut facere illo, inventore iure ullam dicta placeat odio asperiores cumque necessitatibus debitis in?</div>
                        <div>Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem dolorem, soluta repellendus pariatur, ut quidem minima dicta beatae, voluptates esse ipsam hic! Obcaecati quaerat nihil excepturi aut facere illo, inventore iure ullam dicta placeat odio asperiores cumque necessitatibus debitis in?</div>
                        <div>Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem dolorem, soluta repellendus pariatur, ut quidem minima dicta beatae, voluptates esse ipsam hic! Obcaecati quaerat nihil excepturi aut facere illo, inventore iure ullam dicta placeat odio asperiores cumque necessitatibus debitis in?</div>
                    </div>

                </> : <></>}
                {/* Problem's Dercription - Ends Here */}



                {/* Problem's Submissions - Starts Here */}
                {visiblePart.problemSubmissions ? <>
                    <div className="pt-2 pe-2 h-[70vh] overflow-y-scroll">

                        Hi i am Submission Details Part for problem Slug: {slug}
                        <div className="p-4"></div>
                        <div>Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem dolorem, soluta repellendus pariatur, ut quidem minima dicta beatae, voluptates esse ipsam hic! Obcaecati quaerat nihil excepturi aut facere illo, inventore iure ullam dicta placeat odio asperiores cumque necessitatibus debitis in?</div>
                        <div>Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem dolorem, soluta repellendus pariatur, ut quidem minima dicta beatae, voluptates esse ipsam hic! Obcaecati quaerat nihil excepturi aut facere illo, inventore iure ullam dicta placeat odio asperiores cumque necessitatibus debitis in?</div>
                        <div>Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem dolorem, soluta repellendus pariatur, ut quidem minima dicta beatae, voluptates esse ipsam hic! Obcaecati quaerat nihil excepturi aut facere illo, inventore iure ullam dicta placeat odio asperiores cumque necessitatibus debitis in?</div>
                        <div>Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem dolorem, soluta repellendus pariatur, ut quidem minima dicta beatae, voluptates esse ipsam hic! Obcaecati quaerat nihil excepturi aut facere illo, inventore iure ullam dicta placeat odio asperiores cumque necessitatibus debitis in?</div>
                        <div>Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem dolorem, soluta repellendus pariatur, ut quidem minima dicta beatae, voluptates esse ipsam hic! Obcaecati quaerat nihil excepturi aut facere illo, inventore iure ullam dicta placeat odio asperiores cumque necessitatibus debitis in?</div>
                        <div>Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem dolorem, soluta repellendus pariatur, ut quidem minima dicta beatae, voluptates esse ipsam hic! Obcaecati quaerat nihil excepturi aut facere illo, inventore iure ullam dicta placeat odio asperiores cumque necessitatibus debitis in?</div>
                        <div>Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem dolorem, soluta repellendus pariatur, ut quidem minima dicta beatae, voluptates esse ipsam hic! Obcaecati quaerat nihil excepturi aut facere illo, inventore iure ullam dicta placeat odio asperiores cumque necessitatibus debitis in?</div>
                        <div>Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem dolorem, soluta repellendus pariatur, ut quidem minima dicta beatae, voluptates esse ipsam hic! Obcaecati quaerat nihil excepturi aut facere illo, inventore iure ullam dicta placeat odio asperiores cumque necessitatibus debitis in?</div>
                        <div>Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem dolorem, soluta repellendus pariatur, ut quidem minima dicta beatae, voluptates esse ipsam hic! Obcaecati quaerat nihil excepturi aut facere illo, inventore iure ullam dicta placeat odio asperiores cumque necessitatibus debitis in?</div>
                        <div>Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem dolorem, soluta repellendus pariatur, ut quidem minima dicta beatae, voluptates esse ipsam hic! Obcaecati quaerat nihil excepturi aut facere illo, inventore iure ullam dicta placeat odio asperiores cumque necessitatibus debitis in?</div>
                    </div>

                </> : <></>}
                {/* Problem's Submissions - Ends Here */}

            </div>
            {/* Problem Details Section - Ends Here  */}

            {/* Problem' Code Editor Section - Starts Here  */}
            <div className="w-full h-full flex flex-col">
                <CodeEditor />
            </div>
            {/* Problem' Code Editor Section - Ends Here  */}
        </div>
    </>;
};


export default ProblemEditor;