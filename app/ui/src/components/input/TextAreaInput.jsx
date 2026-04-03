import React from "react";

const TextAreaInput = ({ id, value, onValueChange, placeholderText, onKeyDown }) => {
    return <>
        <textarea
            className="w-full rounded-xl px-8 py-4 bg-[#0a17320d] outline-[#0a173266]"
            type="text"
            placeholder={`${placeholderText ? placeholderText : "Placeholder Text...."}`}
            id={`${id}`}
            value={value}
            onChange={onValueChange}
            onKeyDown={onKeyDown}
        >
        </textarea>
    </>;
};


export default TextAreaInput;