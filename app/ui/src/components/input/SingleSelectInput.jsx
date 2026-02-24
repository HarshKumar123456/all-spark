import React from "react";

const SingleSelectInput = ({
    id,
    value,
    onValueChange,
    placeholderText,
    options,
    optionsHeading,
}) => {

    // Check if Valid Options Are Provided i.e. they are in a list or not
    if (!Array.isArray(options) || options.length === 0) {
        return (
            <div className="text-2xl text-red-400 poppins-semibold">
                Options Not Provided....
            </div>
        );
    }


    return <>
        <div className="flex flex-col gap-1">

            <h4 className="text-2xl my-4 poppins-semibold black-80-text">
                {optionsHeading || "Options"}
            </h4>

            <select
                id={id}
                name={id}
                value={value}
                onChange={onValueChange}
                className={`
                px-4 py-2 border border-2 border-[#0a17320d] active:border-[#0a1732cc] rounded-md
                focus:outline-none 
                `}
            >
                {/* Placeholder Option - Starts Here */}
                <option value="" disabled>
                    {placeholderText}
                </option>
                {/* Placeholder Option - Ends Here */}

                {/* Options - Starts Here */}
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
                {/* Options - Ends Here */}
            </select>

        </div>
    </>;
};

export default SingleSelectInput;