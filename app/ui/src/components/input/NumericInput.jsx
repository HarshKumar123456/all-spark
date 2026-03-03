import React from "react";

const NumericInput = ({ id, value, onValueChange, placeholderText }) => {
    return <>
        <input
            className="w-full rounded-xl px-8 py-4 bg-[#0a17320d] outline-[#0a173266]"
            type="number"
            placeholder={`${placeholderText ? placeholderText : "Placeholder numeric input...."}`}
            id={`${id}`}
            value={value}
            onChange={onValueChange}
        />
    </>;
};


export default NumericInput;