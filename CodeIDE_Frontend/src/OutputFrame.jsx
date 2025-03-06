import { useState, useEffect, useRef } from "react";
import { Trash2 } from "lucide-react"; 

const OutputFrame = ({ selectedLanguage, html, css, js, code }) => {
    const [output, setOutput] = useState("");
    const [activeTab, setActiveTab] = useState(selectedLanguage === "web" ? "preview" : "console");
    const [userInput, setUserInput] = useState("");
    const [requiresInput, setRequiresInput] = useState(false);
    const iframeRef = useRef(null);
    const hasRunRef = useRef(false); // Track if code has run to prevent repeats

    const checkAuth = async () => {
        try {
            const response = await fetch("http://localhost:8080/CodeVision/CheckAuthServlet", {
                method: "GET",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
            });
            if (!response.ok) {
                throw new Error(`Authentication check failed: ${response.status}`);
            }
            const data = await response.json();
            return { isAuthenticated: data.success };
        } catch (error) {
            console.error("Failed to check authentication:", error);
            return { isAuthenticated: false };
        }
    };

    const formatOutput = (text) => {
        return text.split('\n').map((line, index) => {
            if (line.includes("Error:")) {
                return <div key={index} className="text-red-500 font-medium">{line}</div>;
            }
            if (line.includes("Warning:")) {
                return <div key={index} className="text-yellow-500">{line}</div>;
            }
            if (line.includes("Enter") || line.includes("Input:")) {
                return <div key={index} className="text-blue-400">{line}</div>;
            }
            if (line.includes("Success") || line.includes("Completed")) {
                return <div key={index} className="text-green-500">{line}</div>;
            }
            return <div key={index} className="font-mono text-green-400">{line}</div>;
        });
    };

    const sendUserInput = async () => {
        const authStatus = await checkAuth();
        if (!authStatus.isAuthenticated) {
            alert("You are not authenticated! Please log in.");
            return;
        }
        if (!userInput.trim()) return;

        setOutput((prev) => prev + "\n" + userInput);
        setRequiresInput(false);

        try {
            const response = await fetch("http://localhost:8080/CodeVision/SeleniumExecutorServlet/submitUserInput", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: new URLSearchParams({ userInput }),
                credentials: "include",
            });
            const text = await response.text();
            setOutput((prev) => prev + "\n" + text);
        } catch (error) {
            setOutput(`Error: ${error.message}`);
        }
    };

    const runCode = async () => {
        const authStatus = await checkAuth();
        if (!authStatus.isAuthenticated) {
            alert("You are not authenticated! Please log in.");
            return;
        }

        setOutput("Running...");
        setRequiresInput(false);

        if (selectedLanguage === "javascript") {
            runJavaScriptCode();
            return;
        }

        try {
            const response = await fetch("http://localhost:8080/CodeVision/SeleniumExecutorServlet", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: new URLSearchParams({ code, language: selectedLanguage, userInput }),
                credentials: "include",
            });

            const reader = response.body.getReader();
            let decoder = new TextDecoder();
            let fullOutput = "";

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                try {
                    const lines = chunk.trim().split("\n");
                    lines.forEach(line => {
                        const parsed = JSON.parse(line);
                        fullOutput = parsed.output.replace(/\\n/g, "\n");
                        setOutput(fullOutput);
                        setRequiresInput(!fullOutput.includes("Process exited - Return Code:"));
                    });
                } catch (jsonError) {
                    fullOutput = chunk.replace(/\\n/g, "\n");
                    setOutput(fullOutput);
                    if (fullOutput.includes("Enter") || fullOutput.includes("Input:")) {
                        setRequiresInput(true);
                    }
                }
            }
        } catch (error) {
            setOutput(`Error: ${error.message}`);
        }
    };

    const runJavaScriptCode = () => {
        try {
            const iframe = iframeRef.current;
            if (!iframe) return;

            const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
            iframeDoc.open();
            iframeDoc.write(`
                <html>
                    <head></head>
                    <body>
                        <div id="console-output" style="white-space: pre-wrap; word-wrap: break-word; font-family: monospace; font-size: 1.3rem; padding: 1rem; color: #1eb932;"></div>
                        <script>
                            (function() {
                                const originalConsole = { log: console.log, error: console.error, warn: console.warn, info: console.info };
                                let outputLines = [];
                                function updateOutput(type, args) {
                                    const output = document.getElementById("console-output");
                                    output.innerHTML = ""; // Clear previous output
                                    const line = args.join(" ");
                                    outputLines.push({ type, line });
                                    outputLines.forEach(({ type: t, line: l }) => {
                                        const div = document.createElement("div");
                                        div.textContent = l;
                                        switch(t) {
                                            case "error": div.style.color = "#ef4444"; break;
                                            case "warn": div.style.color = "#eab308"; break;
                                            case "info": div.style.color = "#3b82f6"; break;
                                            default: div.style.color = "#34d399"; // Green for log
                                        }
                                        output.appendChild(div);
                                    });
                                }
                                console.log = (...args) => { originalConsole.log(...args); updateOutput("log", args); };
                                console.error = (...args) => { originalConsole.error(...args); updateOutput("error", args); };
                                console.warn = (...args) => { originalConsole.warn(...args); updateOutput("warn", args); };
                                console.info = (...args) => { originalConsole.info(...args); updateOutput("info", args); };
                                try {
                                    ${selectedLanguage === "web" ? js : code}
                                } catch (error) {
                                    console.error("Error:", error.message);
                                }
                            })();
                        </script>
                    </body>
                </html>
            `);
            iframeDoc.close();
        } catch (error) {
            setOutput(`Error: ${error.message}`);
        }
    };

    const generatePreview = () => `
        <html>
            <head><style>${css}</style></head>
            <body>${html}<script>${js}</script></body>
        </html>
    `;

    const clearConsole = () => {
        setOutput("");
        if (iframeRef.current) {
            const iframeDoc = iframeRef.current.contentDocument || iframeRef.current.contentWindow.document;
            iframeDoc.open();
            iframeDoc.write(`
                <html><body><div id="console-output" style="white-space: pre-wrap; word-wrap: break-word; font-family: monospace; padding: 1rem; color: #1eb932;"></div></body></html>
            `);
            iframeDoc.close();
        }
    };

    useEffect(() => {
        setOutput("");
        if (selectedLanguage === "web" || selectedLanguage === "javascript") {
            if (!hasRunRef.current) {
                runJavaScriptCode();
                hasRunRef.current = true;
            }
        }
    }, [selectedLanguage]);

    useEffect(() => {
        if (selectedLanguage === "web" || selectedLanguage === "javascript") {
            runJavaScriptCode();
        }
    }, [html, css, js, code]);

    const runButtonRef = useRef(null);

    useEffect(() => {
        const handleRunButtonClick = () => {
            if (runButtonRef.current) {
                runButtonRef.current.click(); // Simulate button click
            }
        };

        // Listen for the custom event
        window.addEventListener("triggerRunButton", handleRunButtonClick);

        // Cleanup event listener on component unmount
        return () => {
            window.removeEventListener("triggerRunButton", handleRunButtonClick);
        };
    }, []);

    return (
        <div className="bg-gray-900 text-white rounded-lg p-4 pt-10 mt-4 w-213 h-213 5xs:max-3xs:w-80 5xs:max-3xs:h-85 5xs:max-2xs:p-2  3xs:max-2xs:h-93 5xs:max-2xs:w-full sm:max-md:w-155 sm:max-md:p-2 sm:max-md:h-170 md:max-lg:w-211 md:max-lg:p-3 md:max-lg:h-180  3xl:max-4xl:w-176  3xl:max-4xl:m-0 3xl:max-4xl:h-176">
            <div className="flex justify-between items-center mb-4 5xs:max-2xs:w-full">
                {/* Left Side: Preview & Console Buttons */}
                <div className="flex space-x-4  5xs:max-2xs:h-full">
                    {selectedLanguage === "web" && (
                        <>
                            <button
                                className={`px-4 py-2 rounded-lg transition-colors cursor-pointer ${
                                    activeTab === "preview" ? "bg-gray-700" : "bg-gray-800 hover:bg-gray-700"
                                }`}
                                onClick={() => setActiveTab("preview")}
                            >
                                Preview
                            </button>
                            <button
                                className={`px-4 py-2 rounded-lg transition-colors cursor-pointer ${
                                    activeTab === "console" ? "bg-gray-700" : "bg-gray-800 hover:bg-gray-700"
                                }`}
                                onClick={() => setActiveTab("console")}
                            >
                                Console
                            </button>
                        </>
                    )}
                    {selectedLanguage !== "web" && selectedLanguage !== "javascript" && (
                        // <button
                        //     style={{marginTop: "-8px"}} className="font-bold bg-[#1eb932] hover:bg-green-700  px-6 mr-170 py-2 rounded-lg transition-colors duration-200 cursor-pointer 5xs:max-2xs:mr-0"
                        //     onClick={runCode}
                        // >
                        //     Run
                        // </button>
                        <button
                        ref={runButtonRef}
                        style={{marginTop: "-8px"}} className="hidden font-bold bg-[#1eb932] hover:bg-green-700  px-6 mr-170 py-2 rounded-lg transition-colors duration-200 cursor-pointer 5xs:max-2xs:mr-0"
                        onClick={runCode}
                    >Run
                        </button>
                    )}
                </div>

                {/* Right Side: Run & Clear Buttons */}
                <div className="flex space-x-4 5xs:max-2xs:w-8 5xs:max-2xs:h-10 5xs:max-2xs:mr-10 5xs:max-2xs:space-x-0">
                    <button
                        className="font-bold bg-gray-600 hover:bg-gray-700 px-6 py-2 flex items-center gap-2 rounded-lg transition-colors duration-200 cursor-pointer"
                        onClick={clearConsole}
                    >
                        <Trash2 size={20} />
                    </button>
                </div>

            </div>


            {/* Output Area */}
            {selectedLanguage === "web" && activeTab === "preview" ? (
                <iframe
                    title="preview"
                    className="w-205 mt-3 h-150 bg-white rounded-lg border border-gray-500 5xs:max-2xs:h-68 5xs:max-2xs:w-full 5xs:max-2xs:mt-0  sm:max-md:w-full  3xl:max-4xl:w-full"
                    srcDoc={generatePreview()}
                    sandbox="allow-scripts"
                />
            ) : (
                <div className="w-205 h-150 mt-3  bg-gray-800 text-xl text-green-400 p-4 mr-10 rounded-lg overflow-auto font-mono 5xs:max-2xs:w-full 5xs:max-2xs:h-50 5xs:max-2xs:mt-0  3xl:max-4xl:w-full">
                    {(selectedLanguage === "javascript" || (selectedLanguage === "web" && activeTab === "console")) ? (
                        <iframe
                            title="js-output"
                            ref={iframeRef}
                            className="w-full h-full bg-gray-800 text-green-400 border border-gray-500 rounded-md 5xs:max-2xs:w-full 5xs:max-2xs:h-full sm:max-md:w-full  3xl:max-4xl:w-full"
                        />
                    ) : (
                        <div>{formatOutput(output || "Console is empty")}</div>
                    )}
                </div>
            )}

            {requiresInput && (
                <div className="mt-4">
                    <label htmlFor="userInput" className="block text-sm font-medium text-gray-300">Program Input</label>
                    <input
                        id="userInput"
                        className="mt-1 p-2 w-full bg-gray-800 text-white rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        value={userInput}
                        autoComplete="false"
                        onLoad={(e) => e.target.value = ""}
                        onChange={(e) => setUserInput(e.target.value)}
                        placeholder="Enter input for your program..."
                    />
                    <button className="mt-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg" onClick={sendUserInput}>
                        Submit Input
                    </button>
                </div>
            )}
        </div>
    );
};

export default OutputFrame;