import React from "react";

const FeatureBox = ({ imageInfo, name, description }) => {
    return <>
        <div className="transition-all duration-[0.4s] ease-in-out w-64 h-64 p-4 border border-[0.8px] border-[#0a173233] rounded-xl flex flex-col items-center gap-2 hover:border-[#0a1732cc] hover:scale-[1.08]">
            <img className="w-16 h-16 mb-4 rounded-lg object-fit" src={imageInfo.url} alt={`${imageInfo.altText}`} />

            <p className="text-2xl text-center poppins-semibold black-100-text">
                {name}
            </p>
            <p className="text-sm text-center poppins-regular black-60-text">
                {description}
            </p>
            <span className="w-4 h-[2px] rounded-full bg-[#0a17321a]"></span>
        </div>
    </>;
};


export default FeatureBox;