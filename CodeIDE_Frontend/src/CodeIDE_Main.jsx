import { Sun, Moon, Mic, MicOff } from 'lucide-react'
import { CgExport } from "react-icons/cg";
import { PiButterflyFill } from "react-icons/pi";
import { MdOutlineSave } from "react-icons/md";
import { RiAiGenerate2 } from "react-icons/ri";
import { SiConvertio } from "react-icons/si";
import { FaEdit } from "react-icons/fa";
import { useRef, useState } from 'react';
import { LuLogOut, LuImport } from 'react-icons/lu';
import { GrProjects } from "react-icons/gr";
import { FaCircleArrowRight } from "react-icons/fa6";
import logo from "./assets/logo-Bg.png"
import SlidingPane from "react-sliding-pane";
import "react-sliding-pane/dist/react-sliding-pane.css";


import CustomDropdown from "./CustomDropdown.jsx";
import CodeEditor from "./CodeEditor";
import OutputFrame from "./OutputFrame";
import FileReaderComponent from './ImportFile.jsx';

function CodeIDE_Main() {
    const [theme, setTheme] = useState(true);
    const [prompt, setPrompt] = useState(true);
    const [mic, setMic] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const [convertLang, setConvertLang] = useState(false);
    const [changeProfile, setChangeProfile] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState("web");
    const [slidePanel, setSlidePanel] = useState(false);
    const [fileContent, setFileContent] = useState("");
    const [fileName, setFileName] = useState("");
    let outputFromVoice = "";
    var getOutput = "";
    var textPrompt = "";
    const generate = useRef();





    const getDefaultCode = (fileContent, fileName) => ({

        web: {
            html: (fileContent === "" || !fileName.includes(".html")) ? "<h1>Hello, World!</h1>" : fileContent,
            css: (fileContent === "" || !fileName.includes(".css")) ? "body { font-family: Arial; text-align: center; }" : fileContent,
            js: (fileContent === "" || !fileName.includes(".js")) ? "console.log('Hello, World!');" : fileContent,
        },
        javascript: (fileContent === "" || !fileName.includes(".js")) ? "console.log('Hello, World!');" : fileContent,
        python3: (fileContent === "" || !fileName.includes(".py")) ? 'print("Hello, World!")' : fileContent,
        java: (fileContent === "" || !fileName.includes(".java")) ? `public class Main {
        public static void main(String[] args) {
          System.out.println("Hello, World!");
        }
      }`: fileContent,

        c: (fileContent === "" || !fileName.includes(".c"))
            ? `#include <stdio.h>
      int main() {
        printf("Hello, World!\\n");
        return 0;
      }`
            : fileContent,
        cpp: (fileContent === "" || !fileName.includes(".cpp"))
            ? `#include <iostream>
      int main() {
        std::cout << "Hello, World!" << std::endl;
        return 0;
      }`: fileContent,
        rlang: (fileContent === "" || !fileName.includes(".r")) ? 'print("Hello, World!")' : fileContent,
        ruby: (fileContent === "" || !fileName.includes(".rb")) ? 'puts "Hello, World!"' : fileContent,
        php: (fileContent === "" || !fileName.includes(".php")) ? '<?php echo "Hello, World!"; ?>' : fileContent,
        golang: (fileContent === "" || !fileName.includes(".go")) ? `package main
      import "fmt"
      func main() {
        fmt.Println("Hello, World!")
      }` : fileContent,
    });



    const defaultCodes = getDefaultCode(fileContent, fileName);

    const [html, setHtml] = useState(defaultCodes.web.html);
    const [css, setCss] = useState(defaultCodes.web.css);
    const [js, setJs] = useState(defaultCodes.web.js);
    const [code, setCode] = useState(defaultCodes.javascript);
    var selectedLanguageForVoice = "";



    // This function will receive the file content
    const handleFileContent = (content, fileName) => {
        setFileContent(content);
        setFileName(fileName)
    };


    const handleLanguageChange = (newLanguage) => {
        setSelectedLanguage(newLanguage);

        if (newLanguage === "web") {
            setHtml(defaultCodes.web.html);
            setCss(defaultCodes.web.css);
            setJs(defaultCodes.web.js);
        } else {
            setCode(defaultCodes[newLanguage] || "");  // Ensure it updates the editor
        }
    };

    const exportFile = (code, language) => {
        let fileExtension = "";

        // Determine file extension based on language
        switch (language) {
            case "javascript": fileExtension = ".js"; break;
            case "python3": fileExtension = ".py"; break;
            case "java": fileExtension = ".java"; break;
            case "c": fileExtension = ".c"; break;
            case "cpp": fileExtension = ".cpp"; break;
            case "php": fileExtension = ".php"; break;
            case "ruby": fileExtension = ".rb"; break;
            case "golang": fileExtension = ".go"; break;
            case "rlang": fileExtension = ".r"; break;
            case "web": fileExtension = ".html"; break; // Default for web
            default: fileExtension = ".txt"; break;
        }

        // Create a Blob and trigger download
        const blob = new Blob([code], { type: "text/plain;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `codeSnippet${fileExtension}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };


    

    const callRecord = async () => {
        try {
            const response = await fetch('http://localhost:8080/CodeVision/SpeechToTextConvertServlet', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
        } catch (error) {
            console.error('Error:', error);
        }
    }

   

    const converter = async (lang) => {
        try {
            const response = await fetch("http://localhost:8080/CodeVision/CodeConvertorServlet", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams({ selectedLanguage, lang, code })
            })
            if (response.ok) {
                const data = await (response.text());
                setSelectedLanguage(lang);

                setCode(data);
            }
            <>
                <CustomDropdown selected={selectedLanguage} onSelect={handleLanguageChange} />
                <CodeEditor />
                
            </>
        }
        catch (error) {
            console.log("Failed to fetch");
        }
    }

    const generateCode = async () => {
        textPrompt = generate.current.value;
        if (textPrompt == "") {
            document.getElementById("field").innerText = "*Please fill this field";
            return;
        }
        else {
            document.getElementById("field").innerText = "";
        }
        geterateBothCodes(textPrompt, selectedLanguage);

    }

    const geterateBothCodes = async (prompt, lang) => {
        try {
            const response = await fetch("http://localhost:8080/CodeVision/GenerateCodeServlet", {
                method: 'Post',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams({ lang, prompt })
            })

            if (response.ok) {
                const data = await (response.text());
                let values = data.split(" TextLanguage:");
                setSelectedLanguage(values[1]);
                setCode(values[0]);

            }
            <>
                <CodeEditor />
                <CustomDropdown selected={selectedLanguage} onSelect={handleLanguageChange}/>
            </>
        }
        catch (error) {
            console.log("Failed to Fetch..");
        }
    }

    const output = async () => {

        const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyBGFGKKQmRAtoyVR2IfaNfLv3G5XxH2Apg", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: getOutput }],
                }],
            }),
        });

        const result = await response.text();

        const getCode = (text) => {
            const lines = text.split("\n").filter(line => line.trim() !== "");

            var arr = ["java", "js", "javascript", "python", "rlang", " r", "go", "golang", "php", "ruby", " c ", "cpp", "c++"];

            for (let i = 0; i < arr.length; i++) {
                if ((lines[0].toLowerCase()).includes(arr[i])) {
                    selectedLanguageForVoice = arr[i];
                    break;
                }
            }
            if (selectedLanguageForVoice == "js") {
                setSelectedLanguage("javascript");
                selectedLanguageForVoice = "javascript";
            }
            else if (selectedLanguageForVoice == "python") {
                setSelectedLanguage("python3");
                selectedLanguageForVoice = "python3";
            }
            else if (selectedLanguageForVoice == "go") {
                setSelectedLanguage("golang");
                selectedLanguageForVoice = "golang";
            }
            else if (selectedLanguageForVoice == " r") {
                setSelectedLanguage("rlang");
                selectedLanguageForVoice = "rlang";
            }
            else if (selectedLanguageForVoice == "c++") {
                setSelectedLanguage("cpp");
                selectedLanguageForVoice = "cpp";
            }
            else if (selectedLanguageForVoice == " c ") {
                setSelectedLanguage("c");
                selectedLanguageForVoice = "c";
            }

            handleLanguageChange(selectedLanguageForVoice)

            return lines.slice(1, -1).join("\n");
        }


        const extractCode = (response) => {

            let responseObj = JSON.parse(response)
            const result1 = responseObj.candidates[0].content.parts[0].text
            getOutput = result1;
            outputFromVoice = getCode(getOutput)
            
            setCode(outputFromVoice);
            return(
                
                <>
                <CodeEditor code={setCode(outputFromVoice)}/>
                </>
            )
            
        };
        extractCode(result)

    }




    const stopRecording = async () => {
        try {
            const response = await fetch("http://localhost:8080/CodeVision/SpeechToTextConvertServlet/StopRecording", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const responseObj = await response.json();
            const result = responseObj.candidates[0].content.parts[0];
            getOutput = result + " without mentioning any other text or language or single quotes";

            // geterateBothCodes(getOutput,selectedLanguage);

            setTimeout(()=>{
                output();
            },2000)

        } catch (error) {
            console.error("Error stopping recording:", error);
        }
    };

    const beautifier = async () => {
        try {
            const response = await fetch("http://localhost:8080/CodeVision/CodeBeautifyServlet", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams({ code, selectedLanguage }),
            });
            if (response.ok) {
                const data = await response.text();
                setCode(data);
            } else {
                console.log("Error Status: ", response.status);
            }
            return(
                <CodeEditor/>
            )
    
        }
        catch (error) {
            console.log("Failed to fetch")
        }
    }

    if (theme) {
        return (

            <div className="w-screen h-screen overflow-hidden grid grid-rows-40 grid-cols-20 p-5 gap-2 bg-gray-100 2xl:max-2xl:h-screen 2xl:max-2xl:overflow-hidden xl:max-2xl:w-screen xl:max-2xl:h-screen xl:max-2xl:overflow-hidden lg:max-xl:w-screen lg:max-xl:h-screen lg:max-xl:overflow-hidden  md:max-lg:w-screen  md:max-lg:h-screen md:max-lg:overflow-x-hidden md:max-lg:overflow-y-scroll sm:max-md:overflow-x-hidden sm:max-md:overflow-y-scroll" >

                <div className="row-span-3 col-span-29 grid-cols-22 grid rounded-xl bg-white shadow-neutral-300 shadow-md inset-shadow-sm inset-shadow-neutral-200 lg:max-xl:grid-cols-35 md:max-lg:grid-cols-12 md:max-lg:h-17">
                    <div className="grid-cols-1 m-1 w-20 h-17 rounded-full 2xl:max-2xl:15 2xl:max-2xl:h-15 xl:max-2xl:h-13 xl:max-2xl:p-1 lg:max-xl:h-13 lg:max-xl:p-1 lg:max-xl:col-span-2 md:max-lg:p-1.5 md:max-lg:col-span-1 sm:max-md:p-1.5  sm:max-md:col-span-2 relative">
                        <img src={logo} className='rounded-full 2xl:max-2xl:w-15 2xl:max-2xl:h-15 xl:max-2xl:w-13 xl:max-2xl:h-13 lg:max-xl:w-12 lg:max-xl:h-12 md:max-lg:w-13 md:max-lg:h-13 sm:max-md:h-12 sm:max-md:w-12 cursor-pointer' onClick={() => setShowProfile(!showProfile)}></img>
                    </div>

                    <div className='col-span-3 w-56 h-18 p-3 2xl:max-2xl:w-56 2xl:max-2xl:h-10 2xl:max-2xl:p-2.5 xl:max-2xl:h-8 xl:max-2xl:p-3 lg:max-xl:p-2.5 lg:max-xl:col-span-6 md:max-lg:p-2.5 md:max-lg:col-span-4 sm:max-md:p-2 sm:max-md:col-span-7'>
                        <CustomDropdown selected={selectedLanguage} onSelect={handleLanguageChange} />
                    </div>
                    <div className='col-span-1 w-40 h-15 2xl:max-2xl:p-2.5 2xl:max-2xl:ml-3 xl:max-2xl:p-3 lg:max-xl:p-3 lg:max-xl:ml-4 lg:max-xl:col-span-4 md:max-lg:col-span-1 md:max-lg:p-0.5 sm:max-md:p-0'>

                        <label htmlFor="file-input" className='items-center flex justify-center'>
                            <LuImport className="text-gray-600 h-20 w-10 md:max-lg:h-15 md:max-lg:w-8 mb-2 cursor-pointer" />
                            <FileReaderComponent onFileRead={handleFileContent} triggerId="file-input" />
                        </label>
                    </div>
                    <div className='flex  items-center justify-center pt-1.5 col-span-1 w-40 h-15 2xl:max-2xl:p-2.5 2xl:max-2xl:ml-3 xl:max-2xl:p-3 lg:max-xl:p-3 lg:max-xl:ml-4 lg:max-xl:col-span-4 md:max-lg:col-span-1 md:max-lg:p-0.5 sm:max-md:p-0'>
                        <CgExport className='text-gray-600 h-20 w-10 md:max-lg:h-13 md:max-lg:w-8 cursor-pointer' onClick={() => exportFile(code, selectedLanguage)} />
                    </div>
                    <div className='flex items-center justify-center pt-2 col-span-1 w-40 h-15 2xl:max-2xl:p-2.5 2xl:max-2xl:ml-3 lg:max-xl:p-3 xl:max-2xl:p-3 lg:max-xl:ml-4 md:max-lg:col-span-1 md:max-lg:p-0.5 sm:max-md:p-0'>
                        <PiButterflyFill className='text-gray-600 md:max-lg:h-13 md:max-lg:w-8 h-20 w-10 cursor-pointer' onClick={beautifier} />
                    </div>
                    <div className='col-span-11 xl:max-2xl:col-span-5 md:max-lg:col-span-1 lg:max-xl:col-span-6  sm:max-md:col-span-1'></div>
                    <div className='text-gray-600 flex items-center col-span-1 w-17 h-17 2xl:max-2xl:h-10 2xl:max-2xl:p-3 xl:max-2xl:p-3 xl:max-2xl:h-8 lg:max-xl:p-3 md:max-lg:p-4 md:max-lg:col-span-1 sm:max-md:p-2.5  sm:max-md:col-span-2' onClick={() => setTheme(!theme)}>
                        {theme && <Moon className='w-8 h-8 xl:max-2xl:h-8 xl:max-2xl:w-7 md:max-lg:max-lg:h-7 md:max-lg:max-lg:w-7 cursor-pointer' />}

                    </div>
                    <div className='flex items-center pt-1.5 col-span-1 w-40 h-15 2xl:max-2xl:p-2.5 lg:max-xl:col-span-4 lg:max-xl:ml-4 lg:max-xl:p-3 md:max-lg:col-span-1 md:max-lg:p-0.5  sm:max-md:p-0'>
                        <MdOutlineSave className='text-gray-500 md:max-lg:h-13 md:max-lg:w-8 h-20 w-10 cursor-pointer' />
                    </div>
                    <div className='flex items-center col-span-1 w-45 h-15 pt-1.5 2xl:max-2xl:p-2.5 lg:max-xl:ml-4 lg:max-xl:p-3 lg:max-xl:col-span-3 sm:max-lg:hidden'>
                        {prompt &&
                            <RiAiGenerate2 className='text-gray-700 md:max-lg:h-13 md:max-lg:w-8 h-20 w-10 cursor-pointer' onClick={() => setPrompt(!prompt)} />
                        }
                        {!prompt &&
                            <RiAiGenerate2 className='text-gray-700 md:max-lg:h-13 md:max-lg:w-8 h-20 w-10 cursor-pointer' onClick={() => setPrompt(!prompt)} />
                        }
                    </div>
                    <div className="grid-cols-1 w-18 h-18 rounded-full 2xl:max-2xl:15 2xl:max-2xl:h-15 xl:max-2xl:h-13 xl:max-2xl:p-1 lg:max-xl:h-13 lg:max-xl:p-1 lg:max-xl:col-span-2 md:max-lg:p-1.5 md:max-lg:col-span-1 sm:max-md:p-1.5  sm:max-md:col-span-2 relative">
                        <img src="https://i.postimg.cc/fbfvCLrQ/p1.png" className='rounded-full 2xl:max-2xl:w-15 2xl:max-2xl:h-15 xl:max-2xl:w-13 xl:max-2xl:h-13 lg:max-xl:ml-9 lg:max-xl:w-12 lg:max-xl:h-12 md:max-lg:w-13 md:max-lg:h-13 sm:max-md:h-12 sm:max-md:w-12 cursor-pointer' onClick={() => setSlidePanel(!slidePanel)}></img>
                    </div>


                    {slidePanel && (
                <SlidingPane
                    closeIcon={
                        <span className="text-3xl font-bold cursor-pointer text-red-500 hover:text-red-700 transition duration-200">
                            X
                        </span>
                    }
                    isOpen={slidePanel}
                    title="My Profile"
                    width="500px"
                    onRequestClose={() => setSlidePanel(false)}
                    className="!p-5"
                >
                    <div className="flex flex-col gap-6 p-3">
                        {/* Profile Section */}
                        <div className="flex flex-col items-center gap-5 p-6 bg-white rounded-xl shadow-lg border border-gray-200">
                            {/* Profile Image */}
                            <div className="relative w-28 h-28">
                                <img
                                    src={profileImage}
                                    alt="Profile"
                                    className="w-full h-full rounded-full border-4 border-gray-300 shadow-md object-cover"
                                />
                                <label className="absolute bottom-1 right-1 bg-blue-500 p-2 rounded-full cursor-pointer shadow-md hover:bg-blue-600 transition duration-200">
                                    <FaEdit className="text-white text-lg" />
                                    <input type="file" className="hidden" onChange={handleProfileImageChange} />
                                </label>
                            </div>

                            {/* User Details */}
                            <div className="w-full flex flex-col gap-3 text-center">
                                {/* Name Edit */}
                                <div className="flex flex-col items-center">
                                    <label className="text-sm font-semibold text-gray-700">User Name</label>
                                    <input
                                        value={userName}
                                        onChange={(e) => setUserName(e.target.value)}
                                        placeholder="Enter new username"
                                        className="w-3/4 h-11 px-4 text-sm border rounded-lg border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 text-center"
                                    />
                                </div>

                                {/* Email (Non-Editable) */}
                                <div className="flex flex-col items-center">
                                    <label className="text-sm font-semibold text-gray-700">Email</label>
                                    <input
                                        value={email}
                                        className="w-3/4 h-11 px-4 text-sm border rounded-lg border-gray-300 bg-gray-200 text-gray-600 cursor-not-allowed text-center"
                                        disabled
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Saved Projects Section */}
                        <div className="flex flex-col gap-3 p-4 bg-white rounded-lg shadow-md border border-gray-200">
                            <h2 className="text-lg font-semibold text-gray-800">My Projects</h2>

                            {projects.length > 0 ? (
                                projects.map((project, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between p-3 bg-gray-100 rounded-md shadow-sm hover:bg-gray-200 transition duration-200"
                                    >
                                        <span className="text-gray-800">{project.name}</span>
                                        <button
                                            className="text-blue-500 text-sm font-medium hover:underline"
                                            onClick={() => openProject(project)}
                                        >
                                            Open
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500 text-sm italic text-center">No projects saved</p>
                            )}
                        </div>

                        {/* Logout Button */}
                        <div
                            className="mt-auto flex items-center gap-4 px-6 py-4 rounded-lg cursor-pointer transition duration-300 bg-red-500 text-white font-semibold shadow-md hover:bg-red-600 active:bg-red-700"
                            onClick={() => navigate("/logout")}
                        >
                            <LuLogOut className="text-2xl" />
                            <span className="text-lg">Logout</span>
                        </div>
                    </div>
                </SlidingPane>
            )}

                </div>
                {prompt &&
                    <div className=' row-span-3 col-span-29 grid-cols-23 grid rounded-2xl bg-white shadow-md shadow-neutral-300 md:max-lg:p-1.5 md:max-lg:h-18 md:max-lg:mt-2'>
                        <div className='flex  items-center justify-between flex-wrap col-span-15  h-13 mt-2 ml-1 2xl:max-2xl:h-15 lg:max-xl:col-span-14 md:max-lg:col-span-8 sm:max-md:col-span-13'>
                            <input className='p-2 rounded-xl border-gray-300 border w-6xl h-12 2xl:max-2xl:h-10 2xl:max-2xl:w-5xl xl:max-2xl:h-10 xl:max-2xl:w-3xl lg:max-xl:h-10 lg:max-xl:w-xl md:max-lg:h-10 md:max-lg:w-3xs sm:max-md:w-xs sm:max-md:h-10' placeholder='Enter your prompt here...' ref={generate}></input>
                            <p className='text-red-600 text-xs ml-5' id="field"></p>
                        </div>
                        <div className='col-span-1 p-5 w-17 h-17 2xl:max-2xl:13 2xl:max-2xl:p-2.5 xl:max-2xl:p-3 xl:max-2xl:col-span-2 lg:max-xl:p-2.5 md:max-lg:p-2.5 md:max-lg:col-span-8 sm:max-md:p-3.5 sm:max-md:col-span-6' onClick={() => setMic(!mic)}>
                            {mic && <Mic className='w-8 h-8 xl:max-2xl:h-7 md:max-lg:w-7 md:max-lg:h-7 sm:max-md:h-7 sm:max-md:w-7 cursor-pointer text-red-500' onClick={stopRecording} />}
                            {!mic && <MicOff className='w-8 h-8 xl:max-2xl:h-7 md:max-lg:w-7 md:max-lg:h-7 sm:max-md:h-7 sm:max-md:w-7 cursor-pointer' onClick={callRecord} />}

                        </div>
                        <div className='ml-4 flex pt-2 items-center col-span-6 w-40 h-15 2xl:max-2xl:p-2.5 xl:max-2xl:p-2 lg:max-xl:col-span-3 lg:max-xl:p-3 md:max-lg:p-2 md:max-lg:col-span-4 sm:max-md:p-1'>
                            <FaCircleArrowRight className='text-blue-600 sm:max-md: sm:max-md:h-13 sm:max-md:w-8 h-20 w-10 cursor-pointer' onClick={generateCode} />
                        </div>
                        <div className='flex items-center ml-5 col-span-1 w-40 h-15  2xl:max-2xl:p-2.5 xl:max-2xl:p-2 xl:max-2xl:ml-7 lg:max-xl:p-3 md:max-lg:p-2 sm:max-md:p-1'>
                            <SiConvertio className='text-gray-600 sm:max-md:h-13 sm:max-md:w-7 h-20 w-10 cursor-pointer' onClick={() => setConvertLang(!convertLang)} />
                        </div>
                        {convertLang && <div className='absolute right-4 z-10 w-50 h-120 mt-20 bg-white font-extrabold text-left rounded-xl shadow-xl shadow-gray-500'>
                            <ul>
                                <li className=' flex items-center hover:bg-gray-300 h-13' onClick={() => { setConvertLang(!convertLang); converter("java") }}>
                                    <p className='ml-6'>Java</p>

                                </li>
                                <li className=' flex items-center hover:bg-gray-300 h-13' onClick={() => {  setConvertLang(!convertLang); converter("javascript") }}>
                                    <p className='ml-6'>JavaScript</p>
                                </li>
                                <li className=' flex items-center hover:bg-gray-300 h-13' onClick={() => {  setConvertLang(!convertLang); converter("python3") }}>
                                    <p className='ml-6'>Python</p>
                                </li>
                                <li className=' flex items-center hover:bg-gray-300 h-13' onClick={() => {  setConvertLang(!convertLang); converter("c") }}>
                                    <p className='ml-6'>C</p>
                                </li>
                                <li className=' flex items-center hover:bg-gray-300 h-13' onClick={() => { setConvertLang(!convertLang); converter("cpp") }}>
                                    <p className='ml-6'>C++</p>
                                </li>
                                <li className=' flex items-center hover:bg-gray-300 h-13' onClick={() => { setConvertLang(!convertLang); converter("php") }}>
                                    <p className='ml-6'>Php</p>
                                </li>
                                <li className=' flex items-center hover:bg-gray-300 h-13' onClick={() => { setConvertLang(!convertLang); converter("ruby") }}>
                                    <p className='ml-6'>Ruby</p>
                                </li>
                                <li className=' flex items-center hover:bg-gray-300 h-13' onClick={() => {  setConvertLang(!convertLang); converter("golang") }}>
                                    <p className='ml-6'>Go</p>
                                </li>
                                <li className=' flex items-center hover:bg-gray-300 h-13' onClick={() => { setConvertLang(!convertLang); converter("rlang") }}>
                                    <p className='ml-6'>R</p>
                                </li>

                            </ul>
                        </div>}

                    </div>
                }

                <div className="row-span-34 col-span-29 p-2 grid grid-cols-2 gap-5 sm:max-lg:grid-cols-1 md:max-lg:mt-2">
                    <div className='inset-shadow-sm inset-shadow-neutral-200 h-220 shadow-md shadow-neutral-400 rounded-xl p-4 grid grid-rows-24 2xl:p-2.5 2xl:grid-cols-15 md:max-lg:grid-rows-28 md:max-lg:gap-1 md:max-lg:p-4 '>

                        <CodeEditor
                            className='border border-gray-300 rounded-xl p-5 row-span-22 col-span-20 2xl:max-2xl:col-span-15 xl:max-2xl:w-xl lg:max-xl:w-110 md:max-lg:w-2xl md:max-lg:row-span-25 md:max-lg:mt-1.5 sm:max-md:mt-2.5 sm:max-md:w-140' style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                            html={html} setHtml={setHtml}
                            css={css} setCss={setCss}
                            js={js} setJs={setJs}
                            code={code} setCode={setCode}
                            selectedLanguage={selectedLanguage}
                        />


                    </div>
                    <div disabled className=' inset-shadow-sm inset-shadow-neutral-200 h-220 shadow-md shadow-neutral-400 rounded-xl pl-3 grid grid-rows-24 2xl:max-2xl:p-2.5 2xl:max-2xl:grid-cols-15 md:max-lg:grid-rows-28 md:max-lg:gap-1'>
                        <OutputFrame
                            className='border border-gray-300 rounded-xl p-5 shadow-md row-span-22 2xl:max-2xl:col-span-15 xl:max-2xl:w-xl lg:max-xl:w-110 md:max-lg:w-2xl md:max-lg:row-span-25 sm:max-md:mt-2.5 sm:max-md:w-140 text-gray-500' style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                            html={html} css={css} js={js} code={code}
                            selectedLanguage={selectedLanguage}
                        />
                    </div>
                </div>
            </div >
        )
    }
    else {
        return (
            <div className="w-screen h-screen overflow-hidden grid grid-rows-40 grid-cols-20 p-5 gap-2 bg-gray-100 2xl:max-2xl:w-screen 2xl:max-2xl:h-screen 2xl:max-2xl:overflow-hidden xl:max-2xl:w-screen xl:max-2xl:h-screen xl:max-2xl:overflow-hidden lg:max-xl:w-screen lg:max-xl:h-screen lg:max-xl:overflow-hidden  md:max-lg:w-screen md:max-lg:h-screen md:max-lg:overflow-x-hidden sm:max-md:overflow-x-hidden" id="wholeDiv">
                <div className="row-span-3 col-span-29 grid-cols-22 grid rounded-xl bg-white shadow-neutral-300 shadow-md inset-shadow-sm inset-shadow-neutral-200 lg:max-xl:grid-cols-35 md:max-lg:grid-cols-12 md:max-lg:h-17 md:max-lg:p-1" id='textArea'>
                    <div className="relative grid-cols-1 p-1 m-0.5 w-20 h-17 rounded-full 2xl:max-2xl:15 2xl:max-2xl:h-15 xl:max-2xl:h-13 xl:max-2xl:p-1 lg:max-xl:h-13 lg:max-xl:p-1 lg:max-xl:col-span-2 md:max-lg:p-1.5 md:max-lg:col-span-1 sm:max-md:p-1.5  sm:max-md:col-span-2">
                        <img src={logo} className='rounded-full 2xl:max-2xl:w-15 2xl:max-2xl:h-15 xl:max-2xl:w-13 xl:max-2xl:h-13 lg:max-xl:w-12 lg:max-xl:h-12 md:max-lg:w-13 md:max-lg:h-13 sm:max-md:h-12 sm:max-md:w-12 cursor-pointer'></img>
                    </div>


                    <div className='col-span-3 w-56 h-18 p-3 2xl:max-2xl:w-56 2xl:max-2xl:h-10 2xl:max-2xl:p-2.5 xl:max-2xl:h-8 xl:max-2xl:p-3 lg:max-xl:p-2.5 lg:max-xl:col-span-6 md:max-lg:p-2.5 md:max-lg:col-span-4 sm:max-md:p-2 sm:max-md:col-span-7'>
                        <CustomDropdown selected={selectedLanguage} onSelect={handleLanguageChange} />
                    </div>
                    <div className='flex items-center justify-center col-span-1 w-40 h-15 2xl:max-2xl:p-2.5 2xl:max-2xl:ml-3 xl:max-2xl:p-3 lg:max-xl:p-3 lg:max-xl:ml-4 lg:max-xl:col-span-4 md:max-lg:col-span-1 md:max-lg:p-0.5 sm:max-md:p-0'>

                        <label htmlFor="file-input" className='items-center flex justify-center mt-3'>
                            <LuImport className="md:max-lg:h-15 md:max-lg:w-8 w-10 h-20 text-gray-200 cursor-pointer" />
                            <FileReaderComponent onFileRead={handleFileContent} triggerId="file-input" />
                        </label>
                    </div>
                    <div className='flex items-center justify-center col-span-1 w-40 h-15 p-1.5 2xl:max-2xl:p-2.5 2xl:max-2xl:ml-3 xl:max-2xl:p-3 lg:max-xl:p-3 lg:max-xl:ml-4 lg:max-xl:col-span-4 md:max-lg:col-span-1 md:max-lg:p-0.5 sm:max-md:p-0'>
                        <CgExport className='sm:max-lg:h-13 sm:max-lg:w-8 h-20 w-10 text-gray-200  cursor-pointer' />
                    </div>
                    <div className='flex items-center justify-center col-span-1 w-40 h-15 pt-1.5 2xl:max-2xl:p-2.5 2xl:max-2xl:ml-3 xl:max-2xl:p-3 lg:max-xl:p-3 lg:max-xl:ml-4 lg:max-xl:col-span-4 md:max-lg:col-span-1 md:max-lg:p-0.5 sm:max-md:p-0'>
                        <PiButterflyFill className='sm:max-lg:h-13 sm:max-lg:w-8 h-20 w-10 text-gray-200  cursor-pointer' />
                    </div>
                    <div className='col-span-11 xl:max-2xl:col-span-5 md:max-lg:col-span-1 lg:max-xl:col-span-6  sm:max-md:col-span-1'></div>
                    <div className='flex items-center col-span-1 w-17 h-17 2xl:max-2xl:h-10 2xl:max-2xl:p-3 xl:max-2xl:p-3 xl:max-2xl:h-8 lg:max-xl:p-3 md:max-lg:p-4 md:max-lg:col-span-1 sm:max-md:p-2.5  sm:max-md:col-span-2' onClick={() => setTheme(!theme)}>
                        {!theme && <Sun className='w-8 h-8 xl:max-2xl:h-8 xl:max-2xl:w-7  md:max-lg:h-7 md:max-lg:w-7 text-gray-200  cursor-pointer' />}

                    </div>
                    <div className='flex items-center col-span-1 w-40 h-15 pt-1.5 2xl:max-2xl:p-2.5 2xl:max-2xl:ml-3 lg:max-xl:col-span-4 lg:max-xl:ml-4 lg:max-xl:p-3 md:max-lg:col-span-1 md:max-lg:p-0.5  sm:max-md:p-0'>
                        <MdOutlineSave className='sm:max-lg: sm:max-lg:h-13 sm:max-lg:w-8 h-20 w-10 text-gray-200  cursor-pointer' />
                    </div>
                    <div className='flex items-center col-span-1 w-45 h-15 pt-1.5 2xl:max-2xl:p-2.5 2xl:max-2xl:ml-3 lg:max-xl:ml-4 lg:max-xl:p-3 lg:max-xl:col-span-3 md:max-lg:hidden sm:max-lg:hidden'>
                        {prompt &&
                            <RiAiGenerate2 className='w-10 h-20 2xl:max-2xl:h-10 xl:max-2xl:w-29 xl:max-2xl:h-9  lg:max-xl:h-9 lg:max-xl:w-27  cursor-pointer  text-gray-200' onClick={() => setPrompt(!prompt)} />
                        }
                        {!prompt &&
                            <RiAiGenerate2 className='w-10 h-20 2xl:max-2xl:h-10 xl:max-2xl:w-29 xl:max-2xl:h-9  lg:max-xl:h-9 lg:max-xl:w-27  cursor-pointer text-gray-200' onClick={() => setPrompt(!prompt)} />
                        }
                    </div>
                    <div className="relative grid-cols-1 w-18 h-18 rounded-full 2xl:max-2xl:15 2xl:max-2xl:h-15 xl:max-2xl:h-13 xl:max-2xl:p-1 lg:max-xl:h-13 lg:max-xl:p-1 lg:max-xl:col-span-2 md:max-lg:p-1.5 md:max-lg:col-span-1 sm:max-md:p-1.5  sm:max-md:col-span-2">
                        <img src="https://i.postimg.cc/fbfvCLrQ/p1.png" className='rounded-full 2xl:max-2xl:w-15 2xl:max-2xl:h-15 xl:max-2xl:w-13 xl:max-2xl:h-13 lg:max-xl:w-12 lg:max-xl:h-12 md:max-lg:w-13 md:max-lg:h-13 sm:max-md:h-12 sm:max-md:w-12 cursor-pointer' onClick={() => setShowProfile(!showProfile)}></img>
                    </div>
                    {showProfile && <div className='absolute right-0 z-10 w-50 h-50 mt-20 bg-gray-800 text-white font-extrabold text-left rounded-xl shadow-lg shadow-gray-500'>

                        <h4 className='flex items-center h-13 hover:bg-gray-500'>
                            <p className='ml-5'>User Name</p></h4>
                        <ul>
                            <li className='flex items-center gap-2 hover:bg-gray-500 h-13'>
                                <FaEdit className='ml-5 cursor-pointer' /> Edit Profile
                            </li>
                            <li className='flex items-center gap-2 hover:bg-gray-500 h-13'>
                                <LuLogOut className='ml-5 cursor-pointer' /> Logout
                            </li>

                        </ul>
                    </div>}
                </div>
                {prompt &&
                    <div className='row-span-3 col-span-29 grid-cols-23 grid rounded-2xl bg-white shadow-md shadow-neutral-300 md:max-lg:h-18 md:max-lg:p-1.5' id='textArea'>
                        <div className='col-span-15 p-2 h-18 2xl:max-2xl:h-15 lg:max-xl:col-span-14 md:max-lg:col-span-8 sm:max-md:col-span-13'>
                            <input className='p-2 rounded-xl border-gray-300 border w-6xl h-13 2xl:max-2xl:h-10 2xl:max-2xl:w-5xl xl:max-2xl:h-10 xl:max-2xl:w-3xl lg:max-xl:h-10 lg:max-xl:w-xl md:max-lg:h-10 md:max-lg:w-3xs sm:max-md:w-xs sm:max-md:h-10' id='promptTag' placeholder='Enter your prompt here...'></input>
                        </div>
                        <div className='col-span-1 p-5 w-17 h-17 2xl:max-2xl:13 2xl:max-2xl:p-2.5 xl:max-2xl:p-3 xl:max-2xl:col-span-2 lg:max-xl:p-2.5 md:max-lg:p-2.5 md:max-lg:col-span-8 sm:max-md:p-3.5 sm:max-md:col-span-6' onClick={() => setMic(!mic)}>
                            {mic && <Mic className='w-8 h-8 xl:max-2xl:h-7 text-red-500 md:max-lg:w-7 md:max-lg:h-7 sm:max-md:h-7 sm:max-md:w-7  cursor-pointer' onClick={stopRecording} />}
                            {!mic && <MicOff className='w-8 h-8 xl:max-2xl:h-7 text-white md:max-lg:w-7 md:max-lg:h-7 sm:max-md:h-7 sm:max-md:w-7  cursor-pointer' onClick={callRecord} />}

                        </div>
                        <div className='flex items-center col-span-6 w-40 h-15 p-4 2xl:max-2xl:p-2.5 2xl:max-2xl:ml-3 xl:max-2xl:p-2 lg:max-xl:col-span-3 lg:max-xl:p-3 md:max-lg:p-2 md:max-lg:col-span-4 sm:max-md:p-1'>
                            <FaCircleArrowRight className='sm:max-md:h-13 sm:max-md:w-8 h-20 w-10 text-blue-600  cursor-pointer' />
                        </div>
                        <div className='col-span-1 flex items-center w-40 h-15 p-4 2xl:max-2xl:p-2.5 2xl:max-2xl:ml-3 xl:max-2xl:p-2 lg:max-xl:p-3 md:max-lg:p-2 sm:max-md:p-1'>
                            <SiConvertio className='sm:max-md:h-13 sm:max-md:w-7 h-20 w-10 text-gray-200  cursor-pointer' />
                        </div>
                    </div>
                }

                <div className="row-span-34 col-span-29 p-2 grid grid-cols-2 gap-5 sm:max-lg:grid-cols-1 md:max-lg:mt-2">
                    <div className=' inset-shadow-sm inset-shadow-neutral-200 shadow-md shadow-neutral-400 rounded-xl p-4 grid grid-rows-24 2xl:max-2xl:p-2.5 2xl:max-2xl:grid-cols-15 md:max-lg:grid-rows-28 md:max-lg:gap-1' id='textArea'>

                        <CodeEditor
                            className='border border-gray-300 rounded-xl p
                console.log(convertedCode);-5 row-span-22 col-span-20 2xl:max-2xl:col-span-15 xl:max-2xl:w-xl lg:max-xl:w-110 md:max-lg:w-2xl md:max-lg:row-span-25 md:max-lg:mt-1.5 sm:max-md:mt-2.5 sm:max-md:w-140' style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                            html={html} setHtml={setHtml}
                            css={css} setCss={setCss}
                            js={js} setJs={setJs}
                            code={code} setCode={setCode}
                            selectedLanguage={selectedLanguage}
                        />
                    </div>
                    <div disabled className=' inset-shadow-sm inset-shadow-neutral-200 shadow-md shadow-neutral-400 rounded-xl p-4 grid grid-rows-24 2xl:max-2xl:p-2.5 2xl:max-2xl:grid-cols-15 md:max-lg:grid-rows-28 md:max-lg:gap-1' id='textArea'>
                        <OutputFrame
                            className='border border-gray-300 rounded-xl p-5 shadow-md row-span-22 text-white 2xl:max-2xl:col-span-15 xl:max-2xl:w-xl lg:max-xl:w-110 md:max-lg:w-2xl md:max-lg:row-span-25 sm:max-md:mt-2.5 sm:max-md:w-140 ' id='input' style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                            html={html} css={css} js={js} code={code}
                            selectedLanguage={selectedLanguage}
                        />
                    </div>
                </div>
            </div >
        )
    }


}



export default CodeIDE_Main;