import React, { useState } from "react";
import expandArrowIcon from "../../assets/icons/expand-arrow-icon.svg";
import collapseArrowIcon from "../../assets/icons/collapse-arrow-icon.svg";

const ParentContent = ({ children }) => children;
const ChildContent = ({ children }) => children;

const ExpandCollapseControls = ({ children }) => {

    const [isChildContentUIComponentVisible, setIsChildContentUIComponentVisible] = useState(false); // boolean i.e. true or false

    const toggleChildContentUIComponentVisibility = () => {
        setIsChildContentUIComponentVisible((prev) => {
            return !prev;
        });
    };


    // find slot children
    let parentContentSlot = null;
    let childContentSlot = null;

    React.Children.forEach(children, (child) => {
        if (!React.isValidElement(child)) return;

        if (child.type === ChildContent) {
            childContentSlot = child.props.children;
        }
        else if (child.type === ParentContent) {
            parentContentSlot = child.props.children;
        }
    });


    return <>

        <div className="flex flex-row items-center gap-4">

            {/* Expand Collapse Child Content UI Controls - Starts Here */}
            <button
                onClick={toggleChildContentUIComponentVisibility}
                className="px-4 py-4 transition-all duration-[0.4s] ease-in-out cursor-pointer active:scale-[0.8]">
                <img className="w-4 object-cover" src={isChildContentUIComponentVisible === true ? collapseArrowIcon : expandArrowIcon} alt="expand collapse icon" />
            </button>
            {/* Expand Collapse Child Content UI Controls - Ends Here */}


            {/* Parent Content UI Component - Starts Here */}
            {
                parentContentSlot ? <>
                    {parentContentSlot}
                </> : <>
                    <div className="text-red-400 text-4xl poppins-semibold">
                        Parent Content UI Component is Not Given....
                    </div>
                </>
            }
            {/* Parent Content UI Component - Ends Here */}


        </div>


        {/* Child Content UI Component - Starts Here */}
        {
            isChildContentUIComponentVisible ?
                childContentSlot ? <>
                    {childContentSlot}
                </> : <>
                    <div className="text-red-400 text-4xl poppins-semibold">
                        Child Content UI Component is Not Given....
                    </div>
                </>
                : <></>
        }
        {/* Child Content UI Component - Ends Here */}
    </>;
};

// attach compound component
ExpandCollapseControls.ChildContent = ChildContent;
ExpandCollapseControls.ParentContent = ParentContent;


export default ExpandCollapseControls;