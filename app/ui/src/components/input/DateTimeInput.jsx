import React from "react";

const DateTimeInput = ({ id, value, onValueChange, placeholderText }) => {
    return <>
        <input
            className="w-full rounded-xl px-8 py-4 bg-[#0a17320d] outline-[#0a173266]"
            type="datetime-local"
            placeholder={`${placeholderText ? placeholderText : "Placeholder date-time...."}`}
            id={`${id}`}
            value={value}
            onChange={onValueChange}
        />
    </>;
};


export default DateTimeInput;