import React, { useState } from "react";

const MultiSelectCheckBoxInput = ({ id, value, onValueChange, placeholderText, options, optionsHeading }) => {

    // With this useState I want to collect the checked checkboxes
    const [checkedCheckboxes, setCheckedCheckboxes] = useState(value); // Array type

    // This is my handler method that gets triggered when a checkbox get's checked/unchecked
    // ..and toggles the state of the checkbox
    const handleCheckboxChange = (option) => {
        const isChecked = checkedCheckboxes.find(checkedCheckbox => checkedCheckbox === option);

        let newCheckboxes = checkedCheckboxes;
        if (isChecked) {
            newCheckboxes = checkedCheckboxes.filter(
                (checkedCheckbox) => checkedCheckbox !== option
            );

        } else {
            newCheckboxes = checkedCheckboxes.concat(option);
        }

        // Update the State in this Component
        setCheckedCheckboxes(newCheckboxes)

        // Update the State in parent component
        onValueChange(newCheckboxes);
    };


    return <>
        <fieldset>
            <legend>
                {optionsHeading}
            </legend>

            {
                (options && typeof (options) === typeof ([])) ?

                    <ul className="p-4 lg:p-8 h-[50vh] overflow-auto border border-[#0a173233] rounded-xl flex flex-col gap-4 lg:gap-8">
                        {options.map((option, index) => {
                            return <li key={`${id || "multi-select-input"}-${index}`}
                                className="flex flex-row gap-4 lg:gap-8"
                            >
                                <input
                                    className="w-8 border rounded-full cursor-pointer"
                                    type="checkbox"
                                    id={option.value}
                                    name={option.value}
                                    value={option.value}
                                    checked={checkedCheckboxes.find(checkedCheckbox => checkedCheckbox === option.value)}
                                    onChange={() => handleCheckboxChange(option.value)}
                                />
                                <label className="cursor-pointer" htmlFor={option.value}>
                                    {option.displayComponent}
                                </label>
                            </li>
                        })}

                    </ul>

                    : <>
                        {placeholderText}
                    </>
            }
        </fieldset>
    </>;
};


export default MultiSelectCheckBoxInput;