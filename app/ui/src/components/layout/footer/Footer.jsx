import React from "react";

const Footer = () => {
    return <>

    <div className="flex flex-col gap-4 lg:flex-row justify-between px-16 py-8 mt-4 border border-t-2 border-[#0a17321a]">
            <div className="text-3xl lg:text-4xl poppins-bold">AllSpark</div>
            <div className="text-sm lg:text-xl text-[#0a1732cc] poppins-regular">
                Copyright © {new Date().getFullYear()} AllSpark Org. All rights reserved.
            </div>
    </div>

    </>;
};


export default Footer;