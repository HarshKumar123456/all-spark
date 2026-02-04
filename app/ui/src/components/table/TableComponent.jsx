import React from "react";

const TableComponent = ({ headingFields, rowsData, onClickOnMore }) => {
    return <>

        <div className="w-full flex flex-col items-center mt-8 px-8 lg:px-16 py-16 lg:py-8">
            <table className="w-full table-auto">
                {/* Table Heading Fields - Starts Here */}
                <thead className="text-lg lg:text-2xl poppins-semibold black-100-text">

                    <tr className="text-center border border-0 border-b-1 border-[#0a173266]">
                        {headingFields.map((heading, index) => {
                            return <th className="mb-4 pb-4" key={`table-heading-${index}`}>
                                {heading}
                            </th>;
                        })}
                    </tr>

                </thead>
                {/* Table Heading Fields - Ends Here */}


                {/* Table Body Data - Starts Here */}
                <tbody>

                    {rowsData.map((row, index) => {
                        let rowDataFields = [];
                        for(let field in row) {
                            rowDataFields.push(<td className="mb-4 py-4" key={`row-${index}-${field}`}>{row[field]}</td>);
                        }

                        return <tr className="text-center border border-0 border-b-1 border-[#0a17321a]" key={`table-heading-${index}`}>
                            {rowDataFields.map((data) => {
                                return data;
                            })}
                        </tr>;
                    })}

                </tbody>
                {/* Table Body Data - Ends Here */}
            </table>

            <button
                className="mt-16 px-16 py-4 rounded-full text-white text-lg lg:text-xl primary-gradient-bg poppins-semibold"
                onClick={onClickOnMore}
            >
                Get More
            </button>
        </div>

    </>;
};


export default TableComponent;