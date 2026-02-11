import { useRef, useState, useEffect } from 'react';
import Editor from "@monaco-editor/react";

const CodeEditor = ({ onLanguageChange }) => {

    const [codeLanguage, setCodeLanguage] = useState("cpp");

    const boilerPlateCodeForLanguages = [
        {
            language: "cpp",
            boilerPlateCode: "// Please Note \n\n// You Have to Write Full Code Here \n// Including the Input Taking From The Terminal or Console \n// You May Choose To Remove These Lines or Keep Them \n\n// Start Coding :)",
        },
        {
            language: "java",
            boilerPlateCode: "// Please Note \n\n// You Have to Write Full Code Here \n// Including the Input Taking From The Terminal or Console \n// You May Choose To Remove These Lines or Keep Them \n\n// Start Coding :)",
        },
        {
            language: "javascript",
            boilerPlateCode: "// Please Note \n\n// You Have to Write Full Code Here \n// Including the Input Taking From The Terminal or Console \n// You May Choose To Remove These Lines or Keep Them \n\n// Start Coding :)",
        },
        {
            language: "python",
            boilerPlateCode: "# Please Note \n\n# You Have to Write Full Code Here \n# Including the Input Taking From The Terminal or Console \n# You May Choose To Remove These Lines or Keep Them \n\n# Start Coding :)",
        }
    ];

    const [codeString, setCodeString] = useState(boilerPlateCodeForLanguages.find((element) => element.language === codeLanguage).boilerPlateCode)


    const handleEditorChange = (value, event) => {
        console.log("This is Value: ", value);
        console.log("This is Event: ", event);

        setCodeString(codeString);
    }

    const handleLanguageSelectionChange = (e) => {
        const languageValue = e.target.value;
        console.log("Hi, Language Change is Done....", e.target.value);

        setCodeLanguage(languageValue);

        setCodeString(() => {
            const newCodeString = boilerPlateCodeForLanguages.find((element) => element.language === languageValue).boilerPlateCode;
            return newCodeString;
        })
    }



    return <div className={`w-full`}>
        <div id="code-editor-controls" className="px-8 py-2 mb-8">
            {/* Language Selection Control - Starts Here */}
            <select onChange={handleLanguageSelectionChange} name="language" id="language" className="px-2 py-2 border border-1 border-[#0a173266] outline-none active:border-[#0a1732cc] rounded-lg">
                <option value="cpp">
                    C++
                </option>
                <option value="java">
                    Java
                </option>
                <option value="javascript">
                    Js
                </option>
                <option value="python">
                    Python
                </option>
            </select>
            {/* Language Selection Control - Ends Here */}
        </div>
        <Editor
            height="70vh"
            className="border border-[#0a173233] border-2 rounded-xl py-4"
            language={codeLanguage}
            value={codeString}
            onChange={handleEditorChange}
        />

        {/* Test Cases Section - Starts Here */}
        
        {/* Test Cases Section - Ends Here */}
    </div>;
};


export default CodeEditor;