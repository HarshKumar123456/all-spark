import React from "react";

const MobileNumberInput = ({ id, value, onValueChange, placeholderText }) => {
    return <>
        <input
            className="w-full rounded-xl px-8 py-4 bg-[#0a17320d] outline-[#0a173266]"
            type="tel"
            placeholder={`${placeholderText ? placeholderText : "Placeholder phone no...."}`}
            id={`${id}`}
            value={value}
            onChange={onValueChange}
        />
    </>;
};


export default MobileNumberInput;