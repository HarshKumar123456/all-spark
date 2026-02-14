import React from "react";
import Layout from "../../components/layout/Layout";
import { Link } from "react-router-dom";
import Heading from "../../components/heading/Heading";


const About = () => {


    return (
        <>
            <Layout>


                <div className="flex flex-col gap-32 items-center px-8 lg:px-16 py-16">
                    {/* Who we Are Info Section - Starts Here */}
                    {/* <div className="mx-auto w-4/5 flex flex-col gap-4 lg:text-xl poppins-regular">

                    </div> */}
                    {/* Who we Are Info Section - Ends Here */}



                    {/* Project Info Section - Starts Here */}
                    <div className="mx-auto w-4/5 flex flex-col gap-4 lg:text-xl poppins-regular">

                        {/* Heading - Starts Here */}
                        <Heading
                            text={"About Project"}
                        />
                        {/* Heading - Ends Here */}

                        {/* Details - Starts Here */}
                        <p className="black-80-text">
                            <h2 className="pb-2 text-xl lg:text-2xl poppins-semibold">
                                First things first what is this project all about?
                            </h2>
                            Well As our Tagline says:
                            Open source,
                            Self Hostable,
                            Distributed Event Driven,
                            Code Execution Platform
                            <br />
                            Now lets demystify them all one by one :
                            <ul className="px-8 lg:px-16 list-disc flex flex-col gap-16 mt-2">
                                <li>
                                    <h3 className="text-2xl lg:text-3xl poppins-regular">
                                        Open Source
                                    </h3>
                                    <p className="py-2">

                                        First of all Our Project's <b>Code</b> is Open Source and all code related to build this project and along with the <b>Documentation</b> (Yup! You Read it Right. We have Open Documentation for this Project for each step.) because We believe if we can track it we can upgrade it thus we have tracked everything we did so far into our code and documentation also the code is self-documenting in nature in addition to these things we putted comments explaining the code's functionality and We Are Actively improving project and <b>seeking Contributors like YOU</b>. You Can find the Code & Documentation onto this repo :
                                        <br />
                                        <p className="text-center px-2">
                                            <a
                                                className="text-wrap underline text-sm lg:text-lg primary-color-text"
                                                href={"https://github.com/harshkumar123456/all-spark"}
                                                target="blank"
                                            >
                                                https://github.com/harshkumar123456/all-spark
                                            </a>
                                        </p>
                                        

                                    </p>

                                </li>


                                <li>
                                    <h3 className="text-2xl lg:text-3xl poppins-regular">
                                        Self Hostable
                                    </h3>
                                    <p className="py-2">

                                        This Project is Made by keeping in mind that your time matters and thus We Made it very very <b>Easy</b> for getting started with this project at your system. You don't have to try very hard with setting up this project. So You can give it a shot and have a <b>Quick Install At Your System</b> for free with <b>few clicks</b> and the detailed steps to install it are already written carefully for you on the project repo link above. Don't worry if you don't want to continue with it you can safely remove this project from your system and all this will incur no charges to you as it is <b>Open Source & Free for all</b>.
                                    </p>

                                </li>


                                <li>
                                    <h3 className="text-2xl lg:text-3xl poppins-regular">
                                        Distributed Event Driven
                                    </h3>
                                    <p className="py-2">
                                        We have been using Microservices Based Architecture while building it and it is Event Driven i.e. everything is Asynchronous and Independent. Probably it might not be the Best way to implement the Asynchronous Request Response model but we tried our best to implement that and continously improving and seeking Contributors like YOU.
                                        <br />
                                        <br />
                                        The advantage of using the architecture we followed lies into its flexibility to upgrade and add new features indepently and the scalability of the specific part of the project and thus it can be twisted and tweaked as per your needs and you can merge the two services together into one or can take out more services from one and can have granular control on each part and documentation works as the torch light for you to understand how it is build and how it can be upgraded.
                                    </p>

                                </li>


                                <li>
                                    <h3 className="text-2xl lg:text-3xl poppins-regular">
                                        Code Execution Platform
                                    </h3>
                                    <p className="py-2">
                                        We have made this project while thinking the use case like if you want to have your platform to run & execute code just like you did onto other platforms like Coding Ninjas, GeeksForGeeks, LeetCode etc. then you can do that with few clicks.
                                    </p>

                                </li>


                            </ul>
                        </p>
                        {/* Details - Ends Here */}

                    </div>
                    {/* Project Info Section - Ends Here */}

                </div>

            </Layout>
        </>
    )
}

export default About;
