import React from "react";

const Heading = ({ text }) => {
    return <>
        <div className="mb-8 flex flex-col items-center gap-2">
            <h2 className="text-4xl poppins-semibold">
                {text}
            </h2>
            <span className="w-12 h-[4px] rounded-full bg-[#0a173233]"></span>
        </div>
    </>;
};


export default Heading;