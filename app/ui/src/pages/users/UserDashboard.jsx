import React from "react";

import { Link } from "react-router-dom";
import Layout from "../../components/layout/Layout";


const UserDashboard = () => {


    return <>
        <Layout>
            <div className="h-screen flex flex-col justify-center items-center">

                <Link to={"/logout"}>
                    <h2 className="text-2xl px-16 py-4 rounded-full text-white poppins-semibold primary-gradient-bg">
                        Logout
                    </h2>
                </Link>
            </div>
        </Layout>
    </>;
};


export default UserDashboard;