import { Mic, MicOff } from 'lucide-react'
import { MdDarkMode } from "react-icons/md";
import { IoIosSunny } from "react-icons/io";
// import { CgExport } from "react-icons/cg";
import { PiButterflyFill } from "react-icons/pi";
import { MdOutlineSave } from "react-icons/md";
import { RiAiGenerate2 } from "react-icons/ri";
import { RiExchangeLine } from "react-icons/ri";
import profileImage from "./assets/Default_Profile.png";

// import { LuImport } from 'react-icons/lu';

import { FaEdit } from "react-icons/fa";
import { useEffect, useRef, useState } from 'react';
import { FaCircleArrowRight } from "react-icons/fa6";
import logo from "./assets/logo-noBg.png"
import logo1 from "./assets/CodeAiD_DarkTheme.png";
import SlidingPane from "react-sliding-pane";
import "react-sliding-pane/dist/react-sliding-pane.css";
import { useNavigate } from "react-router-dom";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolderOpen, faDownload, faWandMagicSparkles, faBars } from '@fortawesome/free-solid-svg-icons';


import CustomDropdown from "./CustomDropdown.jsx";
import CodeEditor from "./CodeEditor";
import OutputFrame from "./OutputFrame";
import FileReaderComponent from './ImportFile.jsx';
import SlidingPanel from './SlidingPanel.jsx';

