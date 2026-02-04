import React from "react";

const PasswordInput = ({ id, value, onValueChange, placeholderText }) => {
    return <>
        <input
            className="w-full rounded-xl px-8 py-4 bg-[#0a17320d] outline-[#0a173266]"
            type="password"
            placeholder={`${placeholderText ? placeholderText : "Placeholder password...."}`}
            id={`${id}`}
            value={value}
            onChange={onValueChange}
        />
    </>;
};


export default PasswordInput;