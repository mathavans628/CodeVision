import React, { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { Clipboard, Check } from "lucide-react"; // Import icons

const CodeEditor = ({ html, setHtml, css, setCss, js, setJs, code, setCode, selectedLanguage }) => {
  const [activeTab, setActiveTab] = useState("html");
  const [fontSize, setFontSize] = useState(14); // Default font size
  const [copied, setCopied] = useState(false); // For tooltip visibility

  useEffect(() => {
    if (selectedLanguage !== "web") {
      setCode(code || "");
    }
  }, [selectedLanguage, setCode]);

  const copyToClipboard = () => {
    const textToCopy = selectedLanguage === "web" ? 
      (activeTab === "html" ? html : activeTab === "css" ? css : js) : code;

    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopied(true); // Show tooltip
      setTimeout(() => setCopied(false), 1500); // Hide tooltip after 1.5s
    }).catch(err => {
      console.error("Failed to copy: ", err);
    });
  };

  return (
    <div className="bg-gray-900 p-4 rounded-xl shadow-lg w-215 h-215 flex flex-col">
      {/* Top Controls */}
      <div className="flex justify-between items-center mb-3">
        {/* Font Size Selector */}
        <div>
          <label className="text-gray-300 text-sm mr-2">Font Size:</label>
          <select 
            className="bg-gray-800 text-white px-3 py-1 rounded focus:outline-none"
            value={fontSize}
            onChange={(e) => setFontSize(parseInt(e.target.value))}
          >
            {[12, 14, 16, 18, 20, 22].map(size => (
              <option key={size} value={size}>{size}px</option>
            ))}
          </select>
        </div>

        {/* Copy Button with Tooltip */}
        <div className="relative">
          <button 
            className="bg-blue-600 hover:bg-blue-500 p-2 rounded-lg text-white flex items-center transition duration-200 relative"
            onClick={copyToClipboard}
          >
            {copied ? <Check size={20} color="lime" /> : <Clipboard size={20} />}
          </button>

          {/* Tooltip - Now Always Visible When Copied */}
          <div className={`absolute -top-10 left-1/2 transform -translate-x-1/2 px-3 py-1 text-xs font-medium bg-black text-white rounded shadow-lg transition-opacity duration-300 ${copied ? "opacity-100" : "opacity-0"}`}>
            Copied!
          </div>
        </div>
      </div>

      {/* Code Editor Wrapper - Full Height */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {selectedLanguage === "web" ? (
          <div className="flex flex-col h-200">
            {/* Tab Navigation */}
            <div className="flex space-x-4 mb-3">
              {["html", "css", "javascript"].map((tab) => (
                <button
                  key={tab}
                  className={`px-5 py-2 rounded-lg text-sm font-medium transition duration-300 
                    ${activeTab === tab ? "bg-blue-500 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Code Editor - Full Height */}
            <div className="flex-1 overflow-hidden rounded-lg border border-gray-700 shadow-md">
              {activeTab === "html" && <Editor height="100%" language="html" theme="vs-dark" value={html} onChange={setHtml} options={{ fontSize }} />}
              {activeTab === "css" && <Editor height="100%" language="css" theme="vs-dark" value={css} onChange={setCss} options={{ fontSize }} />}
              {activeTab === "javascript" && <Editor height="100%" language="javascript" theme="vs-dark" value={js} onChange={setJs} options={{ fontSize }} />}
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-hidden rounded-lg border border-gray-700 shadow-md">
            <Editor 
              height="100%" 
              language={selectedLanguage} 
              theme="vs-dark" 
              value={code} 
              onChange={setCode} 
              options={{ fontSize }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CodeEditor;