function CodeIDE_Main() {
    const [theme, setTheme] = useState(true);
    const [prompt, setPrompt] = useState(true);
    const [mic, setMic] = useState(false);
    const [convertLang, setConvertLang] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState("web");
    const [slidePanel, setSlidePanel] = useState(false);
    const [fileContent, setFileContent] = useState("");
    const [fileName, setFileName] = useState("");
    const [projects, setProjects] = useState([]);
    const [userProfile, setUserProfile] = useState(null);
    const [loadingProfile, setLoadingProfile] = useState(true);
    const [isEditingName, setIsEditingName] = useState(false);
    const [editName, setEditName] = useState("");
    const dropdownRef = useRef(null);

    let outputFromVoice = "";
    var getOutput = "";
    const generate = useRef();


    const navigate = useNavigate();


    const getDefaultCode = (fileContent, fileName) => (
        {
            web: {
                html: (fileContent === "" || !fileName.includes(".html")) ? "<h1>Hello, World!</h1>" : fileContent,
                css: (fileContent === "" || !fileName.includes(".css")) ? "body { font-family: Arial; text-align: center; }" : fileContent,
                js: (fileContent === "" || !fileName.includes(".js")) ? "console.log('Hello, World!');" : fileContent,
            },
            javascript: "console.log('Hello, World!');",
            python3: 'print("Hello, World!")',
            java: `public class Main {
        public static void main(String[] args) {
          System.out.println("Hello, World!");
        }
      }`,

            c: `#include <stdio.h>
      int main() {
        printf("Hello, World!\\n");
        return 0;
      }`,
            cpp: `#include <iostream>
      int main() {
        std::cout << "Hello, World!" << std::endl;
        return 0;
      }`,
            rlang: 'print("Hello, World!")',
            ruby: 'puts "Hello, World!"',
            php: '<?php echo "Hello, World!"; ?>',
            golang: `package main
      import "fmt"
      func main() {
        fmt.Println("Hello, World!")
      }` ,

        });




    const defaultCodes = getDefaultCode(fileContent, fileName);



    const [html, setHtml] = useState(defaultCodes.web.html);
    const [css, setCss] = useState(defaultCodes.web.css);
    const [js, setJs] = useState(defaultCodes.web.js);
    const [code, setCode] = useState(defaultCodes.javascript);
    var selectedLanguageForVoice = "";


    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await fetch("http://localhost:8080/CodeVision/FetchUserDetailsServlet", {
                    method: "GET",
                    credentials: "include",
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch profile");
                }
                const data = await response.json();
                console.log(data);
                setUserProfile(data);
            }
            catch {
                console.error("Error fetching profile:", error);
                setUserProfile(null);
            }
            finally {
                setLoadingProfile(false);
            }
        };
        fetchUserProfile();
    }, []);

    // Validate image URL
    const isValidImageUrl = (url) => {
        if (!url || typeof url !== "string") return false;
        const dataUriPattern = /^data:image\/[a-zA-Z]+;base64,/i;
        return dataUriPattern.test(url); // Ensures valid MIME type (e.g., image/png)
    };

    // This function will receive the file content
    const handleFileContent = (content, fileName, language) => {
        setFileContent(content);
        setFileName(fileName);
        setSelectedLanguage(language);
        <CustomDropdown selected={language} />
        setCode(content);
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
                },
                credentials: 'include',
            });
        } catch (error) {
            console.error('Error:', error);
        }
    }



    const codeConverter = async (lang) => {
        console.log(lang);
        console.log(code);

        getOutput = "Covert this code into " + lang + " \n" + code +
            "\n . Don't give any other text or mention any other language. Just give only code. If the language need Main class like that, give with that.";

        setSelectedLanguage(lang);

        // output();
        try {
            const response = await fetch("http://localhost:8080/CodeVision/CodeConvertorServlet", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                credentials: 'include',
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

    const generateCodeFromText = async () => {
        // getOutput = generate.current.value+ " without mentioning any other text or languange. Give only one method don't give more.";
        getOutput = generate.current.value;
        if (getOutput == "") {
            document.getElementById("field").innerText = "*Please fill this field";
            return;
        }
        else {
            document.getElementById("field").innerText = "";
        }
        geterateBothCodes(getOutput, selectedLanguage);


        // setTimeout(()=>{
        //     output();
        // },2000)

    }

    const geterateBothCodes = async (prompt, lang) => {
        if (lang === "web") {
            lang = "javascript";
            setSelectedLanguage("javascript")
        }
        try {
            const response = await fetch("http://localhost:8080/CodeVision/GenerateCodeServlet", {
                method: 'Post',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                credentials: 'include',
                body: new URLSearchParams({ lang, prompt })
            })

            if (response.ok) {
                const data = await (response.text());
                let values = data.split(" TextLanguage:");
                setSelectedLanguage(values[1]);
                setCode(values[0]);
                generate.current.value = "";

            }
            <>
                <CodeEditor />
                <CustomDropdown selected={selectedLanguage} onSelect={handleLanguageChange} />
            </>
        }
        catch (error) {
            console.log("Failed to Fetch..");
        }
    }

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
        console.log(code);
        return (

            <>
                <CodeEditor code={setCode(outputFromVoice)} />
            </>
        )

    };

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

        extractCode(result)

    }

    const stopRecording = async () => {
        try {
            const response = await fetch("http://localhost:8080/CodeVision/SpeechToTextConvertServlet/StopRecording", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const responseObj = await response.json();
            const result = responseObj.candidates[0].content.parts[0];
            getOutput = result + " without mentioning any other text or language or single quotes in " + selectedLanguage + ". If it has main class give the main class name as Main";

            // geterateBothCodes(getOutput,selectedLanguage);

            setTimeout(() => {
                output();
            }, 2000)

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
                credentials: 'include',
                body: new URLSearchParams({ code, selectedLanguage }),
            });
            if (response.ok) {
                const data = await response.text();
                setCode(data);
            } else {
                console.log("Error Status: ", response.status);
            }
            return (
                <CodeEditor />
            )

        }
        catch (error) {
            console.log("Failed to fetch")
        }
    }
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setConvertLang(false); // Close dropdown if click is outside
            }
        }

        if (convertLang) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [convertLang]);

    if (theme) {
        return (

            <div className="w-screen h-screen overflow-hidden grid grid-rows-40 grid-cols-20 p-5 gap-2 bg-gray-100 2xl:max-2xl:h-screen 2xl:max-2xl:overflow-hidden xl:max-2xl:w-screen xl:max-2xl:h-screen xl:max-2xl:overflow-hidden lg:max-xl:w-screen lg:max-xl:h-screen md:max-lg:w-screen md:max-lg:p-2 5xs:max-2xl:overflow-x-hidden  5xs:max-2xl:overflow-y-scroll 5xs:max-3xs:p-2 5xs:max-3xs:mb-2 3xs:max-2xs:w-screen 3xs:max-2xs:p-1.5 2xs:max-xs:w-screen sm:max-md:w-screen sm:max-md:p-1.5 3xl:max-4xl:p-1.5" >

                <div className="row-span-3 col-span-29 grid-cols-22 grid rounded-xl bg-white shadow-neutral-300 shadow-md inset-shadow-sm inset-shadow-neutral-200 lg:max-xl:grid-cols-35 md:max-lg:grid-cols-12 md:max-lg:h-16 5xs:max-xs:mt-0 3xs:max-2xs:p-0 md:max-lg:p-0">
                    <div className="col-span-1 relative grid-cols-1 mt-1 w-19 h-16 rounded-full 2xl:max-2xl:15 2xl:max-2xl:h-15 xl:max-2xl:h-13 xl:max-2xl:p-1 lg:max-xl:h-13 lg:max-xl:p-1 lg:max-xl:col-span-2 md:max-lg:p-1 md:max-lg:col-span-1  5xs:max-2\3xs:w-15 5xs:max-3xs:h-15 5xs:max-3xs:mt-0 3xs:max-2xs:mt-[-4px] sm:max-md:mt-[-5px] md:max-lg:m-[-2px]">
                        <img src={logo} className='rounded-full 2xl:max-2xl:w-15 2xl:max-2xl:h-15 xl:max-2xl:w-13 xl:max-2xl:h-13 lg:max-xl:w-12 lg:max-xl:h-12 md:max-lg:w-17 md:max-lg:h-17 sm:max-md:w-16 sm:max-md:h-16 cursor-pointer md:max-lg:mt-[-2px] 3xl:max-4xl:w-13 3xl:max-4xl:h-13 3xl:max-4xl:mt-[-5px]' onClick={() => window.location.reload()}></img>
                    </div>

                    <div className='mt-4 col-span-3 w-54 h-10 text-white py-2 rounded-lg cursor-pointer flex justify-between items-center transition-all duration-200 2xl:max-2xl:w-56 2xl:max-2xl:h-10 2xl:max-2xl:p-2.5 xl:max-2xl:h-8 xl:max-2xl:p-3 lg:max-xl:p-2.5 lg:max-xl:col-span-6 md:max-lg:p-2 md:max-lg:col-span-2 md:max-lg:w-10 bg-gray-800 5xs:max-2xs:w-27 5xs:max-2xs:h-4 5xs:max-2xs:mt-3 5xs:max-2xs:ml-11 3xs:max-2xs:col-span-4 2xs:max-md:m-1.5  sm:max-md:ml-10  sm:max-md:mt-2  sm:max-md:col-span-6 md:max-lg:h-9  3xl:max-4xl:h-10  3xl:max-4xl:p-0  3xl:max-4xl:mt-2  3xl:max-4xl:col-span-4'>
                        <CustomDropdown selected={selectedLanguage} onSelect={handleLanguageChange} />
                    </div>
                    <div className='col-span-1  justify-center w-50 h-15 2xl:max-2xl:p-2.5 2xl:max-2xl:ml-3 xl:max-2xl:p-3 lg:max-xl:p-3 lg:max-xl:ml-4 lg:max-xl:col-span-4 md:max-lg:col-span-1 md:max-lg:p-0.5'>
                        <label htmlFor="file-input" className='items-center flex justify-center w-12 h-20 5xs:max-md:hidden'>
                            <FontAwesomeIcon icon={faFolderOpen} className="text-gray-600 text-3xl md:max-lg:h-14.5 md:max-lg:w-7.5 md:max-lg:mt-[-5px] md:max-lg:ml-4 mb-2  3xl:max-4xl:p-0  3xl:max-4xl:h-10  3xl:max-4xl:w-10 cursor-pointer  3xl:max-4xl:mt-[-39px]  3xl:max-4xl:ml-[-50px]" title='Import' />
                            <FileReaderComponent onFileRead={handleFileContent} triggerId="file-input" />
                        </label>
                    </div>
                    <div className='mt-1 flex  items-center  col-span-1 w-40 h-14 2xl:max-2xl:p-2.5 2xl:max-2xl:ml-3 xl:max-2xl:p-3 lg:max-xl:p-3 lg:max-xl:ml-4 lg:max-xl:col-span-4 md:max-lg:col-span-1 md:max-lg:p-0.5 5xs:max-md:hidden  3xl:max-4xl:m-0  3xl:max-4xl:p-0  3xl:max-4xl:mt-[-2px]'>
                        <FontAwesomeIcon icon={faDownload} className='text-gray-600 text-3xl md:max-lg:h-13 md:max-lg:w-8 cursor-pointer md:max-lg:ml-1.5' title='Export' onClick={() => exportFile(code, selectedLanguage)} />
                    </div>
                    <div style={{ marginTop: "3.1px" }} className='flex items-center pt-1.5 col-span-1 w-40 h-15 2xl:max-2xl:p-2.5 2xl:max-2xl:ml-3 lg:max-xl:p-3 xl:max-2xl:p-3 lg:max-xl:ml-4 md:max-lg:col-span-1 md:max-lg:p-0.5 5xs:max-md:hidden'>
                        <FontAwesomeIcon icon={faWandMagicSparkles} className='text-gray-600 md:max-lg:h-13 md:max-lg:w-8 text-2xl cursor-pointer 3xl:max-4xl:mt-[-10px]' title='Beautify' onClick={beautifier} />
                    </div>
                    <div className='flex items-center mt-3.5 col-span-1 w-30 h-10  2xl:max-2xl:p-2.5 xl:max-2xl:p-2 xl:max-2xl:ml-7 lg:max-xl:p-3 md:max-lg:p-1 md:max-lg:ml-[-10px] 5xs:max-md:hidden'>
                        <RiExchangeLine className='text-gray-600 h-20 w-10 cursor-pointer md:max-lg:h-14 md:max-lg:w-9 3xl:max-4xl:mt-[-13px]  3xl:max-4xl:ml-[-25px]' title='Convert' onClick={() => setConvertLang(!convertLang)} />
                    </div>
                    {convertLang && (
                        <div
                            ref={dropdownRef}
                            className="absolute left-66 z-10 w-50 h-120 mt-20 bg-white font-extrabold text-left rounded-xl shadow-xl shadow-gray-500"
                        >
                            <ul>
                                {[
                                    "java",
                                    "javascript",
                                    "python3",
                                    "c",
                                    "cpp",
                                    "php",
                                    "ruby",
                                    "golang",
                                    "rlang",
                                ].map((lang) => (
                                    <li
                                        key={lang}
                                        className="flex items-center hover:bg-gray-300 h-13 cursor-pointer"
                                        onClick={() => {
                                            setConvertLang(false);
                                            codeConverter(lang);
                                        }}
                                    > 3xl:max-4xl:h-1
                                        <p className="ml-6 capitalize">{lang}</p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    <div className='col-span-10 xl:max-2xl:col-span-5 md:max-lg:col-span-1 lg:max-xl:col-span-6 5xs:max-2xs:col-span-12  3xl:max-4xl:col-span-9'></div>
                    <div className='flex items-center pt-1.5 col-span-1 w-40 h-15 2xl:max-2xl:p-2.5 lg:max-xl:col-span-4 lg:max-xl:ml-4 lg:max-xl:p-3 md:max-lg:col-span-1 md:max-lg:p-0.5 md:max-lg:ml-8 5xs:max-md:hidden'>
                        <MdOutlineSave className='text-gray-700 mt-1 md:max-lg:h-18 md:max-lg:w-9 md:max-lg:mt-2.5 h-20 w-10 cursor-pointer  3xl:max-4xl:mt-[-10px]  3xl:max-4xl:w-10 3xl:max-4xl:ml-8' title='Save' />
                    </div>
                    <div className='flex items-center col-span-1 w-45 h-15 pt-1.5 2xl:max-2xl:p-2.5 lg:max-xl:ml-4 lg:max-xl:p-3 lg:max-xl:col-span-3  5xs:max-md:hidden md:max-lg:ml-7  3xl:max-4xl:mt-[-7px]  3xl:max-4xl:w-9.5 3xl:max-4xl:ml-8'>
                        {prompt &&
                            <RiAiGenerate2 className='text-gray-700 mt-1 md:max-lg:h-18 md:max-lg:w-9 md:max-lg:mt-[-1px] h-20 w-10 cursor-pointer' onClick={() => setPrompt(!prompt)} title='Hide Prompt' />
                        }
                        {!prompt &&
                            <RiAiGenerate2 className='text-gray-700 mt-1 md:max-lg:h-18 md:max-lg:w-9 md:max-lg:mt[-1px] h-20 w-10 cursor-pointer' onClick={() => setPrompt(!prompt)} title='Show Prompt' />
                        }
                    </div>

                    <div className='text-gray-700 mt-0.5 flex items-center col-span-1 w-17 h-17 2xl:max-2xl:h-10 2xl:max-2xl:p-3 xl:max-2xl:p-3 xl:max-2xl:h-8 lg:max-xl:p-3 md:max-lg:p-4 md:max-lg:col-span-1 5xs:max-md:hidden  3xl:max-4xl:mt-3 3xl:max-4xl:ml-4' title='Dark'>
                        {theme && <MdDarkMode className='w-8 h-8 xl:max-2xl:h-8 xl:max-2xl:w-7 md:max-lg:max-lg:h-7 md:max-lg:mt-[-4px] md:max-lg:max-lg:w-7 cursor-pointer' onClick={() => setTheme(!theme)} />}

                    </div>
                    <div className='hidden 5xs:max-md:block 5xs:max-2xs:flex 5xs:max-2xs:items-center col-span-1 5xs:max-2xs:text-2xl 5xs:max-3xs:mb-2 3xs:max-2xs:text-3xl  sm:max-md:text-3xl sm:max-md:mt-2.5'>
                        <FontAwesomeIcon icon={faBars} />
                    </div>
                    <div className="w-14 h-14 mt-2 rounded-full max-2xl:w-15 max-2xl:h-15 xl:max-2xl:w-13 xl:max-2xl:h-13 lg:max-xl:w-12 lg:max-xl:h-12 md:max-lg:w-13 md:max-lg:h-13 flex items-center justify-center overflow-hidden 5xs:max-3xs:w-8 5xs:max-3xs:mt-3 5xs:max-3xs:h-8 5xs:max-3xs:ml-4 3xs:max-2xs:w-12 3xs:max-2xs:h-12 3xs:max-2xs:ml-5 3xs:max-2xs:mt-1.5 sm:max-md:w-12 sm:max-md:h-12  sm:max-md:ml-7  sm:max-md:m-1 3xl:max-4xl:m-1  3xl:max-4xl:w-12.5 3xl:max-4xl:h-12.5">
                        <img
                            src={isValidImageUrl(userProfile?.imageUrl) ? userProfile.imageUrl : profileImage}
                            className="w-full h-full rounded-full cursor-pointer object-cover"
                            onClick={() => setSlidePanel(!slidePanel)}
                        />
                    </div>


                    {slidePanel && (
                        <SlidingPane
                            closeIcon={
                                <span className="text-3xl font-bold cursor-pointer text-red-500 hover:text-red-700 transition duration-200">
                                    X
                                </span>
                            }
                            isOpen={slidePanel}
                            title={<span className="text-2xl font-semibold text-gray-800">My Profile</span>}
                            width="500px"
                            onRequestClose={() => setSlidePanel(false)}
                            className="!p-0 bg-gray-100 rounded-l-xl shadow-2xl"
                        >
                            <SlidingPanel />
                        </SlidingPane>
                    )}

                </div>
                {prompt &&
                    <div className='row-span-3 col-span-29 grid-cols-23 grid rounded-2xl bg-white shadow-md shadow-neutral-300 md:max-lg:h-15 md:max-lg:mt-2'>
                        <div className='col-span-15 p-2 h-18 2xl:max-2xl:h-15 lg:max-xl:col-span-14 md:max-lg:col-span-15 3xl:max-4xl:col-span-16 3xl:max-4xl:p-1'>
                            <input className='p-2 rounded-xl border-gray-300 border w-310 h-13 2xl:max-2xl:h-10 2xl:max-2xl:w-5xl xl:max-2xl:h-10 xl:max-2xl:w-3xl lg:max-xl:h-10 lg:max-xl:w-xl md:max-lg:h-10 md:max-lg:w-xl 5xs:max-2xs:w-75 5xs:max-2xs:h-10.5 3xs:max-2xs:w-100  sm:max-md:w-120  sm:max-md:h-10 3xl:max-4xl:w-full 3xl:max-4xl:h-12' placeholder='Enter your prompt here...' ref={generate} id='field' autoComplete='off'></input>
                        </div>
                        <div className='flex items-center mt-1 col-span-1 w-40 h-15 p-4 2xl:max-2xl:p-2.5 2xl:max-2xl:ml-3 xl:max-2xl:p-2 lg:max-xl:col-span-3 lg:max-xl:p-3 md:max-lg:p-0 md:max-lg:col-span-1 md:max-lg:w-8 md:max-lg:h-8 md:max-lg:mt-3 md:max-lg:ml-[-7px] 5xs:max-2xs:w-15 5xs:max-2xs:h-15 5xs:max-md:col-span-4 5xs:max-md:mt-0  sm:max-md:w-16 sm:max-md:h-16  sm:max-md:mt-[-4px]  sm:max-md:ml-3 3xl:max-4xl:ml-[-50px] 3xl:max-4xl:p-0 3xl:max-4xl:mt-[-2px]'>
                            <FaCircleArrowRight className='h-20 w-10 text-blue-600 cursor-pointer' onClick={generateCodeFromText} title='Send' />
                        </div>
                        <div className='col-span-1 p-4 w-17 h-17 2xl:max-2xl:13 2xl:max-2xl:p-2.5 xl:max-2xl:p-3 xl:max-2xl:col-span-2 lg:max-xl:p-2.5 md:max-lg:p-3 md:max-lg:col-span-5 3xl:max-4xl:ml-[-58px]' onClick={() => setMic(!mic)}>
                            <span title='Stop Record'>
                                {mic && (
                                    <div className="relative flex items- 5xs:max-2xs:h-5center justify-center">
                                        <span className="absolute w-10 h-10 bg-red-500 opacity-75 rounded-full animate-ping"></span>
                                        <Mic className="w-8 h-8 xl:max-2xl:h-7 5xs:max-2xs:w-7 5xs:max-2xs:h-7 5xs:max-2xs:mt-0 text-red-500 md:max-lg:w-7 md:max-lg:h-7  sm:max-md:mt-0 cursor-pointer relative z-10" onClick={stopRecording} />
                                    </div>
                                )}
                            </span>
                            <span title='Record'>
                                {!mic && <MicOff className='w-8 h-8 xl:max-2xl:h-6.5 5xs:max-2xs:h-6.5 5xs:max-2xs:mt-0 text-gray-700 md:max-lg:w-7 md:max-lg:h-7 sm:max-md:mt-[-5px] cursor-pointer' onClick={callRecord} />}
                            </span>

                        </div>


                    </div>
                }

                <div className="row-span-34 col-span-29 p-2 grid grid-cols-2 gap-5 md:max-lg:mt-2 md:max-lg:grid-cols-1 md:max-lg:p-1 5xs:max-md:grid-cols-1 5xs:max-3xs:gap-0">
                    <div className='inset-shadow-sm inset-shadow-neutral-200 h-220 shadow-md shadow-neutral-400 rounded-xl p-4 grid grid-rows-24 2xl:p-2.5 2xl:grid-cols-15 md:max-lg:grid-rows-28 md:max-lg:gap-1 md:max-lg:p-1  5xs:max-2xs:p-0 5xs:max-3xs:h-110 3xs:max-2xs:h-120 5xs:max-3xs:w-110 3xs:max-2xs:w-130 sm:max-md:p-1 sm:max-md:w-158 3xl:max-4xl:p-2 3xl:max-4xl:h-178'>

                        <CodeEditor
                            className='border border-gray-300 rounded-xl p-5 row-span-22 col-span-20 2xl:max-2xl:col-span-15 xl:max-2xl:w-xl lg:max-xl:w-110 md:max-lg:w-xl md:max-lg:row-span-25 md:max-lg:mt-1.5 5xs:max-3xs:w-60 '
                            html={html} setHtml={setHtml}
                            css={css} setCss={setCss}
                            js={js} setJs={setJs}
                            code={code} setCode={setCode}
                            selectedLanguage={selectedLanguage}
                        />


                    </div>
                    <div className='inset-shadow-sm inset-shadow-neutral-200 h-220 shadow-md shadow-neutral-400 rounded-xl pl-3 grid grid-rows-24 2xl:max-2xl:p-2.5 2xl:max-2xl:grid-cols-15 md:max-lg:grid-rows-28 md:max-lg:gap-0 md:max-lg:p-0 md:max-lg:h-180 5xs:max-3xs:p-0 5xs:max-3xs:h-70  3xs:max-2xs:h-100 5xs:max-3xs:w-110 3xs:max-2xs:w-full sm:max-md:p-1 sm:max-md:w-158  sm:max-md:h-178 3xl:max-4xl:p-1 3xl:max-4xl:h-178'>
                        <OutputFrame
                            className='border border-gray-300 rounded-xl p-5 shadow-md row-span-22 2xl:max-2xl:col-span-15 xl:max-2xl:w-xl lg:max-xl:w-110 md:max-lg:w-2xl md:max-lg:row-span-25 text-gray-500 5xs:max-3xs:w-60'
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
            <div className="w-screen h-screen overflow-hidden grid grid-rows-40 grid-cols-20 p-5 gap-2 bg-gray-100 2xl:max-2xl:h-screen 2xl:max-2xl:overflow-hidden xl:max-2xl:w-screen xl:max-2xl:h-screen xl:max-2xl:overflow-hidden lg:max-xl:w-screen lg:max-xl:h-screen md:max-lg:w-screen md:max-lg:p-2 5xs:max-2xl:overflow-x-hidden  5xs:max-2xl:overflow-y-scroll 5xs:max-3xs:p-2 5xs:max-3xs:mb-2 3xs:max-2xs:w-screen 3xs:max-2xs:p-1.5 2xs:max-xs:w-screen sm:max-md:w-screen sm:max-md:p-1.5 3xl:max-4xl:p-1.5" id="wholeDiv">
                <div className="row-span-3 col-span-29 grid-cols-22 grid rounded-xl bg-white shadow-neutral-300 shadow-md inset-shadow-sm inset-shadow-neutral-200 lg:max-xl:grid-cols-35 md:max-lg:grid-cols-12 md:max-lg:h-16 5xs:max-xs:mt-0 3xs:max-2xs:p-0 md:max-lg:p-0 border-gray-600" id='textArea'>
                    <div className="col-span-1 relative grid-cols-1 mt-1 w-19 h-16 rounded-full 2xl:max-2xl:15 2xl:max-2xl:h-15 xl:max-2xl:h-13 xl:max-2xl:p-1 lg:max-xl:h-13 lg:max-xl:p-1 lg:max-xl:col-span-2 md:max-lg:p-1 md:max-lg:col-span-1  5xs:max-2\3xs:w-15 5xs:max-3xs:h-15 5xs:max-3xs:mt-0 3xs:max-2xs:mt-[-4px] sm:max-md:mt-[-5px] md:max-lg:m-[-2px]">
                        <img src={logo1} className='rounded-full 2xl:max-2xl:w-15 2xl:max-2xl:h-15 xl:max-2xl:w-13 xl:max-2xl:h-13 lg:max-xl:w-12 lg:max-xl:h-12 md:max-lg:w-17 md:max-lg:h-17 sm:max-md:w-16 sm:max-md:h-16 cursor-pointer md:max-lg:mt-[-2px] 3xl:max-4xl:w-13 3xl:max-4xl:h-13 3xl:max-4xl:mt-[-5px]' onClick={() => window.location.reload()}></img>
                    </div>


                    <div className='mt-4 col-span-3 w-54 h-10 text-white py-2 rounded-lg cursor-pointer flex justify-between items-center transition-all duration-200 2xl:max-2xl:w-56 2xl:max-2xl:h-10 2xl:max-2xl:p-2.5 xl:max-2xl:h-8 xl:max-2xl:p-3 lg:max-xl:p-2.5 lg:max-xl:col-span-6 md:max-lg:p-2 md:max-lg:col-span-2 md:max-lg:w-10 bg-gray-800 5xs:max-2xs:w-27 5xs:max-2xs:h-4 5xs:max-2xs:mt-3 5xs:max-2xs:ml-11 3xs:max-2xs:col-span-4 2xs:max-md:m-1.5  sm:max-md:ml-10  sm:max-md:mt-2  sm:max-md:col-span-6 md:max-lg:h-9  3xl:max-4xl:h-10  3xl:max-4xl:p-0  3xl:max-4xl:mt-2  3xl:max-4xl:col-span-4'>
                        <CustomDropdown selected={selectedLanguage} onSelect={handleLanguageChange} />

                    </div>
                    <div className='col-span-1  justify-center w-50 h-15 2xl:max-2xl:p-2.5 2xl:max-2xl:ml-3 xl:max-2xl:p-3 lg:max-xl:p-3 lg:max-xl:ml-4 lg:max-xl:col-span-4 md:max-lg:col-span-1 md:max-lg:p-0.5'>

                        <label htmlFor="file-input" className='items-center flex justify-center w-12 h-20 5xs:max-md:hidden'>
                            <FontAwesomeIcon icon={faFolderOpen} className="text-white text-3xl md:max-lg:h-14.5 md:max-lg:w-7.5 md:max-lg:mt-[-5px] md:max-lg:ml-4 mb-2  3xl:max-4xl:p-0  3xl:max-4xl:h-10  3xl:max-4xl:w-10 cursor-pointer  3xl:max-4xl:mt-[-39px]  3xl:max-4xl:ml-[-50px]" title='Import' />
                            <FileReaderComponent onFileRead={handleFileContent} triggerId="file-input" />
                        </label>
                    </div>
                    <div className='mt-1 flex  items-center  col-span-1 w-40 h-14 2xl:max-2xl:p-2.5 2xl:max-2xl:ml-3 xl:max-2xl:p-3 lg:max-xl:p-3 lg:max-xl:ml-4 lg:max-xl:col-span-4 md:max-lg:col-span-1 md:max-lg:p-0.5 5xs:max-md:hidden  3xl:max-4xl:m-0  3xl:max-4xl:p-0  3xl:max-4xl:mt-[-2px]'>
                        <FontAwesomeIcon icon={faDownload} className='text-white text-3xl md:max-lg:h-13 md:max-lg:w-8 cursor-pointer md:max-lg:ml-1.5' title='Export' onClick={() => exportFile(code, selectedLanguage)} />
                    </div>
                    <div style={{ marginTop: "3.1px" }} className='flex items-center pt-1.5 col-span-1 w-40 h-15 2xl:max-2xl:p-2.5 2xl:max-2xl:ml-3 lg:max-xl:p-3 xl:max-2xl:p-3 lg:max-xl:ml-4 md:max-lg:col-span-1 md:max-lg:p-0.5 5xs:max-md:hidden'>
                        <FontAwesomeIcon icon={faWandMagicSparkles} className='text-white md:max-lg:h-13 md:max-lg:w-8 text-2xl cursor-pointer 3xl:max-4xl:mt-[-10px]' title='Beautify' onClick={beautifier} />
                    </div>
                    <div className='flex items-center mt-3.5 col-span-1 w-30 h-10  2xl:max-2xl:p-2.5 xl:max-2xl:p-2 xl:max-2xl:ml-7 lg:max-xl:p-3 md:max-lg:p-1 md:max-lg:ml-[-10px] 5xs:max-md:hidden'>
                        <RiExchangeLine className='text-white h-20 w-10 cursor-pointer md:max-lg:h-14 md:max-lg:w-9 3xl:max-4xl:mt-[-13px]  3xl:max-4xl:ml-[-25px]' title='Convert' onClick={() => setConvertLang(!convertLang)} />
                    </div>
                    {convertLang && (
                        <div
                            ref={dropdownRef}
                            className="absolute left-66 z-10 w-50 h-120 mt-20 bg-white font-extrabold text-left rounded-xl shadow-xl shadow-gray-500"
                        >
                            <ul>
                                {[
                                    "java",
                                    "javascript",
                                    "python3",
                                    "c",
                                    "cpp",
                                    "php",
                                    "ruby",
                                    "golang",
                                    "rlang",
                                ].map((lang) => (
                                    <li
                                        key={lang}
                                        className="flex items-center hover:bg-gray-300 h-13 cursor-pointer"
                                        onClick={() => {
                                            setConvertLang(false);
                                            codeConverter(lang);
                                        }}
                                    >
                                        <p className="ml-6 capitalize">{lang}</p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    <div className='col-span-10 xl:max-2xl:col-span-5 md:max-lg:col-span-1 lg:max-xl:col-span-6 5xs:max-2xs:col-span-12  3xl:max-4xl:col-span-9'></div>
                    <div className='flex items-center pt-1.5 col-span-1 w-40 h-15 2xl:max-2xl:p-2.5 lg:max-xl:col-span-4 lg:max-xl:ml-4 lg:max-xl:p-3 md:max-lg:col-span-1 md:max-lg:p-0.5 md:max-lg:ml-8 5xs:max-md:hidden'>
                        <MdOutlineSave className='text-white mt-1 md:max-lg:h-18 md:max-lg:w-9 md:max-lg:mt-2.5 h-20 w-10 cursor-pointer  3xl:max-4xl:mt-[-10px]  3xl:max-4xl:w-10 3xl:max-4xl:ml-8' title='Save' />
                    </div>
                    <div className='flex items-center col-span-1 w-45 h-15 pt-1.5 2xl:max-2xl:p-2.5 lg:max-xl:ml-4 lg:max-xl:p-3 lg:max-xl:col-span-3  5xs:max-md:hidden md:max-lg:ml-7  3xl:max-4xl:mt-[-7px]  3xl:max-4xl:w-9.5 3xl:max-4xl:ml-8'>
                        {prompt &&
                            <RiAiGenerate2 className='text-white mt-1 md:max-lg:h-18 md:max-lg:w-9 md:max-lg:mt-[-1px] h-20 w-10 cursor-pointer' onClick={() => setPrompt(!prompt)} title='Hide Prompt' />
                        }
                        {!prompt &&
                            <RiAiGenerate2 className='text-white mt-1 md:max-lg:h-18 md:max-lg:w-9 md:max-lg:mt[-1px] h-20 w-10 cursor-pointer' onClick={() => setPrompt(!prompt)} title='Show Prompt' />
                        }
                    </div>
                    <div className='mt-0.5 flex items-center col-span-1 w-17 h-17 2xl:max-2xl:h-10 2xl:max-2xl:p-3 xl:max-2xl:p-3 xl:max-2xl:h-8 lg:max-xl:p-3 md:max-lg:p-4 md:max-lg:col-span-1 5xs:max-md:hidden  3xl:max-4xl:mt-3 3xl:max-4xl:ml-4 text-white' onClick={() => setTheme(!theme)}>
                        <span title='Light'>
                            {!theme && <IoIosSunny className='w-8 h-8 xl:max-2xl:h-8 xl:max-2xl:w-7 md:max-lg:max-lg:h-7 md:max-lg:mt-[-4px] md:max-lg:max-lg:w-7 text-white  cursor-pointer 3xl:max-4xl:h-8 3xl:max-4xl:w-8' />}
                        </span>
                    </div>
                    <div className="w-14 h-14 mt-2 rounded-full max-2xl:w-15 max-2xl:h-15 xl:max-2xl:w-13 xl:max-2xl:h-13 lg:max-xl:w-12 lg:max-xl:h-12 md:max-lg:w-13 md:max-lg:h-13 flex items-center justify-center overflow-hidden 5xs:max-3xs:w-8 5xs:max-3xs:mt-3 5xs:max-3xs:h-8 5xs:max-3xs:ml-4 3xs:max-2xs:w-12 3xs:max-2xs:h-12 3xs:max-2xs:ml-5 3xs:max-2xs:mt-1.5 sm:max-md:w-12 sm:max-md:h-12  sm:max-md:ml-7  sm:max-md:m-1 3xl:max-4xl:m-1  3xl:max-4xl:w-12.5 3xl:max-4xl:h-12.5">
                        <img
                            src={isValidImageUrl(userProfile?.imageUrl) ? userProfile.imageUrl : profileImage}
                            className="w-full h-full rounded-full cursor-pointer object-cover"
                            onClick={() => setSlidePanel(!slidePanel)}
                        />
                    </div>


                    {slidePanel && (
                        <SlidingPane
                            closeIcon={
                                <span className="text-3xl font-bold cursor-pointer text-red-500 hover:text-red-700 transition duration-200">
                                    X
                                </span>
                            }
                            isOpen={slidePanel}
                            title={<span className="text-2xl font-semibold text-gray-800">My Profile</span>}
                            width="500px"
                            onRequestClose={() => setSlidePanel(false)}
                            className="!p-0 bg-gray-100 rounded-l-xl shadow-2xl"
                        >
                            <SlidingPanel />
                        </SlidingPane>
                    )}
                </div>
                {prompt &&
                    <div className='row-span-3 col-span-29 grid-cols-23 grid rounded-2xl bg-white shadow-md  md:max-lg:h-18 md:max-lg:p-1.5  border border-gray-600' id='textArea'>
                        <div className='col-span-15 p-2 h-18 2xl:max-2xl:h-15 lg:max-xl:col-span-14 md:max-lg:col-span-15 3xl:max-4xl:col-span-16 3xl:max-4xl:p-1'>
                            <input className='p-2 rounded-xl border-gray-300 border w-310 h-13 2xl:max-2xl:h-10 text-white 2xl:max-2xl:w-5xl xl:max-2xl:h-10 xl:max-2xl:w-3xl lg:max-xl:h-10 lg:max-xl:w-xl md:max-lg:h-10 md:max-lg:w-xl 5xs:max-2xs:w-75 5xs:max-2xs:h-10.5 3xs:max-2xs:w-100  sm:max-md:w-120  sm:max-md:h-10 3xl:max-4xl:w-full 3xl:max-4xl:h-12' placeholder='Enter your prompt here...' ref={generate} id='field' autoComplete='off'></input>
                        </div>
                        <div className='flex items-center mt-1 col-span-1 w-40 h-15 p-4 2xl:max-2xl:p-2.5 2xl:max-2xl:ml-3 xl:max-2xl:p-2 lg:max-xl:col-span-3 lg:max-xl:p-3 md:max-lg:p-0 md:max-lg:col-span-1 md:max-lg:w-8 md:max-lg:h-8 md:max-lg:mt-3 md:max-lg:ml-[-7px] 5xs:max-2xs:w-15 5xs:max-2xs:h-15 5xs:max-md:col-span-4 5xs:max-md:mt-0  sm:max-md:w-16 sm:max-md:h-16  sm:max-md:mt-[-4px]  sm:max-md:ml-3 3xl:max-4xl:ml-[-50px] 3xl:max-4xl:p-0 3xl:max-4xl:mt-[-2px]'>
                            <FaCircleArrowRight className='h-20 w-10 text-blue-600 cursor-pointer' onClick={generateCodeFromText} title='Send' />
                        </div>
                        <div className='col-span-1 p-4 w-17 h-17 2xl:max-2xl:13 2xl:max-2xl:p-2.5 xl:max-2xl:p-3 xl:max-2xl:col-span-2 lg:max-xl:p-2.5 md:max-lg:p-3 md:max-lg:col-span-5 3xl:max-4xl:ml-[-58px]' onClick={() => setMic(!mic)}>
                            <span title='Stop Record'>
                                {mic && (
                                    <div className="relative flex items- 5xs:max-2xs:h-5center justify-center">
                                        <span className="absolute w-10 h-10 bg-red-500 opacity-75 rounded-full animate-ping"></span>
                                        <Mic className="w-8 h-8 xl:max-2xl:h-7 5xs:max-2xs:w-7 5xs:max-2xs:h-7 5xs:max-2xs:mt-0 text-red-500 md:max-lg:w-7 md:max-lg:h-7  sm:max-md:mt-0 cursor-pointer relative z-10" onClick={stopRecording} />
                                    </div>
                                )}
                            </span>
                            <span title='Record'>
                                {!mic && <MicOff className='w-8 h-8 xl:max-2xl:h-6.5 5xs:max-2xs:h-6.5 5xs:max-2xs:mt-0 text-white md:max-lg:w-7 md:max-lg:h-7 sm:max-md:mt-[-5px] cursor-pointer' onClick={callRecord} />}
                            </span>

                        </div>


                    </div>
                }

                <div className="row-span-34 col-span-29 p-2 grid grid-cols-2 gap-5 md:max-lg:mt-2 md:max-lg:grid-cols-1 md:max-lg:p-1 5xs:max-md:grid-cols-1 5xs:max-3xs:gap-0">
                    <div className='inset-shadow-sm border border-gray-600 h-220 shadow-md shadow-neutral-400 rounded-xl p-4 grid grid-rows-24 2xl:p-2.5 2xl:grid-cols-15 md:max-lg:grid-rows-28 md:max-lg:gap-1 md:max-lg:p-1  5xs:max-2xs:p-0 5xs:max-3xs:h-110 3xs:max-2xs:h-120 5xs:max-3xs:w-110 3xs:max-2xs:w-130 sm:max-md:p-1 sm:max-md:w-158 3xl:max-4xl:p-2 3xl:max-4xl:h-178'>

                        <CodeEditor
                            className='border border-gray-300 rounded-xl p-5 row-span-22 col-span-20 2xl:max-2xl:col-span-15 xl:max-2xl:w-xl lg:max-xl:w-110 md:max-lg:w-xl md:max-lg:row-span-25 md:max-lg:mt-1.5 5xs:max-3xs:w-60' style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                            html={html} setHtml={setHtml}
                            css={css} setCss={setCss}
                            js={js} setJs={setJs}
                            code={code} setCode={setCode}
                            selectedLanguage={selectedLanguage}
                        />


                    </div>
                    <div className='border border-gray-600 h-220 rounded-xl pl-3 grid grid-rows-24 2xl:max-2xl:p-2.5 2xl:max-2xl:grid-cols-15 md:max-lg:grid-rows-28 md:max-lg:gap-0 md:max-lg:p-0 md:max-lg:h-180 5xs:max-3xs:p-0 5xs:max-3xs:h-70  3xs:max-2xs:h-100 5xs:max-3xs:w-110 3xs:max-2xs:w-full sm:max-md:p-1 sm:max-md:w-158  sm:max-md:h-178 3xl:max-4xl:p-1 3xl:max-4xl:h-178'>
                        <OutputFrame
                            className='border border-gray-300 rounded-xl p-5 shadow-md row-span-22 2xl:max-2xl:col-span-15 xl:max-2xl:w-xl lg:max-xl:w-110 md:max-lg:w-2xl md:max-lg:row-span-25 text-gray-500 5xs:max-3xs:w-60'
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