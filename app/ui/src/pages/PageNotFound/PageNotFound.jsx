import React from "react";
import { Link } from "react-router-dom";
import Layout from "../../components/layout/Layout";

const PageNotFound = () => {
    return <>
        <Layout>
            <div className="h-screen flex flex-col justify-center items-center items-center gap-8">

                <h1 className="text-7xl poppins-bold">
                    Page 404
                </h1>
                <p className="text-xl text-center poppins-semibold">
                    Aliens are Coming 🙃 Go back to 🏠
                    <Link to="/" className="cursor-pointer px-8 py-4 poppins-bold primary-gradient-text">
                        Home
                    </Link>
                </p>
            </div>
        </Layout>
    </>;
};


export default PageNotFound;