import React from "react";
import { Link } from "react-router-dom";
import Heading from "../components/heading/Heading";
import Layout from "../components/layout/Layout";

const TNC = () => {
    return <>
        <Layout>

            <div className="px-16 py-8 mt-4">
                <Heading text={"Terms & Conditions"} />

                <div className="flex flex-col gap-2 text-xl">

                    Last updated: 10 April 2026

                    <br />
                    <br />


                    <div className="my-4">
                        <p className="lg:text-xl">
                            By using Allspark, you agree to the following terms:
                        </p>

                    </div>


                    <div className="my-4">

                        <h4 className="text-xl lg:text-2xl font-medium">
                            1. Use of Service
                        </h4>
                        <p className="lg:text-xl">
                            You agree to use our platform only for lawful purposes.
                        </p>
                    </div>



                    <div className="my-4">

                        <h4 className="text-xl lg:text-2xl font-medium">
                            2. Account Responsibility
                        </h4>
                        <p className="lg:text-xl">

                            You are responsible for maintaining the confidentiality of your account.

                        </p>
                    </div>



                    <div className="my-4">

                        <h4 className="text-xl lg:text-2xl font-medium">
                            3. Payments
                        </h4>
                        <p className="lg:text-xl">

                            <ul className="ps-8 list-disc">

                                <li>
                                    All payments are processed securely.
                                </li>
                                <li>
                                    Prices are subject to change without notice.
                                </li>

                            </ul>
                        </p>

                    </div>






                    <div className="my-4">
                        <h4 className="text-xl lg:text-2xl font-medium">
                            4. Intellectual Property
                        </h4>

                        <p className="lg:text-xl">
                            All content on this platform belongs to Allspark unless stated otherwise.
                        </p>
                    </div>





                    <div className="my-4">
                        <h4 className="text-xl lg:text-2xl font-medium">
                            5. Limitation of Liability
                        </h4>

                        <p className="lg:text-xl">
                            We are not liable for:
                            <ul className="ps-8 list">
                                <li>
                                    Service interruptions
                                </li>

                                <li>
                                    Loss of data or profits
                                </li>
                            </ul>
                        </p>
                    </div>






                    <div className="my-4">
                        <h4 className="text-xl lg:text-2xl font-medium">
                            6. Termination
                        </h4>

                        <p className="lg:text-xl">
                            We reserve the right to suspend accounts for misuse.
                        </p>
                    </div>






                    <div className="my-4">
                        <h4 className="text-xl lg:text-2xl font-medium">
                            7. Governing Law
                        </h4>

                        <p className="lg:text-xl">
                            These terms are governed by the laws of India.
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
                            9. No Refunds
                        </h4>

                        <p className="lg:text-xl">
                            Currently we provide no refunds on our services.
                        </p>
                    </div>





                </div>
            </div>

        </Layout>
    </>;
};


export default TNC;