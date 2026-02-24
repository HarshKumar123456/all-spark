import React, { useState } from "react";
import filterIcon from "../../assets/icons/filter-icon.png";
import searchIcon from "../../assets/icons/search-icon.png";
import SearchInput from "../input/SearchInput";

const Filter = ({ children }) => children;

const SearchControls = ({ children, onClickSubmitSearchButton, placeholderText }) => {
    const [searchText, setSearchText] = useState("");
    const [isFilterUIComponentVisible, setIsFilterUIComponentVisible] = useState(false); // boolean i.e. true or false

    const onSearchTextChange = (e) => {
        console.log("Bhai Search Text Change kar rahe hain....", e.target.value);
        setSearchText(e.target.value);
    };

    const toggleFiltersComponentVisibility = () => {
        setIsFilterUIComponentVisible(!isFilterUIComponentVisible);
    };

    const handleClickOnSearchEnterButton = () => {
        // setIsFilterUIComponentVisible(false);
        onClickSubmitSearchButton(searchText);
    };

    // find slot children
    let filterSlot = null;

    React.Children.forEach(children, (child) => {
        if (!React.isValidElement(child)) return;

        if (child.type === Filter) {
            filterSlot = child.props.children;
        }
    });


    return <>

        <div className="w-full flex flex-row gap-4 lg:gap-16 items-center justify-between px-2 lg:px-16 py-16 lg:py-8">

            {/* Filter Controls - Starts Here */}
            <button
                onClick={toggleFiltersComponentVisibility}
                className="px-4 py-4 transition-all duration-[0.4s] ease-in-out cursor-pointer active:scale-[0.8]">
                <img className="w-12 object-cover" src={filterIcon} alt="filter icon" />
            </button>
            {/* Filter Controls - Ends Here */}


            <SearchInput
                id={`searchText`}
                value={searchText}
                onValueChange={onSearchTextChange}
                placeholderText={placeholderText || "Search here...."}
                onKeyDown={(e) => e.key === "Enter" && handleClickOnSearchEnterButton()}
            />


            {/* Search Enter Controls - Starts Here */}
            <button
                onClick={handleClickOnSearchEnterButton}
                className="transition-all duration-[0.4s] ease-in-out cursor-pointer px-8 py-2 border border-[#0a173266] hover:border-[#0a1732cc] hover:drop-shadow-xl active:scale-[0.8] rounded-full">
                <img className="w-12 object-cover" src={searchIcon} alt="Search Enter Button icon" />
            </button>
            {/* Search Enter Controls - Ends Here */}


        </div>


        {/* Filter UI Component - Starts Here */}
        {isFilterUIComponentVisible ?
            filterSlot ? <>
                {filterSlot}
            </> : <>
                <div className="text-red-400 text-4xl poppins-semibold">
                    Filter UI Component is Not Given....
                </div>
            </>
            : <></>}
        {/* Filter UI Component - Ends Here */}
    </>;
};

// attach compound component
SearchControls.Filter = Filter;


export default SearchControls;