import React, { useState } from "react";
import Layout from "../../components/layout/Layout";
import { Link } from "react-router-dom";
import Heading from "../../components/heading/Heading";
import SearchControls from "../../components/controls/SearchControls";
import linkIcon from "../../assets/icons/link-icon.png";

const ProblemsList = () => {

    const [tableHeadings, setTableHeadings] = useState([
        "S.No.",
        "Name",
        "Level",
        "URL",
    ]);


    const [tableRowsData, setTableRowsData] = useState([
        {
            id: "1",
            name: "Calculate Factorial",
            level: "easy",
            slug: "calculate-factorial",
        },

        {
            id: "2",
            name: "Calculate Area",
            level: "medium",
            slug: "calculate-area",
        },

        {
            id: "3",
            name: "Calculate Volume",
            level: "hard",
            slug: "calculate-volume",
        },
    ]);


    const handleClickOnMoreButton = () => {
        console.log("More Button is Clicked....");

    };


    return <>
        <Layout>

            {/* Problems' List Section - Starts Here */}
            <div className="mt-8 flex flex-col items-center px-8 lg:px-16 py-16 lg:py-8">
                <Heading
                    text={`Problems`}
                />

                <SearchControls
                />

                <div className="w-full flex flex-col items-center mt-8 px-8 lg:px-16 py-16 lg:py-8">
                    <table className="w-full table-auto">
                        {/* Table Heading Fields - Starts Here */}
                        <thead className="text-lg lg:text-2xl poppins-semibold black-100-text">

                            <tr className="text-center border border-0 border-b-1 border-[#0a173266]">
                                <th className="mb-4 py-4">
                                    S.No.
                                </th>
                                <th className="mb-4 py-4">
                                    Name
                                </th>
                                <th className="mb-4 py-4">
                                    Level
                                </th>
                                <th className="mb-4 py-4">
                                    URL
                                </th>
                            </tr>

                        </thead>
                        {/* Table Heading Fields - Ends Here */}


                        {/* Table Body Data - Starts Here */}
                        <tbody>

                            {tableRowsData.map((tableRow, index) => {

                                return <tr className="text-center border border-0 border-b-1 border-[#0a17321a]" key={`table-heading-${index}`}>
                                    <td className="mb-4 py-4">
                                        {tableRow.id}
                                    </td>
                                    <td className="mb-4 py-4">
                                        {tableRow.name}
                                    </td>
                                    <td className="mb-4 py-4">
                                        <span className={`px-4 py-1 border rounded-full ${tableRow.level == "easy" ? "text-green-400" : (tableRow.level === "medium" ? "text-yellow-400" : "text-red-400")} text-sm poppins-semibold`}>

                                            {(tableRow.level).toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="mb-4 py-4">
                                        <Link className="cursor-pointer primary-color-text" to={`/problems/${tableRow.slug}`}>
                                            <img className="m-auto w-12 object-fit" src={linkIcon} alt="link icon" />
                                        </Link>
                                    </td>
                                </tr>;
                            })}

                        </tbody>
                        {/* Table Body Data - Ends Here */}
                    </table>

                    <button
                        className="mt-16 px-16 py-4 rounded-full text-white text-lg lg:text-xl primary-gradient-bg poppins-semibold"
                        onClick={handleClickOnMoreButton}
                    >
                        Get More
                    </button>
                </div>
            </div>
            {/* Problems' List Section - Ends Here */}

        </Layout>
    </>;
};


export default ProblemsList;