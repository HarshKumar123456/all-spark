import React from "react";
import { Link } from "react-router-dom";
import Heading from "../components/heading/Heading";
import Layout from "../components/layout/Layout";

const PrivacyPolicy = () => {
    return <>
        <Layout>

            <div className="px-16 py-8 mt-4">
                <Heading text={"Privacy Policy"} />

                <div className="flex flex-col gap-2 text-xl">

                    Last updated: 10 April 2026

                    <br />
                    <br />


                    <div className="my-4">
                        <p className="lg:text-xl">
                            Welcome to Allspark (“we”, “our”, “us”). Your privacy is important to us.
                        </p>

                    </div>


                    <div className="my-4">

                        <h4 className="text-xl lg:text-2xl font-medium">
                            1. Information We Collect
                        </h4>
                        <p className="lg:text-xl">
                            We may collect:
                            <ul className="ps-8 list-disc">

                                <li>
                                    Personal information (name, email, phone number)

                                </li>
                                <li>
                                    Payment details (processed securely via third-party gateways)

                                </li>
                                <li>
                                    Usage data (IP address, browser type, device info)

                                </li>
                            </ul>

                        </p>
                    </div>



                    <div className="my-4">

                        <h4 className="text-xl lg:text-2xl font-medium">
                            2. How We Use Your Information
                        </h4>
                        <p className="lg:text-xl">

                            We use your data to:

                            <ul className="ps-8 list-disc">

                                <li>
                                    Provide and improve our services
                                </li>

                                <li>
                                    Process payments
                                </li>

                                <li>
                                    Communicate updates and support
                                </li>

                                <li>
                                    Prevent fraud and ensure security
                                </li>

                            </ul>
                        </p>
                    </div>



                    <div className="my-4">

                        <h4 className="text-xl lg:text-2xl font-medium">
                            3. Payment Information
                        </h4>
                        <p className="lg:text-xl">
                            We do not store your card or banking details. Payments are processed securely through trusted third-party payment gateways.
                        </p>

                    </div>






                    <div className="my-4">
                        <h4 className="text-xl lg:text-2xl font-medium">
                            4. Data Sharing
                        </h4>

                        <p className="lg:text-xl">
                            We do not sell your personal data. We may share data with:
                            <ul className="ps-8 list-disc">

                                <li>
                                    Payment processors
                                </li>
                                <li>
                                    Legal authorities if required
                                </li>

                            </ul>
                        </p>
                    </div>





                    <div className="my-4">
                        <h4 className="text-xl lg:text-2xl font-medium">
                            5. Cookies
                        </h4>

                        <p className="lg:text-xl">
                            We may use cookies to enhance user experience and analytics.
                        </p>
                    </div>






                    <div className="my-4">
                        <h4 className="text-xl lg:text-2xl font-medium">
                            6. Data Security
                        </h4>

                        <p className="lg:text-xl">
                            We implement industry-standard measures to protect your data.
                        </p>
                    </div>






                    <div className="my-4">
                        <h4 className="text-xl lg:text-2xl font-medium">
                            7. Your Rights
                        </h4>

                        <p className="lg:text-xl">
                            You can request access, correction, or deletion of your data by contacting us.
                        </p>
                    </div>






                    <div className="my-4">
                        <h4 className="text-xl lg:text-2xl font-medium">
                            8. Contact Us
                        </h4>

                        <p className="lg:text-xl">
                            Email: harshkumar92200@gmail.com
                        </p>
                    </div>





                    <div className="my-4">
                        <h4 className="text-xl lg:text-2xl font-medium">
                            9. Updates
                        </h4>

                        <p className="lg:text-xl">
                            We may update this policy from time to time.
                        </p>
                    </div>



                </div>
            </div>

        </Layout>
    </>;
};


export default PrivacyPolicy;