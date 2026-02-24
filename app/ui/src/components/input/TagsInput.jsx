import React, { useState } from "react";
import TextInput from "./TextInput";

const TagsInput = ({ id, value, onValueChange, placeholderText, tagsHeading }) => {

    const [inputValue, setInputValue] = useState("");


    const addTag = () => {
        const tag = inputValue.trim();
        if (!tag) return;

        if (value.includes(tag)) {
            setInputValue("");
            return;
        }

        const newTags = [...value, tag];

        onValueChange(newTags);

        setInputValue("");
    };

    const removeTag = (tagToRemove) => {
        const newTags = value.filter((t) => t !== tagToRemove);

        onValueChange(newTags);
    };


    return <>

        <div className="flex flex-col gap-1">

            <h4 className="text-2xl my-4 poppins-semibold black-80-text">
                {tagsHeading || "Tags"}
            </h4>

            <ul className="w-full rounded-full px-4 py-2 flex flex-row flex-wrap gap-2">
                {value.map((tag, index) => {
                    return <li
                        key={`tag-no-${index}`}
                        className="px-4 py-2 rounded-full flex flex-row items-center flex-nowrap gap-4 bg-[#0a17320d]"
                    >
                        <span key={tag} className="text-normal poppins-regular">
                            {tag}
                        </span>
                        <button
                            className="text-sm w-6 h-6 flex items-center justify-center rounded-full bg-[#0a173233]"
                            onClick={() => removeTag(tag)}
                        >
                            ✕
                        </button>
                    </li>
                }
                )}
            </ul>


            <div className="flex flex-row items-center gap-8">

                <TextInput
                    id={`tags-input-${id}-text-input`}
                    value={inputValue}
                    onValueChange={(e) => setInputValue(e.target.value)}
                    placeholderText={placeholderText || "Add Tags...."}
                    onKeyDown={(e) => e.key === "Enter" && addTag()}
                />

                
                <button 
                className="transition-all duration-[0.4s] ease-in-out cursor-pointer px-8 py-2 border border-[#0a173266] hover:border-[#0a1732cc] hover:drop-shadow-xl active:scale-[0.8] rounded-full text-lg"
                onClick={addTag}
                >
                    Add
                </button>

            </div>
        </div>


    </>;
};

export default TagsInput;