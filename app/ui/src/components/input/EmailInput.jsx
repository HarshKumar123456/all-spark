import React from "react";

const EmailInput = ({ id, value, onValueChange, placeholderText }) => {
    return <>
        <input
            className="w-full rounded-xl px-8 py-4 bg-[#0a17320d] outline-[#0a173266]"
            type="email"
            placeholder={`${placeholderText ? placeholderText : "Placeholder email...."}`}
            id={`${id}`}
            value={value}
            onChange={onValueChange}
        />
    </>;
};


export default EmailInput;