import { useState, useEffect, useRef } from "react";
import checkAuth from "./components/auth/checkAuth";

const OutputFrame = ({ selectedLanguage, html, css, js, code }) => {
    const [output, setOutput] = useState("");
    const [activeTab, setActiveTab] = useState("console");
    const [userInput, setUserInput] = useState("");
    const iframeRef = useRef(null);

    const formatOutput = (text) => {
        // Replace common control characters and format special outputs
        return text
            .split('\n')
            .map((line, index) => {
                // Style error messages
                if (line.includes("Error:")) {
                    return (
                        <div key={index} className="text-red-500 font-medium">
                            {line}
                        </div>
                    );
                }
                // Style warning messages
                if (line.includes("Warning:")) {
                    return (
                        <div key={index} className="text-yellow-500">
                            {line}
                        </div>
                    );
                }
                // Style input prompts
                if (line.includes("Enter") || line.includes("Input:")) {
                    return (
                        <div key={index} className="text-blue-400">
                            {line}
                        </div>
                    );
                }
                // Style success messages
                if (line.includes("Success") || line.includes("Completed")) {
                    return (
                        <div key={index} className="text-green-500">
                            {line}
                        </div>
                    );
                }
                // Default styling for regular output
                return (
                    <div key={index} className="font-mono">
                        {line}
                    </div>
                );
            });
    };

    const [requiresInput, setRequiresInput] = useState(false);

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
                body: new URLSearchParams({
                    userInput
                }),
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

        if (selectedLanguage === "web") {
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

                        if (!fullOutput.includes("Process exited - Return Code:")) {
                            setRequiresInput(true);
                        }
                        else {
                            setRequiresInput(false);
                        }

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
                    <head>
                        <style>${css}</style>
                    </head>
                    <body>
                        <div id="console-output" style="
                            white-space: pre-wrap;
                            word-wrap: break-word;
                            font-family: monospace;
                            padding: 1rem;
                        "></div>
                        <script>
                            (function() {
                                const originalConsole = {
                                    log: console.log,
                                    error: console.error,
                                    warn: console.warn,
                                    info: console.info
                                };
    
                                function updateOutput(type, args) {
                                    const output = document.getElementById("console-output");
                                    const line = document.createElement("div");
                                    line.textContent = args.join(" ");
                                    
                                    switch(type) {
                                        case "error":
                                            line.style.color = "#ef4444";
                                            break;
                                        case "warn":
                                            line.style.color = "#eab308";
                                            break;
                                        case "info":
                                            line.style.color = "#3b82f6";
                                            break;
                                    }
                                    
                                    output.appendChild(line);
                                }
    
                                // Override console methods
                                console.log = (...args) => {
                                    originalConsole.log(...args);
                                    updateOutput("log", args);
                                };
                                console.error = (...args) => {
                                    originalConsole.error(...args);
                                    updateOutput("error", args);
                                };
                                console.warn = (...args) => {
                                    originalConsole.warn(...args);
                                    updateOutput("warn", args);
                                };
                                console.info = (...args) => {
                                    originalConsole.info(...args);
                                    updateOutput("info", args);
                                };
    
                                try {
                                    ${js}
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

    useEffect(() => {
        setOutput("");
    }, [selectedLanguage]);

    useEffect(() => {
        const iframe = iframeRef.current;
        if (iframe) iframe.contentDocument.open();
    }, [selectedLanguage, js]);

    return (
        <div className="bg-gray-900 text-white rounded-lg p-4 pt-10 mt-4 w-213 h-213">
            {selectedLanguage === "web" && (
                <div className="flex  p-4">
                    <button
                        className={`px-4 py-2 rounded-t-lg transition-colors ${activeTab === "preview" ? "bg-gray-700" : "bg-gray-800 hover:bg-gray-700"
                            }`}
                        onClick={() => setActiveTab("preview")}
                    >
                        Preview
                    </button>
                    <button
                        className={`px-4 py-2 rounded-t-lg ml-2 transition-colors ${activeTab === "console" ? "bg-gray-700" : "bg-gray-800 hover:bg-gray-700"
                            }`}
                        onClick={() => setActiveTab("console")}
                    >
                        Console
                    </button>
                </div>
            )}

            {selectedLanguage === "web" && activeTab === "preview" ? (
                <iframe
                    title="preview"
                    className="w-205 mt-3 h-150 bg-white rounded-lg border border-gray-500"
                    srcDoc={generatePreview()}
                    sandbox="allow-scripts"
                />
            ) : (
                <div className="w-205 h-150 mt-3 bg-gray-950 text-green-400 p-4 mr-10 rounded-lg overflow-auto font-mono">
                    {(selectedLanguage === "javascript" || selectedLanguage === "web") && activeTab === "console" ? (
                        <iframe
                            title="js-output"
                            ref={iframeRef}
                            className="w-full h-full bg-gray-200  border border-gray-500 rounded-md"
                        />
                    ) : (
                        <div>{formatOutput(output || "Console is empty")}</div>
                    )}
                </div>
            )}

            {requiresInput && (
                <div className="mt-4">
                    <label htmlFor="userInput" className="block text-sm font-medium text-gray-300">Program Input</label>
                    <input id="userInput" className="mt-1 p-2 w-full bg-gray-800 text-white rounded focus:ring-2 focus:ring-blue-500 focus:outline-none" value={userInput} onChange={(e) => setUserInput(e.target.value)} placeholder="Enter input for your program..." />
                    <button className="mt-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg" onClick={sendUserInput}>Submit Input</button>
                </div>
            )}

            <button
                className="mt-4 bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg transition-colors duration-200 flex items-center"
                onClick={runCode}
            >
                <span className="mr-2">Run Code</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
            </button>
        </div>
    );
}

export default OutputFrame;