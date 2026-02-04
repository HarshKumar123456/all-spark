import React from "react";

const SearchInput = ({ id, value, onValueChange, placeholderText }) => {
    return <>
        <input
            className="w-full rounded-full px-8 lg:px-12 py-4 bg-[#0a17320d] outline-[#0a173266]"
            type="text"
            placeholder={`${placeholderText ? placeholderText : "Placeholder Text...."}`}
            id={`${id}`}
            value={value}
            onChange={onValueChange}
        />
    </>;
};


export default SearchInput;