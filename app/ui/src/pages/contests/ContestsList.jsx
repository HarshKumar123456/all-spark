import React from "react";
import Layout from "../../components/layout/Layout";
import Heading from "../../components/heading/Heading";
import { Link } from "react-router-dom";

const ContestsList = () => {
    return <>
        <Layout>
            <div className="flex flex-col gap-32 items-center px-8 lg:px-16 py-16">
                <Heading
                    text={"Coming Soon...."}
                />
                <p className="text-xl">

                    Go back to 🏠
                    <Link to="/" className="cursor-pointer px-8 py-4 poppins-bold primary-gradient-text">
                        Home
                    </Link>
                </p>
            </div>
        </Layout>
    </>;
};

export default ContestsList;