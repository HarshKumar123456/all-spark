import React from "react";
import { Link } from "react-router-dom";
import Heading from "../components/heading/Heading";
import Layout from "../components/layout/Layout";

const ContactUs = () => {
    return <>
        <Layout>

            <div className="px-16 py-8 mt-4">
                <Heading text={"Contact Us"} />

                <div className="flex flex-col gap-2">

                    <p className="whitespace-pre-line text-xl poppins-regular">
                        {`
                        We Value every contribution, feedback, query with our platform.
                        That really helps us to improve our platform. 
                        If you have anything to discuss or you want to build something like this or need help to host this kind of platform on your infra then Kindly contact us.


                        `}
                    </p>

                    
                    <div className="mt-4 flex flex-col gap-2 poppins-regular">

                        <div className="text-xl font-semibold">

                            harshkumar92200@gmail.com

                        </div>

                        <div className="text-xl font-semibold">

                            7275589766

                        </div>

                        <div className="text-xl font-semibold">

                            Mon-Fri, 10 AM - 6 PM IST

                        </div>




                    </div>
                </div>
            </div>

        </Layout>
    </>;
};


export default ContactUs;