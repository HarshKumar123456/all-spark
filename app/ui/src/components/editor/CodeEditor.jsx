import { useRef, useState, useEffect } from 'react';
import Editor from "@monaco-editor/react";

const CodeEditor = ({ onLanguageChange }) => {

    const [codeLanguage, setCodeLanguage] = useState("cpp");

    const [codeString, setCodeString] = useState(`#include <iostream>\nusing namespace std;\n\nint main()  {\n\n\tcout << "AllSpark " << endl;\n\tcout << "Open Source, Self Hostable Code Execution Platform" << endl;\n\n\treturn 0;\n\n}`)


    const handleEditorChange = (value, event) => {
        console.log("This is Value: ", value);
        console.log("This is Event: ", event);

        setCodeString(codeString);
    }

    const handleLanguageSelectionChange = (e) => {
        const languageValue = e.target.value;
        console.log("Hi, Language Change is Done....", e.target.value);

        setCodeLanguage(languageValue);
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
            language={codeLanguage}
            defaultValue={codeString}
            onChange={handleEditorChange}
        />

        {/* Test Cases Section - Starts Here */}
        
        {/* Test Cases Section - Ends Here */}
    </div>;
};


export default CodeEditor;