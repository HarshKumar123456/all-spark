import React, { useState } from "react";
import Layout from "../../components/layout/Layout";
import { Link } from "react-router-dom";
import Heading from "../../components/heading/Heading";
import ControlPanelLayout from "../../components/layout/ControlPanelLayout";
import TextInput from "../../components/input/TextInput";

const ControlPanelOverview = () => {


    return <>
        <ControlPanelLayout
            activeMenuOptionId={'overview'}
        >

            {/* Control Panel's Details Section - Starts Here */}

            <div className="flex flex-col items-center">


                <h2 className="text-xl lg:text-2xl black-80-text poppins-semibold">
                    Control Panel Allows You to Perform CRUD Operations on the Platform
                </h2>


            </div>

            {/* Control Panel's Details Section - Ends Here */}
        </ControlPanelLayout>
    </>
};

export default ControlPanelOverview;