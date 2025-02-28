import { Mic, MicOff } from 'lucide-react'
import { MdDarkMode } from "react-icons/md";
import { IoIosSunny } from "react-icons/io";
// import { CgExport } from "react-icons/cg";
import { PiButterflyFill } from "react-icons/pi";
import { MdOutlineSave } from "react-icons/md";
import { RiAiGenerate2 } from "react-icons/ri";
import { RiExchangeLine } from "react-icons/ri";

import { useRef, useState } from 'react';
// import { LuImport } from 'react-icons/lu';

import { FaEdit } from "react-icons/fa";
import { useEffect, useRef, useState } from 'react';
import { LuLogOut, LuImport } from 'react-icons/lu';
import { Mail, User } from "lucide-react";
import { GrProjects } from "react-icons/gr";
import { FaCircleArrowRight } from "react-icons/fa6";
import logo from "./assets/logo-noBg.png"
import logo1 from "./assets/CodeAiD_DarkTheme.png";
import SlidingPane from "react-sliding-pane";
import "react-sliding-pane/dist/react-sliding-pane.css";
import { useNavigate } from "react-router-dom";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileArrowDown,faFileArrowUp } from '@fortawesome/free-solid-svg-icons';


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

    const handleProfileImageChange = async (event) => {
        const file = event.target.files[0];
        if (file || editName) { // Proceed if there's a file or a new name
            const formData = new FormData();
            if (file) {
                formData.append("profileImage", file);
            }
            const newName = editName || userProfile?.name; // Use editName if set, else current name
            formData.append("username", newName); // Send updated username
            formData.append("userId", userProfile?.userId || "1");

            try {
                const response = await fetch("http://localhost:8080/CodeVision/UpdateProfileImageServlet", {
                    method: "POST",
                    credentials: "include",
                    body: formData,
                });
                if (response.ok) {
                    const updatedProfile = await response.json();
                    setUserProfile(updatedProfile); // Update state with server response
                    setIsEditingName(false); // Exit edit mode if active
                    setEditName(""); // Reset editName
                } else {
                    console.error("Failed to update profile:", response.statusText);
                }
            } catch (error) {
                console.error("Error updating profile:", error);
            }
        }
    };

    const saveName = async () => {
        if (editName && editName !== userProfile?.name) { // Only update if name changed
            const formData = new FormData();
            formData.append("username", editName);
            formData.append("userId", userProfile?.userId || "1");

            try {
                const response = await fetch("http://localhost:8080/CodeVision/UpdateProfileImageServlet", {
                    method: "POST",
                    credentials: "include",
                    body: formData,
                });
                if (response.ok) {
                    const updatedProfile = await response.json();
                    setUserProfile(updatedProfile);
                    setIsEditingName(false);
                    setEditName("");
                } else {
                    console.error("Failed to update name:", response.statusText);
                }
            } catch (error) {
                console.error("Error updating name:", error.message);
            }
        } else {
            setIsEditingName(false); // Exit edit mode if no change
        }
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
            "\n . Don't give any other text or mention any other language. Just give only code. ";

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
        if(lang === "web")
        {
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
            getOutput = result + " without mentioning any other text or language or single quotes in " + selectedLanguage;

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

    if (theme) {
        return (

            <div className="w-screen h-screen overflow-hidden grid grid-rows-40 grid-cols-20 p-5 gap-2 bg-gray-100 2xl:max-2xl:h-screen 2xl:max-2xl:overflow-hidden xl:max-2xl:w-screen xl:max-2xl:h-screen xl:max-2xl:overflow-hidden lg:max-xl:w-screen lg:max-xl:h-screen lg:max-xl:overflow-hidden  md:max-lg:w-screen  md:max-lg:h-screen md:max-lg:overflow-x-hidden md:max-lg:overflow-y-scroll sm:max-md:overflow-x-hidden sm:max-md:overflow-y-scroll" >

                <div className="row-span-3 col-span-29 grid-cols-22 grid rounded-xl bg-white shadow-neutral-300 shadow-md inset-shadow-sm inset-shadow-neutral-200 lg:max-xl:grid-cols-35 md:max-lg:grid-cols-12 md:max-lg:h-17">
                    <div className="col-span-1 grid-cols-1 mt-1 w-19 h-16 rounded-full 2xl:max-2xl:15 2xl:max-2xl:h-15 xl:max-2xl:h-13 xl:max-2xl:p-1 lg:max-xl:h-13 lg:max-xl:p-1 lg:max-xl:col-span-2 md:max-lg:p-1.5 md:max-lg:col-span-1 sm:max-md:p-1.5  sm:max-md:col-span-2 relative">
                        <img src={logo} className='rounded-full 2xl:max-2xl:w-15 2xl:max-2xl:h-15 xl:max-2xl:w-13 xl:max-2xl:h-13 lg:max-xl:w-12 lg:max-xl:h-12 md:max-lg:w-13 md:max-lg:h-13 sm:max-md:h-12 sm:max-md:w-12 cursor-pointer' onClick={() => window.location.reload()}></img>
                    </div>

                    <div className='mt-4 col-span-3 w-54 h-10 text-white py-2 rounded-lg cursor-pointer flex justify-between items-center transition-all duration-200 2xl:max-2xl:w-56 2xl:max-2xl:h-10 2xl:max-2xl:p-2.5 xl:max-2xl:h-8 xl:max-2xl:p-3 lg:max-xl:p-2.5 lg:max-xl:col-span-6 md:max-lg:p-2.5 md:max-lg:col-span-4 sm:max-md:p-2 sm:max-md:col-span-7 bg-gray-800 '>
                        <CustomDropdown selected={selectedLanguage} onSelect={handleLanguageChange} />
                    </div>
                    <div className='col-span-1  justify-center w-50 h-15 2xl:max-2xl:p-2.5 2xl:max-2xl:ml-3 xl:max-2xl:p-3 lg:max-xl:p-3 lg:max-xl:ml-4 lg:max-xl:col-span-4 md:max-lg:col-span-1 md:max-lg:p-0.5 sm:max-md:p-0'>

                        <label htmlFor="file-input" className='items-center flex justify-center w-12 h-20'>
                            {/* <LuImport className="text-gray-600 h-20 w-10 md:max-lg:h-15 md:max-lg:w-8 mb-2 cursor-pointer" title='Import' /> */}
                            <FontAwesomeIcon icon={faFileArrowDown} className="text-gray-600 text-3xl md:max-lg:h-15 md:max-lg:w-8 mb-2 cursor-pointer" title='Import'/>
                            <FileReaderComponent onFileRead={handleFileContent} triggerId="file-input" />
                        </label>
                    </div>
                    <div className='mt-2 flex  items-center  col-span-1 w-40 h-14 2xl:max-2xl:p-2.5 2xl:max-2xl:ml-3 xl:max-2xl:p-3 lg:max-xl:p-3 lg:max-xl:ml-4 lg:max-xl:col-span-4 md:max-lg:col-span-1 md:max-lg:p-0.5 sm:max-md:p-0'>
                        {/* <CgExport className='text-gray-600 h-14 w-10 md:max-lg:h-13 md:max-lg:w-8 cursor-pointer' title='Export' onClick={() => exportFile(code, selectedLanguage)} /> */}
                        <FontAwesomeIcon icon={faFileArrowUp}  className='text-gray-600 text-3xl md:max-lg:h-13 md:max-lg:w-8 cursor-pointer' title='Export' onClick={() => exportFile(code, selectedLanguage)} />
                    </div>
                    <div style={{marginTop: "3.1px"}} className='flex items-center pt-1.5 col-span-1 w-40 h-15 2xl:max-2xl:p-2.5 2xl:max-2xl:ml-3 lg:max-xl:p-3 xl:max-2xl:p-3 lg:max-xl:ml-4 md:max-lg:col-span-1 md:max-lg:p-0.5 sm:max-md:p-0'>
                        <PiButterflyFill className='text-gray-600 md:max-lg:h-13 md:max-lg:w-8 h-20 w-10 cursor-pointer' title='Beautify' onClick={beautifier} />
                    </div>
                    <div className='flex items-center mt-3.5 col-span-1 w-30 h-10  2xl:max-2xl:p-2.5 xl:max-2xl:p-2 xl:max-2xl:ml-7 lg:max-xl:p-3 md:max-lg:p-2 sm:max-md:p-1'>
                        <RiExchangeLine className='text-gray-600 sm:max-md:h-13 sm:max-md:w-7 h-20 w-10 cursor-pointer' title='Convert' onClick={() => setConvertLang(!convertLang)} />
                    </div>
                    {convertLang && <div className='absolute left-140 z-10 w-50 h-120 mt-20 bg-white font-extrabold text-left rounded-xl shadow-xl shadow-gray-500'>
                        <ul>
                            <li className=' flex items-center hover:bg-gray-300 h-13' onClick={() => { setConvertLang(!convertLang); codeConverter("java") }}>
                                <p className='ml-6'>Java</p>

                            </li>
                            <li className=' flex items-center hover:bg-gray-300 h-13' onClick={() => { setConvertLang(!convertLang); codeConverter("javascript") }}>
                                <p className='ml-6'>JavaScript</p>
                            </li>
                            <li className=' flex items-center hover:bg-gray-300 h-13' onClick={() => { setConvertLang(!convertLang); codeConverter("python3") }}>
                                <p className='ml-6'>Python</p>
                            </li>
                            <li className=' flex items-center hover:bg-gray-300 h-13' onClick={() => { setConvertLang(!convertLang); codeConverter("c") }}>
                                <p className='ml-6'>C</p>
                            </li>
                            <li className=' flex items-center hover:bg-gray-300 h-13' onClick={() => { setConvertLang(!convertLang); codeConverter("cpp") }}>
                                <p className='ml-6'>C++</p>
                            </li>
                            <li className=' flex items-center hover:bg-gray-300 h-13' onClick={() => { setConvertLang(!convertLang); codeConverter("php") }}>
                                <p className='ml-6'>Php</p>
                            </li>
                            <li className=' flex items-center hover:bg-gray-300 h-13' onClick={() => { setConvertLang(!convertLang); codeConverter("ruby") }}>
                                <p className='ml-6'>Ruby</p>
                            </li>
                            <li className=' flex items-center hover:bg-gray-300 h-13' onClick={() => { setConvertLang(!convertLang); codeConverter("golang") }}>
                                <p className='ml-6'>Go</p>
                            </li>
                            <li className=' flex items-center hover:bg-gray-300 h-13' onClick={() => { setConvertLang(!convertLang); codeConverter("rlang") }}>
                                <p className='ml-6'>R</p>
                            </li>

                        </ul>
                    </div>}
                    <div className='col-span-10 xl:max-2xl:col-span-5 md:max-lg:col-span-1 lg:max-xl:col-span-6  sm:max-md:col-span-1'></div>
                    <div className='text-gray-700 mt-0.5 flex items-center col-span-1 w-17 h-17 2xl:max-2xl:h-10 2xl:max-2xl:p-3 xl:max-2xl:p-3 xl:max-2xl:h-8 lg:max-xl:p-3 md:max-lg:p-4 md:max-lg:col-span-1 sm:max-md:p-2.5  sm:max-md:col-span-2' title='Dark'>
                        {theme && <MdDarkMode className='w-8 h-8 xl:max-2xl:h-8 xl:max-2xl:w-7 md:max-lg:max-lg:h-7 md:max-lg:max-lg:w-7 cursor-pointer' onClick={() => setTheme(!theme)} />}

                    </div>
                    <div className='flex items-center pt-1.5 col-span-1 w-40 h-15 2xl:max-2xl:p-2.5 lg:max-xl:col-span-4 lg:max-xl:ml-4 lg:max-xl:p-3 md:max-lg:col-span-1 md:max-lg:p-0.5  sm:max-md:p-0'>
                        <MdOutlineSave className='text-gray-700 mt-1 md:max-lg:h-13 md:max-lg:w-8 h-20 w-10 cursor-pointer' title='Save' />
                    </div>
                    <div className='flex items-center col-span-1 w-45 h-15 pt-1.5 2xl:max-2xl:p-2.5 lg:max-xl:ml-4 lg:max-xl:p-3 lg:max-xl:col-span-3 sm:max-lg:hidden'>
                        {prompt &&
                            <RiAiGenerate2 className='text-gray-700 mt-1 md:max-lg:h-13 md:max-lg:w-8 h-20 w-10 cursor-pointer' onClick={() => setPrompt(!prompt)} title='Hide Prompt' />
                        }
                        {!prompt &&
                            <RiAiGenerate2 className='text-gray-700 mt-1 md:max-lg:h-13 md:max-lg:w-8 h-20 w-10 cursor-pointer' onClick={() => setPrompt(!prompt)} title='Show Prompt' />
                        }
                    </div>
                    <div className="w-16 h-16 rounded-full max-2xl:w-15 max-2xl:h-15 xl:max-2xl:w-13 xl:max-2xl:h-13 lg:max-xl:w-12 lg:max-xl:h-12 md:max-lg:w-13 md:max-lg:h-13 sm:max-md:w-12 sm:max-md:h-12 flex items-center justify-center overflow-hidden">
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
                            <div className="flex flex-col h-full p-6 gap-6">
                                {/* Profile Section */}
                                <div className="flex flex-col items-center gap-6 p-6 bg-white rounded-xl shadow-md border border-gray-200 transition-all duration-300 hover:shadow-lg">
                                    {/* Profile Image */}
                                    <div className="relative w-32 h-32 group">
                                        <img
                                            src={isValidImageUrl(userProfile?.imageUrl) ? userProfile.imageUrl : profileImage}
                                            alt="Profile"
                                            className="w-full h-full rounded-full border-4 border-blue-200 shadow-md object-cover transition-transform duration-300 group-hover:scale-105"
                                            onError={(e) => { e.target.src = profileImage; }}
                                        />
                                        <label className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-70 transition-opacity duration-300 rounded-full cursor-pointer">
                                            <FaEdit className="text-white text-2xl" />
                                            <input
                                                type="file"
                                                className="hidden"
                                                onChange={handleProfileImageChange}
                                                accept="image/*"
                                            />
                                        </label>
                                    </div>

                                    {/* User Details */}
                                    <div className="w-full flex shrink-0 flex-col gap-4 text-center">
                                        {/* Editable Name */}
                                        <div className="flex flex-row px-4 items-start gap-2">
                                            <User />
                                            {isEditingName ? (
                                                <div className="flex items-center gap-2 w-3/4">
                                                    <input
                                                        value={editName}
                                                        onChange={(e) => setEditName(e.target.value)}
                                                        className="flex-1 h-8 px-2 text-base border-2 rounded-lg border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                                                        placeholder="Enter new username"
                                                    />
                                                    <button
                                                        onClick={saveName}
                                                        className="px-1 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
                                                    >
                                                        <IoCheckmarkSharp className="text-2xl" />
                                                    </button>
                                                    <button
                                                        onClick={() => setIsEditingName(false)}
                                                        className="px-1 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-200"
                                                    >
                                                        <IoCloseSharp className="text-2xl" />
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2">
                                                    <span className="text-lg font-semibold text-gray-800">{userProfile?.name || "Guest"}</span>
                                                    <FaEdit
                                                        className="text-gray-500 cursor-pointer hover:text-blue-500 transition duration-200"
                                                        onClick={() => { setEditName(userProfile?.name || ""); setIsEditingName(true); }}
                                                    />
                                                </div>
                                            )}
                                        </div>

                                        {/* Email (Non-Editable) */}
                                        <div className="flex flex-row px-4 items-center gap-2">
                                            <Mail />
                                            <span className="text-lg font-semibold text-gray-800">{userProfile?.email || ""}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Saved Projects Section */}
                                <div className="flex flex-col gap-4 p-6 bg-white rounded-xl shadow-md border border-gray-200 flex-1 overflow-y-auto">
                                    <h2 className="text-xl font-semibold text-gray-800">My Projects</h2>
                                    {projects.length > 0 ? (
                                        projects.map((project, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg shadow-sm hover:bg-gray-100 transition duration-200"
                                            >
                                                <span className="text-gray-800 font-medium">{project.name}</span>
                                                <button
                                                    className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200 text-sm"
                                                    onClick={() => openProject(project)}
                                                >
                                                    Open
                                                </button>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-gray-500 text-sm italic text-center py-4">No projects saved yet</p>
                                    )}
                                </div>

                                {/* Logout Button */}
                                <div className="mt-auto pt-1">
                                    <button
                                        className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 transition duration-300 active:bg-red-700 cursor-pointer"
                                        onClick={() => navigate("/logout")}
                                    >
                                        <LuLogOut className="text-2xl" />
                                        <span className="text-lg">Logout</span>
                                    </button>
                                </div>
                            </div>
                        </SlidingPane>
                    )}

                </div>
                {prompt &&
                    <div className='row-span-3 col-span-29 grid-cols-23 grid rounded-2xl bg-white shadow-md shadow-neutral-300 md:max-lg:h-18 md:max-lg:p-1.5'>
                        <div className='col-span-15 p-2 h-18 2xl:max-2xl:h-15 lg:max-xl:col-span-14 md:max-lg:col-span-8 sm:max-md:col-span-13'>
                            <input className='p-2 rounded-xl border-gray-300 border w-310 h-13 2xl:max-2xl:h-10 2xl:max-2xl:w-5xl xl:max-2xl:h-10 xl:max-2xl:w-3xl lg:max-xl:h-10 lg:max-xl:w-xl md:max-lg:h-10 md:max-lg:w-3xs sm:max-md:w-xs sm:max-md:h-10' placeholder='Enter your prompt here...' ref={generate} id='field' autoComplete='off'></input>
                        </div>
                        <div className='flex items-center mt-1 col-span-1 w-40 h-15 p-4 2xl:max-2xl:p-2.5 2xl:max-2xl:ml-3 xl:max-2xl:p-2 lg:max-xl:col-span-3 lg:max-xl:p-3 md:max-lg:p-2 md:max-lg:col-span-4 sm:max-md:p-1'>
                            <FaCircleArrowRight className='sm:max-md:h-13 sm:max-md:w-8 h-20 w-10 text-blue-600  cursor-pointer' onClick={generateCodeFromText} title='Send' />
                        </div>
                        <div className='col-span-1 p-4 w-17 h-17 2xl:max-2xl:13 2xl:max-2xl:p-2.5 xl:max-2xl:p-3 xl:max-2xl:col-span-2 lg:max-xl:p-2.5 md:max-lg:p-2.5 md:max-lg:col-span-8 sm:max-md:p-3.5 sm:max-md:col-span-6' onClick={() => setMic(!mic)}>
                            <span title='Stop Record'>
                                {mic && <Mic className='w-8 h-8 xl:max-2xl:h-7 text-red-500 md:max-lg:w-7 md:max-lg:h-7 sm:max-md:h-7 sm:max-md:w-7  cursor-pointer' onClick={stopRecording} />}
                            </span>
                            <span title='Record'>
                                {!mic && <MicOff className='w-8 h-8 xl:max-2xl:h-7 text-gray-700 md:max-lg:w-7 md:max-lg:h-7 sm:max-md:h-7 sm:max-md:w-7  cursor-pointer' onClick={callRecord} />}
                            </span>

                        </div>


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
            <div className="w-screen h-screen overflow-hidden grid grid-rows-40 grid-cols-20 p-5 gap-2 bg-gray-100 2xl:max-2xl:h-screen 2xl:max-2xl:overflow-hidden xl:max-2xl:w-screen xl:max-2xl:h-screen xl:max-2xl:overflow-hidden lg:max-xl:w-screen lg:max-xl:h-screen lg:max-xl:overflow-hidden  md:max-lg:w-screen  md:max-lg:h-screen md:max-lg:overflow-x-hidden md:max-lg:overflow-y-scroll sm:max-md:overflow-x-hidden sm:max-md:overflow-y-scroll" id="wholeDiv">
                <div className="row-span-3 col-span-29 grid-cols-22 grid rounded-xl bg-white  shadow-md inset-shadow-sm  lg:max-xl:grid-cols-35 md:max-lg:grid-cols-12 md:max-lg:h-17" id='textArea'>
                    <div className="col-span-1 grid-cols-1 mt-1 w-19 h-16 rounded-full 2xl:max-2xl:15 2xl:max-2xl:h-15 xl:max-2xl:h-13 xl:max-2xl:p-1 lg:max-xl:h-13 lg:max-xl:p-1 lg:max-xl:col-span-2 md:max-lg:p-1.5 md:max-lg:col-span-1 sm:max-md:p-1.5  sm:max-md:col-span-2 relative">
                        <img src={logo1} className='rounded-full 2xl:max-2xl:w-15 2xl:max-2xl:h-15 xl:max-2xl:w-13 xl:max-2xl:h-13 lg:max-xl:w-12 lg:max-xl:h-12 md:max-lg:w-13 md:max-lg:h-13 sm:max-md:h-12 sm:max-md:w-12 cursor-pointer' onClick={() => window.location.reload()}></img>
                    </div>


                    <div className='mt-4 col-span-3 w-54 h-10  2xl:max-2xl:w-56 2xl:max-2xl:h-10 2xl:max-2xl:p-2.5 xl:max-2xl:h-8 xl:max-2xl:p-3 lg:max-xl:p-2.5 lg:max-xl:col-span-6 md:max-lg:p-2.5 md:max-lg:col-span-4 sm:max-md:p-2 sm:max-md:col-span-7 text-white'>
                        <CustomDropdown selected={selectedLanguage} onSelect={handleLanguageChange} />

                    </div>
                    <div className='col-span-1  justify-center w-50 h-15 2xl:max-2xl:p-2.5 2xl:max-2xl:ml-3 xl:max-2xl:p-3 lg:max-xl:p-3 lg:max-xl:ml-4 lg:max-xl:col-span-4 md:max-lg:col-span-1 md:max-lg:p-0.5 sm:max-md:p-0'>

                        <label htmlFor="file-input" className='items-center flex justify-center w-12 h-20'>
                            {/* <LuImport className="text-white h-20 w-10 md:max-lg:h-15 md:max-lg:w-8 mb-2 cursor-pointer" title='Import' /> */}
                            <FontAwesomeIcon icon={faFileArrowDown} className="text-white text-3xl md:max-lg:h-15 md:max-lg:w-8 mb-2 cursor-pointer" title='Import'/>
                            <FileReaderComponent onFileRead={handleFileContent} triggerId="file-input" />
                        </label>
                    </div>
                    <div className='mt-2 flex  items-center  col-span-1 w-40 h-14 2xl:max-2xl:p-2.5 2xl:max-2xl:ml-3 xl:max-2xl:p-3 lg:max-xl:p-3 lg:max-xl:ml-4 lg:max-xl:col-span-4 md:max-lg:col-span-1 md:max-lg:p-0.5 sm:max-md:p-0'>
                        {/* <CgExport className='text-white h-14 w-10 md:max-lg:h-13 md:max-lg:w-8 cursor-pointer' title='Export' onClick={() => exportFile(code, selectedLanguage)} /> */}
                        <FontAwesomeIcon icon={faFileArrowUp}  className='text-white text-3xl md:max-lg:h-13 md:max-lg:w-8 cursor-pointer' title='Export' onClick={() => exportFile(code, selectedLanguage)} />
                    </div>
                    <div style={{marginTop:"3.1px"}} className='mt-0.3 flex items-center pt-1.5 col-span-1 w-40 h-15 2xl:max-2xl:p-2.5 2xl:max-2xl:ml-3 lg:max-xl:p-3 xl:max-2xl:p-3 lg:max-xl:ml-4 md:max-lg:col-span-1 md:max-lg:p-0.5 sm:max-md:p-0'>
                        <PiButterflyFill className='text-white md:max-lg:h-13 md:max-lg:w-8 h-20 w-10 cursor-pointer' title='Beautify' onClick={beautifier} />
                    </div>
                    <div className='flex items-center mt-3.5 col-span-1 w-30 h-10  2xl:max-2xl:p-2.5 xl:max-2xl:p-2 xl:max-2xl:ml-7 lg:max-xl:p-3 md:max-lg:p-2 sm:max-md:p-1'>
                        <RiExchangeLine className='text-white sm:max-md:h-13 sm:max-md:w-7 h-20 w-10 cursor-pointer' title='Convert' onClick={() => setConvertLang(!convertLang)} />
                    </div>
                    <div className='col-span-10 xl:max-2xl:col-span-5 md:max-lg:col-span-1 lg:max-xl:col-span-6  sm:max-md:col-span-1'></div>
                    <div className='flex items-center col-span-1 w-17 h-17 2xl:max-2xl:h-10 2xl:max-2xl:p-3 xl:max-2xl:p-3 xl:max-2xl:h-8 lg:max-xl:p-3 md:max-lg:p-4 md:max-lg:col-span-1 sm:max-md:p-2.5  sm:max-md:col-span-2' onClick={() => setTheme(!theme)}>
                        <span title='Light'>
                            {!theme && <IoIosSunny className='w-10 h-10 xl:max-2xl:h-8 xl:max-2xl:w-7  md:max-lg:h-7 md:max-lg:w-7 text-gray-200  cursor-pointer' />}
                        </span>


                    </div>
                    <div className='flex items-center col-span-1 w-40 h-15 pt-1.5 2xl:max-2xl:p-2.5 2xl:max-2xl:ml-3 lg:max-xl:col-span-4 lg:max-xl:ml-4 lg:max-xl:p-3 md:max-lg:col-span-1 md:max-lg:p-0.5  sm:max-md:p-0'>
                        <MdOutlineSave className='sm:max-lg: sm:max-lg:h-13 sm:max-lg:w-8 h-20 w-10 text-gray-200  cursor-pointer' title='Save' />
                    </div>
                    <div className='flex items-center col-span-1 w-45 h-15 pt-1.5 2xl:max-2xl:p-2.5 2xl:max-2xl:ml-3 lg:max-xl:ml-4 lg:max-xl:p-3 lg:max-xl:col-span-3 md:max-lg:hidden sm:max-lg:hidden'>
                        {prompt &&
                            <RiAiGenerate2 className='w-10 h-20 2xl:max-2xl:h-10 xl:max-2xl:w-29 xl:max-2xl:h-9  lg:max-xl:h-9 lg:max-xl:w-27  cursor-pointer  text-gray-200' onClick={() => setPrompt(!prompt)} title='Hide Prompt' />
                        }
                        {!prompt &&
                            <RiAiGenerate2 className='w-10 h-20 2xl:max-2xl:h-10 xl:max-2xl:w-29 xl:max-2xl:h-9  lg:max-xl:h-9 lg:max-xl:w-27  cursor-pointer text-gray-200' onClick={() => setPrompt(!prompt)} title='Show Prompt' />
                        }
                    </div>
                    <div className="w-16 h-16 rounded-full max-2xl:w-15 max-2xl:h-15 xl:max-2xl:w-13 xl:max-2xl:h-13 lg:max-xl:w-12 lg:max-xl:h-12 md:max-lg:w-13 md:max-lg:h-13 sm:max-md:w-12 sm:max-md:h-12 flex items-center justify-center overflow-hidden">
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
                            <div className="flex flex-col h-full p-6 gap-6">
                                {/* Profile Section */}
                                <div className="flex flex-col items-center gap-6 p-6 bg-white rounded-xl shadow-md border border-gray-200 transition-all duration-300 hover:shadow-lg">
                                    {/* Profile Image */}
                                    <div className="relative w-32 h-32 group">
                                        <img
                                            src={isValidImageUrl(userProfile?.imageUrl) ? userProfile.imageUrl : profileImage}
                                            alt="Profile"
                                            className="w-full h-full rounded-full border-4 border-blue-200 shadow-md object-cover transition-transform duration-300 group-hover:scale-105"
                                            onError={(e) => { e.target.src = profileImage; }}
                                        />
                                        <label className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-70 transition-opacity duration-300 rounded-full cursor-pointer">
                                            <FaEdit className="text-white text-2xl" />
                                            <input
                                                type="file"
                                                className="hidden"
                                                onChange={handleProfileImageChange}
                                                accept="image/*"
                                            />
                                        </label>
                                    </div>

                                    {/* User Details */}
                                    <div className="w-full flex shrink-0 flex-col gap-4 text-center">
                                        {/* Editable Name */}
                                        <div className="flex flex-row px-4 items-start gap-2">
                                            <User />
                                            {isEditingName ? (
                                                <div className="flex items-center gap-2 w-3/4">
                                                    <input
                                                        value={editName}
                                                        onChange={(e) => setEditName(e.target.value)}
                                                        className="flex-1 h-8 px-2 text-base border-2 rounded-lg border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                                                        placeholder="Enter new username"
                                                    />
                                                    <button
                                                        onClick={saveName}
                                                        className="px-1 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
                                                    >
                                                        <IoCheckmarkSharp className="text-2xl" />
                                                    </button>
                                                    <button
                                                        onClick={() => setIsEditingName(false)}
                                                        className="px-1 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-200"
                                                    >
                                                        <IoCloseSharp className="text-2xl" />
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2">
                                                    <span className="text-lg font-semibold text-gray-800">{userProfile?.name || "Guest"}</span>
                                                    <FaEdit
                                                        className="text-gray-500 cursor-pointer hover:text-blue-500 transition duration-200"
                                                        onClick={() => { setEditName(userProfile?.name || ""); setIsEditingName(true); }}
                                                    />
                                                </div>
                                            )}
                                        </div>

                                        {/* Email (Non-Editable) */}
                                        <div className="flex flex-row px-4 items-center gap-2">
                                            <Mail />
                                            <span className="text-lg font-semibold text-gray-800">{userProfile?.email || ""}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Saved Projects Section */}
                                <div className="flex flex-col gap-4 p-6 bg-white rounded-xl shadow-md border border-gray-200 flex-1 overflow-y-auto">
                                    <h2 className="text-xl font-semibold text-gray-800">My Projects</h2>
                                    {projects.length > 0 ? (
                                        projects.map((project, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg shadow-sm hover:bg-gray-100 transition duration-200"
                                            >
                                                <span className="text-gray-800 font-medium">{project.name}</span>
                                                <button
                                                    className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200 text-sm"
                                                    onClick={() => openProject(project)}
                                                >
                                                    Open
                                                </button>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-gray-500 text-sm italic text-center py-4">No projects saved yet</p>
                                    )}
                                </div>

                                {/* Logout Button */}
                                <div className="mt-auto pt-1">
                                    <button
                                        className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 transition duration-300 active:bg-red-700 cursor-pointer"
                                        onClick={() => navigate("/logout")}
                                    >
                                        <LuLogOut className="text-2xl" />
                                        <span className="text-lg">Logout</span>
                                    </button>
                                </div>
                            </div>
                        </SlidingPane>
                    )}
                </div>
                {prompt &&
                    <div className='row-span-3 col-span-29 grid-cols-23 grid rounded-2xl bg-white shadow-md  md:max-lg:h-18 md:max-lg:p-1.5' id='textArea'>
                        <div className='col-span-15 p-2 h-18 2xl:max-2xl:h-15 lg:max-xl:col-span-14 md:max-lg:col-span-8 sm:max-md:col-span-13'>
                            <input className='p-2 rounded-xl border-gray-300 border w-310 h-13 2xl:max-2xl:h-10 2xl:max-2xl:w-5xl xl:max-2xl:h-10 xl:max-2xl:w-3xl lg:max-xl:h-10 lg:max-xl:w-xl md:max-lg:h-10 md:max-lg:w-3xs sm:max-md:w-xs sm:max-md:h-10' id='promptTag' placeholder='Enter your prompt here...'></input>
                        </div>
                        <div className='flex items-center mt-1 col-span-1 w-40 h-15 p-4 2xl:max-2xl:p-2.5 2xl:max-2xl:ml-3 xl:max-2xl:p-2 lg:max-xl:col-span-3 lg:max-xl:p-3 md:max-lg:p-2 md:max-lg:col-span-4 sm:max-md:p-1'>
                            <FaCircleArrowRight className='sm:max-md:h-13 sm:max-md:w-8 h-20 w-10 text-blue-600  cursor-pointer' title='Send' />
                        </div>
                        <div className='col-span-1 p-4 w-17 h-17 2xl:max-2xl:13 2xl:max-2xl:p-2.5 xl:max-2xl:p-3 xl:max-2xl:col-span-2 lg:max-xl:p-2.5 md:max-lg:p-2.5 md:max-lg:col-span-8 sm:max-md:p-3.5 sm:max-md:col-span-6' onClick={() => setMic(!mic)}>
                            <span title='Stop Record'>
                                {mic && <Mic className='w-8 h-8 xl:max-2xl:h-7 text-red-500 md:max-lg:w-7 md:max-lg:h-7 sm:max-md:h-7 sm:max-md:w-7  cursor-pointer' onClick={stopRecording} />}
                            </span>
                            <span title='Record'>
                                {!mic && <MicOff className='w-8 h-8 xl:max-2xl:h-7 text-white md:max-lg:w-7 md:max-lg:h-7 sm:max-md:h-7 sm:max-md:w-7  cursor-pointer' onClick={callRecord} />}
                            </span>



                        </div>


                    </div>
                }

                <div className="row-span-34 col-span-29 p-2 grid grid-cols-2 gap-5 sm:max-lg:grid-cols-1 md:max-lg:mt-2">
                    <div className='inset-shadow-sm border border-gray-600 h-220 shadow-md shadow-neutral-400 rounded-xl p-4 grid grid-rows-24 2xl:p-2.5 2xl:grid-cols-15 md:max-lg:grid-rows-28 md:max-lg:gap-1 md:max-lg:p-4 '>

                        <CodeEditor
                            className='border border-gray-300 rounded-xl p-5 row-span-22 col-span-20 2xl:max-2xl:col-span-15 xl:max-2xl:w-xl lg:max-xl:w-110 md:max-lg:w-2xl md:max-lg:row-span-25 md:max-lg:mt-1.5 sm:max-md:mt-2.5 sm:max-md:w-140' style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                            html={html} setHtml={setHtml}
                            css={css} setCss={setCss}
                            js={js} setJs={setJs}
                            code={code} setCode={setCode}
                            selectedLanguage={selectedLanguage}
                        />


                    </div>
                    <div disabled className=' inset-shadow-sm border border-gray-600 h-220 shadow-md shadow-neutral-400 rounded-xl pl-3 grid grid-rows-24 2xl:max-2xl:p-2.5 2xl:max-2xl:grid-cols-15 md:max-lg:grid-rows-28 md:max-lg:gap-1'>
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


}



export default CodeIDE_Main;