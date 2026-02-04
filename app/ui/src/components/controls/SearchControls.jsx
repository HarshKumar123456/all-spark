import React, { useState } from "react";
import filterIcon from "../../assets/icons/filter-icon.png";
import searchIcon from "../../assets/icons/search-icon.png";
import SearchInput from "../input/SearchInput";

const SearchControls = ({ }) => {
    const [searchText, setSearchText] = useState("");

    const onSearchTextChange = (e) => {
        console.log("Bhai Search Text Change kar rahe hain....", e.target.value);
        setSearchText(e.target.value);
    };

    return <>

        <div className="w-full flex flex-row gap-4 lg:gap-16 items-center justify-between px-2 lg:px-16 py-16 lg:py-8">

            {/* Filter Controls - Starts Here */}
            <button className="cursor-pointer">
                <img className="w-12 object-cover" src={filterIcon} alt="filter icon" />
            </button>
            {/* Filter Controls - Ends Here */}


            <SearchInput
                id={`searchText`}
                value={searchText}
                onValueChange={onSearchTextChange}
                placeholderText={"Search: Add numbers, Factorial...."}
            />


            {/* Search Enter Controls - Starts Here */}
            <button className="transition-all duration-[0.4s] ease-in-out cursor-pointer px-8 py-2 border border-[#0a173266] hover:border-[#0a1732cc] hover:drop-shadow-xl active:scale-[0.8] rounded-full">
                <img className="w-12 object-cover" src={searchIcon} alt="Search Enter Button icon" />
            </button>
            {/* Search Enter Controls - Ends Here */}


        </div>

    </>;
};


export default SearchControls;