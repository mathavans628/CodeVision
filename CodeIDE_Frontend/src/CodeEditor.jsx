import React, { useState, useEffect,useCallback } from "react";
import Editor from "@monaco-editor/react";
import { Clipboard, Check } from "lucide-react";
import * as monaco from "monaco-editor";


const CodeEditor = ({ html, setHtml, css, setCss, js, setJs, code, setCode, selectedLanguage, fileContent, fileName }) => {
    const [activeTab, setActiveTab] = useState("html");
    const [fontSize, setFontSize] = useState(14);
    const [copied, setCopied] = useState(false);

    // Configure Monaco Editor theme and autocompletion
    useEffect(() => {
        monaco.editor.defineTheme("customDark", {
            base: "vs-dark",
            inherit: true,
            rules: [
                { token: "comment", foreground: "6b7280", fontStyle: "italic" }, // Gray comments
                { token: "keyword", foreground: "93c5fd" },
                { token: "string", foreground: "86efac" },
                { token: "number", foreground: "fca5a5" },
                { token: "function", foreground: "c4b5fd" },
                { token: "variable", foreground: "d1d5db" },
                { token: "constant", foreground: "f9a8d4" },
                { token: "type", foreground: "93c5fd" },
                { token: "tag", foreground: "93c5fd" },
                { token: "attribute.name", foreground: "c4b5fd" },
                { token: "attribute.value", foreground: "86efac" },
            ],
            colors: {
                "editor.background": "#1a1d24",
                "editor.foreground": "#9ca3af",
                "editor.lineHighlightBackground": "#2d323c",
                "editor.selectionBackground": "#3b4252",
            },
        });

        // Register language support (ensure all languages are recognized)
        monaco.languages.getLanguages().forEach(lang => {
            if (!monaco.languages.getLanguages().some(l => l.id === lang.id)) {
                monaco.languages.register({ id: lang.id });
            }
        });

        // Optional: Add custom completions (example for JS, extend for others)
        monaco.languages.registerCompletionItemProvider("javascript", {
            provideCompletionItems: () => {
                return {
                    suggestions: [
                        { label: "console.log", kind: monaco.languages.CompletionItemKind.Function, insertText: "console.log($1)", insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: "Log to console" },
                        { label: "if", kind: monaco.languages.CompletionItemKind.Snippet, insertText: "if ($1) {\n\t$2\n}", insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: "If statement" },
                    ],
                };
            },
        });
    }, []);

    // Update code when file content changes
    useEffect(() => {
        if (fileContent) {
            setCode(fileContent);
        }
    }, [fileContent, setCode]);

    // Reset code for non-web languages
    useEffect(() => {
        if (selectedLanguage !== "web") {
            setCode(code || "");
        }
    }, [selectedLanguage, setCode]);

    // Copy code to clipboard
    const copyToClipboard = () => {
        const textToCopy = selectedLanguage === "web" ? 
            (activeTab === "html" ? html : activeTab === "css" ? css : js) : code;
        navigator.clipboard.writeText(textToCopy).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        }).catch(err => console.error("Failed to copy:", err));
    };

    // Detect language from file name
    const detectLanguageFromFileName = (fileName) => {
        const extension = fileName?.split(".").pop().toLowerCase();
        const langMap = {
            java: "java", js: "javascript", py: "python", c: "c", cpp: "cpp",
            php: "php", rb: "ruby", go: "go", r: "r", html: "web", css: "web"
        };
        return langMap[extension] || "unknown";
    };

    useEffect(() => {
        if (fileContent && detectLanguageFromFileName(fileName) === selectedLanguage) {
            setCode(fileContent);
        }
    }, [fileContent, fileName, selectedLanguage, setCode]);

    // Map your language values to Monaco language identifiers
    const getMonacoLanguage = (lang) => {
        const langMap = {
            "web": activeTab, // Uses html, css, javascript based on tab
            "javascript": "javascript",
            "python3": "python",
            "java": "java",
            "c": "c",
            "cpp": "cpp",
            "php": "php",
            "ruby": "ruby",
            "golang": "go",
            "rlang": "r"
        };
        return langMap[lang] || "plaintext"; // Fallback to plaintext
    };

    const triggerRun = () =>{
        const event = new Event("triggerRunButton"); // Create custom event
        window.dispatchEvent(event); 
    }
    const handleEditerKey = useCallback((e) =>{
        console.log("Inside");
        // if(e.key == "Enter"){
        //     e.preventDefault();
        //     e.stopPropagation();
        // }
    })
    
    useEffect(() => {
        document.addEventListener("keydown", handleEditerKey);
        return () => {
            document.removeEventListener("keydown", handleEditerKey);
        };
    }, [handleEditerKey]);

    return (
        <div className="bg-gray-900 p-4 rounded-xl shadow-lg w-215 h-215 flex flex-col 5xs:max-3xs:w-80 5xs:max-3xs:p-0.5 5xs:max-3xs:h-110 5xs:max-3xs:pb-3 3xs:max-2xs:h-120 3xs:max-2xs:w-110 3xs:max-2xs:p-1.5 3xs:max-2xs:w-130 sm:max-md:w-155 md:max-lg:w-208 3xl:max-4xl:w-174 3xl:max-4xl:h-175" onClick={(e) => handleEditerKey(e)}>
            {/* Top Controls */}
            <div className="flex justify-between items-center mb-3 5xs:max-3xs:pl-3">
                <div>
                    <label className="text-gray-300 text-sm mr-2">Font Size:</label>
                    <select 
                        className="bg-gray-800 text-white px-3 py-1 rounded focus:outline-none cursor-pointer 5xs:max-3xs:h-7 5xs:max-3xs:w-20.5"
                        value={fontSize}
                        onChange={(e) => setFontSize(parseInt(e.target.value))}
                    >
                        {[12, 14, 16, 18, 20, 22].map(size => (
                            <option key={size} value={size}>{size}px</option>
                        ))}
                    </select>
                </div>
                <div className="relative 5xs:max-3xs:pr-1 5xs:max-3xs:m-1 flex justify-between items-center">
                    {(selectedLanguage !== "web" && selectedLanguage !== "javascript") && <button className="bg-green-600 mr-4 hover:bg-green-500 p-2 w-20 flex items-center text-center pl-7 rounded-lg text-white transition duration-200 cursor-pointer" onClick={triggerRun}>Run</button>}
                    
                    <button 
                        className="bg-blue-600 hover:bg-blue-500 p-2 rounded-lg text-white flex items-center transition duration-200 cursor-pointer"
                        onClick={copyToClipboard}
                    >
                        {copied ? <Check size={20} color="lime" /> : <Clipboard size={20} />}
                    </button>
                    <div className={`absolute -top-10 left-1/2 transform -translate-x-1/2 px-3 py-1 text-xs font-medium bg-black text-white rounded shadow-lg transition-opacity duration-300 ${copied ? "opacity-100" : "opacity-0"}`}>
                        Copied!
                    </div>
                </div>
            </div>

            {/* Editor */}
            <div className="flex-1 flex flex-col overflow-hidden 5xs:max-3xs:pl-1.5 5xs:max-3xs:pr-1.5">
                {selectedLanguage === "web" ? (
                    <div className="flex flex-col h-200">
                        <div className="flex space-x-4 mb-3">
                            {["html", "css", "javascript"].map((tab) => (
                                <button
                                    key={tab}
                                    className={`px-5 py-2 rounded-lg text-sm font-medium transition duration-300 cursor-pointer 5xs:max-3xs:h-8 5xs:max-3xs:p-1.5 5xs:max-3xs:text-xs
                                        ${activeTab === tab ? "bg-blue-500 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"}`}
                                    onClick={() => setActiveTab(tab)}
                                >
                                    {tab.toUpperCase()}
                                </button>
                            ))}
                        </div>
                        <div className="flex-1 overflow-hidden rounded-lg border border-gray-700 shadow-md">
                            {activeTab === "html" && (
                                <Editor 
                                    height="100%" 
                                    language="html" 
                                    theme="customDark" 
                                    value={html} 
                                    onChange={setHtml} 
                                    options={{ 
                                        fontSize, 
                                        suggestOnTriggerCharacters: true, 
                                        acceptSuggestionOnEnter: "on", 
                                        quickSuggestions: true, 
                                        wordBasedSuggestions: true 
                                    }} 
                                />
                            )}
                            {activeTab === "css" && (
                                <Editor 
                                    height="100%" 
                                    language="css" 
                                    theme="customDark" 
                                    value={css} 
                                    onChange={setCss} 
                                    options={{ 
                                        fontSize, 
                                        suggestOnTriggerCharacters: true, 
                                        acceptSuggestionOnEnter: "on", 
                                        quickSuggestions: true, 
                                        wordBasedSuggestions: true 
                                    }} 
                                />
                            )}
                            {activeTab === "javascript" && (
                                <Editor 
                                    height="100%" 
                                    language="javascript" 
                                    theme="customDark" 
                                    value={js} 
                                    onChange={setJs} 
                                    options={{ 
                                        fontSize, 
                                        suggestOnTriggerCharacters: true, 
                                        acceptSuggestionOnEnter: "on", 
                                        quickSuggestions: true, 
                                        wordBasedSuggestions: true 
                                    }} 
                                />
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 overflow-hidden rounded-lg border border-gray-700 shadow-md">
                        <Editor 
                            height="100%" 
                            language={getMonacoLanguage(selectedLanguage)} 
                            theme="customDark" 
                            value={code} 
                            onChange={setCode} 
                            options={{ 
                                fontSize, 
                                suggestOnTriggerCharacters: true, 
                                acceptSuggestionOnEnter: "on", 
                                quickSuggestions: true, 
                                wordBasedSuggestions: true,
                                minimap: { enabled: false }, 
                                scrollBeyondLastLine: false 
                            }} 
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default CodeEditor;