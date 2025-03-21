import { Mic, MicOff } from 'lucide-react'
import { MdDarkMode } from "react-icons/md";
import { IoIosSunny } from "react-icons/io";
import { MdOutlineSave } from "react-icons/md";
import { RiAiGenerate2 } from "react-icons/ri";
import { RiExchangeLine } from "react-icons/ri";

import { FaFolderOpen, FaTrash } from 'react-icons/fa';
import { TbWorldCode } from 'react-icons/tb';
import { SiJavascript, SiPython, SiPhp, SiRuby, SiGo, SiR, SiC, SiCplusplus } from 'react-icons/si'; // Language icons
import { FaJava } from 'react-icons/fa'; // Java icon
import { IoCheckmarkSharp } from 'react-icons/io5';
import { IoCloseSharp } from 'react-icons/io5';
import { Pencil } from "lucide-react";

import { FaEdit } from "react-icons/fa";
import { useEffect, useRef, useState, useCallback } from 'react';
import { LuLogOut } from 'react-icons/lu';
import { Mail, User } from "lucide-react";
import { FaCircleArrowRight } from "react-icons/fa6";
import logo from "./assets/logo-noBg.png"
import logo1 from "./assets/CodeAiD_DarkTheme.png";
import SlidingPane from "react-sliding-pane";
import "react-sliding-pane/dist/react-sliding-pane.css";
import { useNavigate } from "react-router-dom";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { faDownload, faWandMagicSparkles, faBars } from '@fortawesome/free-solid-svg-icons';

import CustomDropdown from "./CustomDropdown.jsx";
import CodeEditor from "./CodeEditor";
import OutputFrame from "./OutputFrame";
import FileReaderComponent from './ImportFile.jsx';
import profileImage from "./assets/Default_Profile.png";
import Popup from './Popup.jsx';
import SingleButtonPopup from './NoButtonPopup.jsx';
import RedPopup from './RedPopup.jsx';
import Loading from './Loading.jsx';





// Define language options with icons
const languageOptions = [
    { label: "Web Development", value: "web", icon: <TbWorldCode className="text-green-500 text-lg" /> },
    { label: "JavaScript", value: "javascript", icon: <SiJavascript className="text-yellow-400 text-lg" /> },
    { label: "Python", value: "python3", icon: <SiPython className="text-blue-500 text-lg" /> },
    { label: "Java", value: "java", icon: <FaJava className="text-red-500 text-lg" /> },
    { label: "C", value: "c", icon: <SiC className="text-blue-700 text-lg" /> },
    { label: "C++", value: "cpp", icon: <SiCplusplus className="text-blue-600 text-lg" /> },
    { label: "PHP", value: "php", icon: <SiPhp className="text-purple-600 text-lg" /> },
    { label: "Ruby", value: "ruby", icon: <SiRuby className="text-red-600 text-lg" /> },
    { label: "Go", value: "golang", icon: <SiGo className="text-blue-500 text-lg" /> },
    { label: "R", value: "rlang", icon: <SiR className="text-blue-400 text-lg" /> },
];

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
    const [filenameToSaveCode, setFilenameToSaveCode] = useState("Untitled");
    const [fileExtension, setFileExtension] = useState("");
    const [fileType, setFileType] = useState("web");
    const [isUnsaved, setIsUnsaved] = useState(true); // Track unsaved changes
    const [savedProjectName, setSavedProjectName] = useState(""); // Track saved project name
    const [isEditing, setIsEditing] = useState(false);
    const dropdownRef = useRef(null);

    const lastDotIndex = filenameToSaveCode !== "" ? filenameToSaveCode.lastIndexOf(".") : "Unsaved";
    const baseName = lastDotIndex !== -1 ? filenameToSaveCode.substring(0, lastDotIndex) : filenameToSaveCode;
    const extension = lastDotIndex !== -1 ? filenameToSaveCode.substring(lastDotIndex) : "";

    const [open, setOpen] = useState(false);
    const [open1, setOpen1] = useState(false);

    const [showLogPop, setShowLogPop] = useState(false);
    const [message, setMessage] = useState("");

    const editorRef = useRef(null);
    const [isLoading, setIsLoading] = useState(false);



    let outputFromVoice = "";
    var getOutput = "";
    const generate = useRef();



    // Function to get the icon based on project language/value
    const getLanguageIcon = (project) => {
        // Check if project has a language field; otherwise, infer from file extension
        const language = project.language || project.value || inferLanguageFromFilename(project.file_name);
        const option = languageOptions.find(opt => opt.value === language);
        return option ? option.icon : <FaFolderOpen className="text-gray-500 text-lg" />; // Fallback icon
    };

    // Helper function to infer language from file extension if language isn't provided
    const inferLanguageFromFilename = (filename) => {
        const extension = filename.split('.').pop().toLowerCase();
        const mapping = {
            js: 'javascript',
            html: 'web',
            css: 'web',
            py: 'python3',
            java: 'java',
            c: 'c',
            cpp: 'cpp',
            php: 'php',
            rb: 'ruby',
            go: 'golang',
            r: 'rlang',
        };
        return mapping[extension] || 'web'; // Default to 'web' if unknown
    };

    const navigate = useNavigate();

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

    useEffect(() => {
        console.log("useEffect");
        if (isLoading) {
            console.log("True");
        }
    }, [isLoading]);





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
    const [savedHtml, setSavedHtml] = useState(defaultCodes.web.html);
    const [savedCss, setSavedCss] = useState(defaultCodes.web.css);
    const [savedJs, setSavedJs] = useState(defaultCodes.web.js);
    const [savedCode, setSavedCode] = useState(defaultCodes.javascript);
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
                const profileData = await response.json();
                setUserProfile(profileData);

                // Fetch projects
                const projectsResponse = await fetch(`http://localhost:8080/CodeVision/GetUserProjectsServlet?userId=${profileData.userId}`, {
                    method: "GET",
                    credentials: "include",
                });

                if (!projectsResponse.ok) throw new Error("Failed to fetch projects");
                const projectsData = await projectsResponse.json();
                console.log("LOGGER: " + projectsData);
                setProjects(projectsData);
            }
            catch {
                console.error("Error fetching profile:", error);
                setUserProfile(null);
                setProjects([]);
            }
            finally {
                setLoadingProfile(false);
            }
        };
        fetchUserProfile();
    }, []);

    // Track unsaved changes
    useEffect(() => {
        const hasUnsavedChanges =
            (fileType === "web" && (html !== savedHtml || css !== savedCss || js !== savedJs)) ||
            (fileType !== "web" && code !== savedCode);
    }, [html, css, js, code, savedHtml, savedCss, savedJs, savedCode, fileType]);

    useEffect(() => {
        if (editorRef.current) {
            editorRef.current.focus();
        }
    }, []);


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
        setFileType(newLanguage);


        if (newLanguage === "web") {
            setHtml(defaultCodes.web.html);
            setCss(defaultCodes.web.css);
            setJs(defaultCodes.web.js);
            setSavedHtml(defaultCodes.web.html);
            setSavedCss(defaultCodes.web.css);
            setSavedJs(defaultCodes.web.js);
            setFileExtension("");
        } else {
            setCode(defaultCodes[newLanguage] || "");
            setSavedCode(defaultCodes[newLanguage] || "");
            // Map language to file extension
            const extensionMapping = {
                javascript: ".js",
                python3: ".py",
                java: ".java",
                c: ".c",
                cpp: ".cpp",
                php: ".php",
                ruby: ".rb",
                golang: ".go",
                rlang: ".r",
            };

            setFileExtension(extensionMapping[newLanguage] || "");

        }

        setSavedProjectName("Untitled");
        setFilenameToSaveCode("Untitled")
        setIsUnsaved(true);
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
                setIsLoading(false);
            }

            return (<>
                <CodeEditor />
                <CustomDropdown selected={selectedLanguage} onSelect={handleLanguageChange} />

            </>)
        }
        catch (error) {
            console.log("Failed to fetch");
            setIsLoading(false);
        }
    }

    const generateCodeFromText = async () => {
        setIsLoading(true);
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
                setIsLoading(false);
            }

            return (
                <>
                    <CodeEditor />
                    <CustomDropdown selected={selectedLanguage} onSelect={handleLanguageChange} />
                </>
            )


        }
        catch (error) {
            console.log("Failed to Fetch..");
            setIsLoading(false);
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
        setIsLoading(false);
        return (

            <>
                <CodeEditor code={setCode(outputFromVoice)} />
            </>
        )

    };

    useEffect(() => {
        if (open) {
            const timer = setTimeout(() => {
                setOpen(false);
            }, 1500); // ⏳ Close after 10 seconds

            return () => clearTimeout(timer); // Cleanup timeout when popup closes early
        }
    }, [open]);

    useEffect(() => {
        if (open1) {
            const timer = setTimeout(() => {
                setOpen1(false);
            }, 1500);

            return () => clearTimeout(timer);
        }
    }, [open1]);





    const saveCodeToDB = async () => {
        if (!userProfile?.userId) {
            setMessage("User not authenticated");
            setOpen1(true);

            return;
        }

        if (!isUnsaved) {
            let project = projects.find(project => project.file_name === filenameToSaveCode);

            console.log("Is Untitled: " + isUnsaved +
                " Project Name: " + (project ? project.file_name : "Not Found"));
            updateCodeInDB(project);
            return;
        }

        let baseFilename = filenameToSaveCode?.trim() || "Untitled";

        if (!baseFilename) {
            setFilenameToSaveCode("Untitled");
            setMessage("File name is required");
            setOpen1(true);
            return;
        }

        baseFilename = baseFilename.trim();
        if (baseFilename.length > 30) {
            setFilenameToSaveCode("Untitled");
            setMessage("Filename must not exceed 30 characters.");
            setOpen1(true);
            return;
        }

        if (baseFilename.length < 3) {
            setFilenameToSaveCode("Untitled");
            setMessage("Filename must be at least 3 characters.");
            setOpen1(true);
            return;
        }

        if (!/^[a-zA-Z0-9 _\-.()[\]&+,=]+$/.test(baseFilename)) {
            setFilenameToSaveCode("Untitled");
            setMessage("Invalid filename! Use only letters, numbers, spaces, and common symbols like _ - . ( ) [ ] & + , =");
            setOpen1(true);
            return;
        }

        try {
            let payload;
            if (fileType === "web") {
                const webFiles = {
                    name: baseFilename,
                    html: html || "",
                    css: css || "",
                    js: js || ""
                };
                payload = JSON.stringify({ type: "web", webFiles });
            } else {
                const extensionMap = {
                    "javascript": ".js", "python3": ".py", "java": ".java", "c": ".c", "cpp": ".cpp",
                    "php": ".php", "ruby": ".rb", "golang": ".go", "rlang": ".r"
                };
                const extension = extensionMap[fileType] || ".txt";
                const fullFilename = `${baseFilename}${extension}`;
                payload = JSON.stringify({ type: "single", filename: fullFilename, fileExtension: extension, content: code || "" });
            }

            const response = await fetch("http://localhost:8080/CodeVision/SaveCodeServlet", {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: payload,
            });

            const data = await response.json();
            if (data.success === true || data.success === "true") {
                setMessage("File saved successfully!");
                setOpen(true);
                setSavedProjectName(baseFilename);
                setFilenameToSaveCode(baseFilename);
                setIsUnsaved(false);
                if (fileType === "web") {
                    setSavedHtml(html);
                    setSavedCss(css);
                    setSavedJs(js);
                } else {
                    setSavedCode(code);
                }
                const projectsResponse = await fetch(`http://localhost:8080/CodeVision/GetUserProjectsServlet?userId=${userProfile.userId}`, {
                    method: "GET",
                    credentials: "include",
                });
                if (!projectsResponse.ok) throw new Error("Failed to fetch updated projects");
                const projectsData = await projectsResponse.json();
                setProjects(projectsData);
                setSlidePanel(true);
            } else {
                setFilenameToSaveCode("Untitled");
                setMessage("Failed to save: " + data.message);
                setOpen1(true);
            }
        } catch (error) {
            console.error("Error saving code:", error);
            setMessage("Error saving file: " + error.message);
            setOpen1(true);
        }
    };

    const openProject = async (project) => {
        if (!userProfile?.userId) {
            setMessage("User not authenticated");
            setOpen1(true);
            return;
        }

        try {
            const response = await fetch(`http://localhost:8080/CodeVision/GetCodeFileServlet?userId=${userProfile.userId}&filename=${encodeURIComponent(project.file_name)}`, {
                method: "GET",
                credentials: "include",
            });
            if (!response.ok) throw new Error("Failed to fetch project");
            const data = await response.json();

            setSelectedLanguage(project.file_type);
            setFileType(project.file_type);
            setFilenameToSaveCode(project.file_name);
            setSavedProjectName(project.file_name);

            if (project.file_type === "web") {
                setHtml(data.html_content || "");
                setCss(data.css_content || "");
                setJs(data.js_content || "");
                setSavedHtml(data.html_content || "");
                setSavedCss(data.css_content || "");
                setSavedJs(data.js_content || "");
                setIsUnsaved(false);
                setSlidePanel(false);
                setSelectedLanguage("web");
                return <CustomDropdown />;
            } else {
                setCode(data.code_content || "");
                setSavedCode(data.code_content || "");
                setIsUnsaved(false);
                setSlidePanel(false);
                setSelectedLanguage(inferLanguageFromFilename(data.file_name));
                return <CustomDropdown />;
            }
        } catch (error) {
            console.error("Error opening project:", error);
            setMessage("Error loading project: " + error.message);
            setOpen1(true);
        }
    };

    const updateCodeInDB = async (project) => {
        if (!userProfile?.userId) {
            setMessage("User not authenticated");
            setOpen1(true);
            return;
        }
        try {
            let payload;
            if (project.file_type === "web") {
                payload = JSON.stringify({
                    userId: userProfile.userId,
                    name: project.file_name,
                    html: html || "",
                    css: css || "",
                    js: js || ""
                });
            } else {
                payload = JSON.stringify({
                    userId: userProfile.userId,
                    name: project.file_name,
                    content: code || "",
                    type: "single"
                });
            }

            const response = await fetch("http://localhost:8080/CodeVision/UpdateCodeServlet", {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: payload,
            });

            if (!response.ok) throw new Error(`Failed to update code: ${response.statusText}`);
            const data = await response.json();
            if (data.success) {
                setMessage("File updated successfully!");
                setOpen(true);

                setSavedProjectName(project.file_name);
                setIsUnsaved(false);
                if (project.file_type === "web") {
                    setSavedHtml(html);
                    setSavedCss(css);
                    setSavedJs(js);
                } else {
                    setSavedCode(code);
                }

                const projectsResponse = await fetch(`http://localhost:8080/CodeVision/GetUserProjectsServlet?userId=${userProfile.userId}`, {
                    method: "GET",
                    credentials: "include",
                });

                if (!projectsResponse.ok) throw new Error("Failed to fetch updated projects");
                const projectsData = await projectsResponse.json();
                setProjects(projectsData);
            } else {
                setMessage("Failed to update: " + data.message);
                setOpen1(true);
            }
        } catch (error) {
            setMessage("Error updating file: " + error.message);
            setOpen1(true);
        }
    };

    const deleteProject = async (project) => {
        if (!userProfile?.userId) {
            setMessage("User not authenticated");
            setOpen1(true);
            return;
        }

        try {
            const response = await fetch("http://localhost:8080/CodeVision/DeleteCodeServlet", {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: userProfile.userId, name: project.file_name }),
            });
            if (!response.ok) throw new Error("Failed to delete project");
            const data = await response.json();
            if (data.success) {
                setMessage("Project deleted successfully!");
                setOpen(true);
                if (savedProjectName === project.file_name) {
                    setSavedProjectName("");
                    setIsUnsaved(false);
                }
                const projectsResponse = await fetch(`http://localhost:8080/CodeVision/GetUserProjectsServlet?userId=${userProfile.userId}`, {
                    method: "GET",
                    credentials: "include",
                });
                if (!projectsResponse.ok) throw new Error("Failed to fetch updated projects");
                const projectsData = await projectsResponse.json();
                setProjects(projectsData);
            } else {
                setMessage("Failed to delete project");
                setOpen1(true);
            }
        } catch (error) {
            console.error("Error deleting project:", error);
            setMessage("Error deleting project: " + error.message);
            setOpen1(true);
        }
    };

    const renameFile = async (oldFileName, newFileName) => {
        if (!userProfile?.userId) {
            setMessage("User not authenticated");
            setOpen1(true);
            return;
        }

        if (isUnsaved) {
            saveCodeToDB();
            return;
        }

        newFileName = newFileName.trim();
        if (newFileName.length > 30) {
            setFilenameToSaveCode("Untitled");
            setMessage("Filename must not exceed 30 characters.");
            setOpen1(true);
            return;
        }

        if (newFileName.length < 3) {
            setFilenameToSaveCode("Untitled");
            setMessage("Filename must be at least 3 characters.");
            setOpen1(true);
            return;
        }

        if (!/^[a-zA-Z0-9 _\-.()[\]&+,=]+$/.test(newFileName)) {
            setFilenameToSaveCode("Untitled");
            setMessage("Invalid filename! Use only letters, numbers, spaces, and common symbols like _ - . ( ) [ ] & + , =");
            setOpen1(true);
            return;
        }

        try {
            const payload = JSON.stringify({
                userId: userProfile.userId,
                oldFileName: oldFileName,
                newFileName: newFileName,
            });

            const response = await fetch("http://localhost:8080/CodeVision/RenameFileServlet", {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: payload,
            });

            const data = await response.json();
            if (data.success) {
                setMessage("File renamed successfully!");
                setOpen(true);
                setSavedProjectName(newFileName);
                setFilenameToSaveCode(newFileName);
                const projectsResponse = await fetch(`http://localhost:8080/CodeVision/GetUserProjectsServlet?userId=${userProfile.userId}`, {
                    method: "GET",
                    credentials: "include",
                });
                const projectsData = await projectsResponse.json();
                setProjects(projectsData);
            }
            else if (!data.success) {
                setFilenameToSaveCode(oldFileName);
                setMessage("Filename already exists.");
                setOpen1(true);
            }
            else {

                setFilenameToSaveCode("Untitled");
                setMessage("Failed to rename: " + data.message);
                setOpen1(true);
                throw new Error(data.message || `Failed to save file: ${response.statusText}`);
            }
        } catch (error) {
            console.error("Error renaming file:", error);
            setMessage("Error renaming file: " + error.message);
            setOpen1(true);
        }
    };

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleBlur = () => {
        if (filenameToSaveCode !== savedProjectName) {
            renameFile(savedProjectName, filenameToSaveCode);
        }
        setIsEditing(false);
    };

    const handleKeyDown = useCallback((e) => {

        
        // if (e.key === "Enter") {
        //     e.preventDefault();
        //     e.stopPropagation();
            // if (filenameToSaveCode !== savedProjectName) {
            //     renameFile(savedProjectName, filenameToSaveCode);
            // }
            // setIsEditing(false);
        // }
        if (e.ctrlKey && e.key == "s") {
            e.preventDefault();
            saveCodeToDB();
        }
    }, [filenameToSaveCode, savedProjectName, saveCodeToDB]);



    const handlePromptKeyDown = useCallback((e) => {
        // const isCodeEditorFocused = document.activeElement?.id === "code-editor";
        // if (isCodeEditorFocused) {
        //     return;
        // }
        if (e.key == "Enter") {
            e.preventDefault();
            e.stopPropagation();
            generateCodeFromText();
        }
    }, [generateCodeFromText])


    useEffect(() => {
        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [handleKeyDown, handlePromptKeyDown]);



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

        extractCode(result);

    }

    const stopRecording = async () => {
        var langSelected = false;
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

            setIsLoading(true);
            const responseObj = await response.json();
            const result = responseObj.candidates[0].content.parts[0];
            var arr = [" java", " js", " javascript", " java ", " js ", " javascript ", " python", " python ", " rlang", " rlang ", " r lang", " r ", " go ", " golang", " go lang", " php", " ruby", " c ", " cpp", " cpp ", " c++", " c"];


            for (let i = 0; i < arr.length; i++) {
                if (result.includes(arr[i])) {
                    langSelected = true;
                    break;
                }
            }

            getOutput = result + " without mentioning any other text or language or single quotes ";
            if (!langSelected) {
                getOutput += "in " + selectedLanguage + ". ";
            }
            getOutput += "If that have any main method just give with that and always name that Main."

            // geterateBothCodes(getOutput,selectedLanguage);

            setTimeout(() => {
                output();
            }, 2000)

        } catch (error) {
            console.error("Error stopping recording:", error);
        }
    };

    const beautifier = async () => {
        
        console.log("dfghjkl");
        setIsLoading(true);
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
                setIsLoading(false);
            } else {
                console.log("Error Status: ", response.status);
            }
            return (
                <CodeEditor />
            )

        }
        catch (error) {
            console.log("Failed to fetch");
            setIsLoading(false);
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

    const iconMap = {
        java: <FaJava className="text-red-500" />,
        javascript: <SiJavascript className="text-yellow-400" />,
        python3: <SiPython className="text-blue-500" />,
        c: <SiC className="text-blue-700" />,
        cpp: <SiCplusplus className="text-blue-600" />,
        php: <SiPhp className="text-purple-600" />,
        ruby: <SiRuby className="text-red-600" />,
        golang: <SiGo className="text-blue-500" />,
        rlang: <SiR className="text-blue-400" />,
    };


    if (theme) {
        return (


            <div className="w-screen h-screen overflow-hidden grid grid-rows-40 grid-cols-20 p-5 gap-2 bg-gray-100 2xl:max-2xl:h-screen 2xl:max-2xl:overflow-hidden xl:max-2xl:w-screen xl:max-2xl:h-screen xl:max-2xl:overflow-hidden lg:max-xl:w-screen lg:max-xl:h-screen md:max-lg:w-screen md:max-lg:p-2 5xs:max-2xl:overflow-x-hidden  5xs:max-2xl:overflow-y-scroll 5xs:max-3xs:p-2 5xs:max-3xs:mb-2 3xs:max-2xs:w-screen 3xs:max-2xs:p-1.5 2xs:max-xs:w-screen sm:max-md:w-screen sm:max-md:p-1.5 3xl:max-4xl:p-1.5" >

                {isLoading && (
                    <Loading />
                )}
                <div className="row-span-3 col-span-29 grid-cols-22 grid rounded-xl bg-white shadow-neutral-300 shadow-md inset-shadow-sm inset-shadow-neutral-200 lg:max-xl:grid-cols-35 md:max-lg:grid-cols-12 md:max-lg:h-16 5xs:max-xs:mt-0 3xs:max-2xs:p-0 md:max-lg:p-0">
                    <div className="col-span-1 relative grid-cols-1 mt-1 w-19 h-16 rounded-full 2xl:max-2xl:15 2xl:max-2xl:h-15 xl:max-2xl:h-13 xl:max-2xl:p-1 lg:max-xl:h-13 lg:max-xl:p-1 lg:max-xl:col-span-2 md:max-lg:p-1 md:max-lg:col-span-1  5xs:max-2\3xs:w-15 5xs:max-3xs:h-15 5xs:max-3xs:mt-0 3xs:max-2xs:mt-[-4px] sm:max-md:mt-[-5px] md:max-lg:m-[-2px]">
                        <img src={logo} className='rounded-full 2xl:max-2xl:w-15 2xl:max-2xl:h-15 xl:max-2xl:w-13 xl:max-2xl:h-13 lg:max-xl:w-12 lg:max-xl:h-12 md:max-lg:w-17 md:max-lg:h-17 sm:max-md:w-16 sm:max-md:h-16 cursor-pointer md:max-lg:mt-[-2px] 3xl:max-4xl:w-13 3xl:max-4xl:h-13 3xl:max-4xl:mt-[-5px]' onClick={() => window.location.reload()}></img>
                    </div>

                    <div className='mt-4 col-span-3 w-54 h-10 text-white py-2 rounded-lg cursor-pointer flex justify-between items-center transition-all duration-200 2xl:max-2xl:w-56 2xl:max-2xl:h-10 2xl:max-2xl:p-2.5 xl:max-2xl:h-8 xl:max-2xl:p-3 lg:max-xl:p-2.5 lg:max-xl:col-span-6 md:max-lg:p-2 md:max-lg:col-span-2 md:max-lg:w-10 bg-gray-800 5xs:max-2xs:w-27 5xs:max-2xs:h-4 5xs:max-2xs:mt-3 5xs:max-2xs:ml-11 3xs:max-2xs:col-span-4 2xs:max-md:m-1.5  sm:max-md:ml-10  sm:max-md:mt-2  sm:max-md:col-span-6 md:max-lg:h-9  3xl:max-4xl:h-10  3xl:max-4xl:p-0  3xl:max-4xl:mt-2  3xl:max-4xl:col-span-4'>
                        <CustomDropdown selected={selectedLanguage} onSelect={handleLanguageChange} />
                    </div>
                    <div className='col-span-1  justify-center w-50 h-15 2xl:max-2xl:p-2.5 2xl:max-2xl:ml-3 xl:max-2xl:p-3 lg:max-xl:p-3 lg:max-xl:ml-4 lg:max-xl:col-span-4 md:max-lg:col-span-1 md:max-lg:p-0.5'>
                        <label htmlFor="file-input" className='items-center flex justify-center w-12 h-20 5xs:max-md:hidden'>
                            <FaFolderOpen className="text-gray-600 text-4xl  md:max-lg:h-14.5 md:max-lg:w-7.5 md:max-lg:mt-[-5px] md:max-lg:ml-4 mb-2  3xl:max-4xl:p-0  3xl:max-4xl:h-10  3xl:max-4xl:w-10 cursor-pointer  3xl:max-4xl:mt-[-39px]  3xl:max-4xl:ml-[-50px]" title='Open File' />
                            <FileReaderComponent onFileRead={handleFileContent} triggerId="file-input" />
                        </label>
                    </div>
                    <div className='mt-1 flex  items-center  col-span-1 w-40 h-14 2xl:max-2xl:p-2.5 2xl:max-2xl:ml-3 xl:max-2xl:p-3 lg:max-xl:p-3 lg:max-xl:ml-4 lg:max-xl:col-span-4 md:max-lg:col-span-1 md:max-lg:p-0.5 5xs:max-md:hidden  3xl:max-4xl:m-0  3xl:max-4xl:p-0  3xl:max-4xl:mt-[-2px]'>
                        <FontAwesomeIcon icon={faDownload} className='text-gray-600 text-3xl md:max-lg:h-13 md:max-lg:w-8 cursor-pointer md:max-lg:ml-1.5' title='Download' onClick={() => exportFile(code, selectedLanguage)} />
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
                            className="absolute left-135 top-20 mt-3 w-48 rounded-xl z-10 bg-white/90 backdrop-blur-lg shadow-lg ring-1 ring-gray-300 transition-all duration-300 animate-fadeIn"
                        >

                            <ul className="py-2">
                                {["java", "javascript", "python3", "c", "cpp", "php", "ruby", "golang", "rlang"].map((lang) => (
                                    lang !== selectedLanguage && (
                                        <li
                                            key={lang}
                                            className="px-4 py-3 flex items-center gap-2 text-gray-800 font-semibold hover:bg-gray-500 hover:text-white rounded-md transition-all duration-200 cursor-pointer"
                                            onClick={() => {
                                                setIsLoading(true);
                                                setConvertLang(false);
                                                codeConverter(lang);
                                            }}
                                        >
                                            {iconMap[lang]}
                                            {(lang === "python3" ? "Python" : lang)}
                                        </li>
                                    )

                                ))}
                            </ul>
                        </div>
                    )}


                    <div className='3xl:max-4xl:col-span-6 3xl:max-4xl:block hidden'></div>
                    <div className="col-span-10 h-10 mt-4 w-50 ml-140 xl:max-2xl:col-span-3 md:max-lg:col-span-1 lg:max-xl:col-span-4 
                        flex items-center gap-1 border border-gray-300 rounded p-1 px-2 3xl:max-4xl:mt-2 3xl:max-4xl:ml-0">
                        {isEditing ? (
                            <div className="flex items-center w-full">
                                <input
                                    type="text"
                                    value={baseName}
                                    onChange={(e) => setFilenameToSaveCode(e.target.value + extension)}
                                    onBlur={handleBlur}
                                    onKeyDown={handleKeyDown}
                                    autoFocus={isEditing}
                                    className="border p-1 rounded w-full text-ellipsis focus:ring focus:ring-blue-300 outline-none text-sm"
                                />
                                <span className="ml-1 text-gray-600 flex-shrink-0 text-sm">{extension || fileExtension}</span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-1 w-full">
                                <div className="flex-grow flex items-center overflow-hidden">
                                    <span
                                        className={`text-sm font-semibold ${isUnsaved ? 'text-red-500' : 'text-gray-800'} 
                                        overflow-hidden text-ellipsis whitespace-nowrap flex-grow`}
                                        title={filenameToSaveCode} // Full filename on hover
                                    >
                                        {baseName}
                                    </span>
                                    <span className="text-gray-500 flex-shrink-0 text-sm">{extension || fileExtension}</span>
                                </div>
                                <Pencil
                                    className="w-4 h-4 text-gray-500 cursor-pointer flex-shrink-0 hover:text-blue-500"
                                    onClick={handleEditClick}
                                />
                            </div>
                        )}
                    </div>
                    {open && <SingleButtonPopup open={open} onClose={() => setOpen(false)} message={message} />}
                    {open1 && <RedPopup open={open1} onClose={() => setOpen1(false)} message={message} />}
                    <div className='flex items-center pt-1.5 col-span-1 w-40 h-15 2xl:max-2xl:p-2.5 lg:max-xl:col-span-4 lg:max-xl:ml-4 lg:max-xl:p-3 md:max-lg:col-span-1 md:max-lg:p-0.5 md:max-lg:ml-8 5xs:max-md:hidden'>
                        <MdOutlineSave className='text-gray-700 mt-1 md:max-lg:h-18 md:max-lg:w-9 md:max-lg:mt-2.5 h-20 w-10 cursor-pointer  3xl:max-4xl:mt-[-10px]  3xl:max-4xl:w-10 3xl:max-4xl:ml-8' title='Save' onClick={() => saveCodeToDB(filenameToSaveCode, fileExtension, code)} />
                    </div>
                    <div className='flex items-center col-span-1 w-45 h-15 pt-1.5 2xl:max-2xl:p-2.5 lg:max-xl:ml-4 lg:max-xl:p-3 lg:max-xl:col-span-3  5xs:max-md:hidden md:max-lg:ml-7  3xl:max-4xl:mt-[-7px]  3xl:max-4xl:w-9.5 3xl:max-4xl:ml-8'>
                        {prompt &&
                            <RiAiGenerate2 className='text-gray-700 mt-1 md:max-lg:h-18 md:max-lg:w-9 md:max-lg:mt-[-1px] h-20 w-10 cursor-pointer' onClick={() => setPrompt(!prompt)} title='Hide Prompt' />
                        }
                        {!prompt &&
                            <RiAiGenerate2 className='text-gray-700 mt-1 md:max-lg:h-18 md:max-lg:w-9 md:max-lg:mt[-1px] h-20 w-10 cursor-pointer' onClick={() => setPrompt(!prompt)} title='Show Prompt' />
                        }
                    </div>
                    <div className='hidden 5xs:max-md:block 5xs:max-2xs:flex 5xs:max-2xs:items-center col-span-1 5xs:max-2xs:text-2xl 5xs:max-3xs:mb-2 3xs:max-2xs:text-3xl  sm:max-md:text-3xl sm:max-md:mt-2.5'>
                        <FontAwesomeIcon icon={faBars} />
                    </div>
                    <div className='text-gray-700 mt-0.5 flex items-center col-span-1 w-17 h-17 2xl:max-2xl:h-10 2xl:max-2xl:p-3 xl:max-2xl:p-3 xl:max-2xl:h-8 lg:max-xl:p-3 md:max-lg:p-4 md:max-lg:col-span-1 5xs:max-md:hidden  3xl:max-4xl:mt-3 3xl:max-4xl:ml-4' title='Dark'>
                        {theme && <MdDarkMode className='w-8 h-8 xl:max-2xl:h-8 xl:max-2xl:w-7 md:max-lg:max-lg:h-7 md:max-lg:mt-[-4px] md:max-lg:max-lg:w-7 cursor-pointer' onClick={() => setTheme(!theme)} />}
                    </div>
                    <div className="w-14 h-14 mt-2 rounded-full max-2xl:w-15 max-2xl:h-15 xl:max-2xl:w-13 xl:max-2xl:h-13 lg:max-xl:w-12 lg:max-xl:h-12 md:max-lg:w-13 md:max-lg:h-13 flex items-center justify-center overflow-hidden 5xs:max-3xs:w-8 5xs:max-3xs:mt-3 5xs:max-3xs:h-8 5xs:max-3xs:ml-4 3xs:max-2xs:w-12 3xs:max-2xs:h-12 3xs:max-2xs:ml-5 3xs:max-2xs:mt-1.5 sm:max-md:w-12 sm:max-md:h-12  sm:max-md:ml-7  sm:max-md:m-1 3xl:max-4xl:m-2  3xl:max-4xl:w-10.5 3xl:max-4xl:h-10.5">
                        <img
                            src={isValidImageUrl(userProfile?.imageUrl) ? userProfile.imageUrl : profileImage}
                            className="w-full h-full rounded-full cursor-pointer object-cover"
                            onClick={() => setSlidePanel(!slidePanel)}
                        />
                    </div>

                    {slidePanel && (
                        <SlidingPane
                            closeIcon={
                                <span className="absolute top-3 right-6 text-3xl font-bold cursor-pointer text-blue-500 hover:text-blue-700 transition duration-200">
                                    X
                                </span>
                            }
                            isOpen={slidePanel}
                            title={<span className="text-2xl font-semibold text-gray-800">My Profile</span>}
                            width="500px"
                            onRequestClose={() => setSlidePanel(false)}
                            className="!p-0 bg-gray-100 rounded-l-xl shadow-2xl relative"
                        >
                            <div className="flex flex-col h-full p-6 gap-6">
                                <div className="flex flex-col items-center gap-6 p-6 bg-white rounded-xl shadow-md border border-gray-200 transition-all duration-300 hover:shadow-lg">
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

                                    <div className="w-full flex flex-col gap-4 text-center">
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

                                        <div className="flex flex-row px-4 items-center gap-2">
                                            <Mail />
                                            <span className="text-lg font-semibold text-gray-800">{userProfile?.email || ""}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-4 p-6 bg-white rounded-xl shadow-md border border-gray-200 flex-1 overflow-y-auto">
                                    <h2 className="text-xl font-semibold text-gray-800 animate-fade-in text-center">My Projects</h2>
                                    {projects && projects.length > 0 ? (
                                        projects.map((project, index) => (
                                            <div
                                                key={project.id || index}
                                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg shadow-sm hover:bg-gray-100 transition duration-200 ease-in-out transform hover:scale-[1.02] cursor-pointer animate-slide-up"
                                                onClick={() => openProject(project)}
                                            >
                                                <div className="flex items-center gap-2 flex-1 truncate">
                                                    {getLanguageIcon(project)}
                                                    <span className="text-gray-800 font-medium truncate">{project.file_name}</span>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button
                                                        className="flex items-center gap-1 px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-200 ease-in-out text-sm transform hover:scale-105 cursor-pointer"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setSlidePanel(false);
                                                            deleteProject(project);
                                                        }}
                                                    >
                                                        <FaTrash className="text-sm" />
                                                        <span className="hidden sm:inline">Delete</span>
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-gray-500 text-sm italic text-center py-4 animate-fade-in">No projects saved yet</p>
                                    )}
                                </div>

                                <div className="mt-auto">
                                    <button
                                        className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition duration-300 active:bg-blue-700 cursor-pointer"
                                        onClick={() => {
                                            <>
                                                {setShowLogPop(true)}
                                                {setSlidePanel(false)}
                                            </>
                                        }}
                                    >
                                        <LuLogOut className="text-xl" />
                                        <span className="text-lg">Logout</span>
                                    </button>
                                </div>

                            </div>
                        </SlidingPane>
                    )}

                </div>
                {showLogPop && <Popup open={showLogPop} onClose={() => setShowLogPop(false)} />}
                {prompt &&
                    <div className='row-span-3 col-span-29 grid-cols-23 grid rounded-2xl bg-white shadow-md shadow-neutral-300 md:max-lg:h-15 md:max-lg:mt-2'>
                        <div className='col-span-15 p-2 h-18 2xl:max-2xl:h-15 lg:max-xl:col-span-14 md:max-lg:col-span-15 3xl:max-4xl:col-span-16 3xl:max-4xl:p-1'>
                            <input className='p-2 rounded-xl border-gray-300 border w-310 h-13 2xl:max-2xl:h-10 2xl:max-2xl:w-5xl xl:max-2xl:h-10 xl:max-2xl:w-3xl lg:max-xl:h-10 lg:max-xl:w-xl md:max-lg:h-10 md:max-lg:w-xl 5xs:max-2xs:w-75 5xs:max-2xs:h-10.5 3xs:max-2xs:w-100  sm:max-md:w-120  sm:max-md:h-10 3xl:max-4xl:w-full 3xl:max-4xl:h-12' onKeyDown={(e) => handlePromptKeyDown(e)} placeholder='Enter your prompt here...' ref={generate} id='field' autoComplete='off'></input>
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

                <div className="row-span-34 col-span-29 p-2 grid grid-cols-2 gap-5 md:max-lg:mt-2 md:max-lg:grid-cols-1 md:max-lg:p-1 5xs:max-md:grid-cols-1 5xs:max-3xs:gap-3">
                    <div className='inset-shadow-sm inset-shadow-neutral-200 h-220 shadow-md shadow-neutral-400 rounded-xl p-4 grid grid-rows-24 2xl:p-2.5 2xl:grid-cols-15 md:max-lg:grid-rows-28 md:max-lg:gap-1 md:max-lg:p-1  5xs:max-2xs:p-0 5xs:max-3xs:h-110 3xs:max-2xs:h-120 5xs:max-3xs:w-81 3xs:max-2xs:w-130 sm:max-md:p-1 sm:max-md:w-158 3xl:max-4xl:p-2 3xl:max-4xl:h-178'>

                        <CodeEditor
                            className='border border-gray-300 rounded-xl p-5 row-span-22 col-span-20 2xl:max-2xl:col-span-15 xl:max-2xl:w-xl lg:max-xl:w-110 md:max-lg:w-xl md:max-lg:row-span-25 md:max-lg:mt-1.5 5xs:max-3xs:w-60 '
                            html={html} setHtml={setHtml}
                            css={css} setCss={setCss}
                            js={js} setJs={setJs}
                            code={code} setCode={setCode}
                            selectedLanguage={selectedLanguage}

                        />


                    </div>
                    <div className='inset-shadow-sm inset-shadow-neutral-200 h-220 shadow-md shadow-neutral-400 rounded-xl pl-3 grid grid-rows-24 2xl:max-2xl:p-2.5 2xl:max-2xl:grid-cols-15 md:max-lg:grid-rows-28 md:max-lg:gap-0 md:max-lg:p-0 md:max-lg:h-180 5xs:max-3xs:p-0 5xs:max-3xs:h-90  3xs:max-2xs:h-100 5xs:max-3xs:w-81 3xs:max-2xs:w-full sm:max-md:p-1 sm:max-md:w-158  sm:max-md:h-178 3xl:max-4xl:p-1 3xl:max-4xl:h-178'>
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
                {isLoading && (
                    <Loading />
                )}
                <div className="row-span-3 col-span-29 grid-cols-22 grid rounded-xl bg-white  shadow-md inset-shadow-sm border  lg:max-xl:grid-cols-35 md:max-lg:grid-cols-12 md:max-lg:h-16 5xs:max-xs:mt-0 3xs:max-2xs:p-0 md:max-lg:p-0 border-gray-600" id='textArea'>
                    <div className="col-span-1 relative grid-cols-1 mt-1 w-19 h-16 rounded-full 2xl:max-2xl:15 2xl:max-2xl:h-15 xl:max-2xl:h-13 xl:max-2xl:p-1 lg:max-xl:h-13 lg:max-xl:p-1 lg:max-xl:col-span-2 md:max-lg:p-1 md:max-lg:col-span-1  5xs:max-2\3xs:w-15 5xs:max-3xs:h-15 5xs:max-3xs:mt-0 3xs:max-2xs:mt-[-4px] sm:max-md:mt-[-5px] md:max-lg:m-[-2px]">
                        <img src={logo1} className='rounded-full 2xl:max-2xl:w-15 2xl:max-2xl:h-15 xl:max-2xl:w-13 xl:max-2xl:h-13 lg:max-xl:w-12 lg:max-xl:h-12 md:max-lg:w-17 md:max-lg:h-17 sm:max-md:w-16 sm:max-md:h-16 cursor-pointer md:max-lg:mt-[-2px] 3xl:max-4xl:w-13 3xl:max-4xl:h-13 3xl:max-4xl:mt-[-5px]' onClick={() => window.location.reload()}></img>
                    </div>
                    <div className='mt-4 col-span-3 w-54 h-10 text-white py-2 rounded-lg cursor-pointer flex justify-between items-center transition-all duration-200 2xl:max-2xl:w-56 2xl:max-2xl:h-10 2xl:max-2xl:p-2.5 xl:max-2xl:h-8 xl:max-2xl:p-3 lg:max-xl:p-2.5 lg:max-xl:col-span-6 md:max-lg:p-2 md:max-lg:col-span-2 md:max-lg:w-10 bg-gray-800 5xs:max-2xs:w-27 5xs:max-2xs:h-4 5xs:max-2xs:mt-3 5xs:max-2xs:ml-11 3xs:max-2xs:col-span-4 2xs:max-md:m-1.5  sm:max-md:ml-10  sm:max-md:mt-2  sm:max-md:col-span-6 md:max-lg:h-9  3xl:max-4xl:h-10  3xl:max-4xl:p-0  3xl:max-4xl:mt-2  3xl:max-4xl:col-span-4'>
                        <CustomDropdown selected={selectedLanguage} onSelect={handleLanguageChange} />

                    </div>
                    <div className='col-span-1  justify-center w-50 h-15 2xl:max-2xl:p-2.5 2xl:max-2xl:ml-3 xl:max-2xl:p-3 lg:max-xl:p-3 lg:max-xl:ml-4 lg:max-xl:col-span-4 md:max-lg:col-span-1 md:max-lg:p-0.5'>

                        <label htmlFor="file-input" className='items-center flex justify-center w-12 h-20 5xs:max-md:hidden'>
                            <FaFolderOpen className="text-white text-4xl md:max-lg:h-14.5 md:max-lg:w-7.5 md:max-lg:mt-[-5px] md:max-lg:ml-4 mb-2  3xl:max-4xl:p-0  3xl:max-4xl:h-10  3xl:max-4xl:w-10 cursor-pointer  3xl:max-4xl:mt-[-39px]  3xl:max-4xl:ml-[-50px]" title='Open File' />
                            <FileReaderComponent onFileRead={handleFileContent} triggerId="file-input" />
                        </label>
                    </div>
                    <div className='mt-1 flex  items-center  col-span-1 w-40 h-14 2xl:max-2xl:p-2.5 2xl:max-2xl:ml-3 xl:max-2xl:p-3 lg:max-xl:p-3 lg:max-xl:ml-4 lg:max-xl:col-span-4 md:max-lg:col-span-1 md:max-lg:p-0.5 5xs:max-md:hidden  3xl:max-4xl:m-0  3xl:max-4xl:p-0  3xl:max-4xl:mt-[-2px]'>
                        <FontAwesomeIcon icon={faDownload} className='text-white text-3xl md:max-lg:h-13 md:max-lg:w-8 cursor-pointer md:max-lg:ml-1.5' title='Download' onClick={() => exportFile(code, selectedLanguage)} />
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
                            className="absolute left-135 top-20 mt-3 w-48 rounded-xl z-10 bg-gray-900 backdrop-blur-lg shadow-lg ring-1 transition-all duration-300 animate-fadeIn"
                        >

                            <ul className="py-2">
                                {["java", "javascript", "python3", "c", "cpp", "php", "ruby", "golang", "rlang"].map((lang) => (
                                    lang !== selectedLanguage && (
                                        <li
                                            key={lang}
                                            className="px-4 py-3 flex items-center gap-2 text-gray-400 font-semibold hover:bg-gray-500 hover:text-white rounded-md transition-all duration-200 cursor-pointer"
                                            onClick={() => {
                                                setIsLoading(true);
                                                setConvertLang(false);
                                                codeConverter(lang);
                                            }}
                                        >
                                            {iconMap[lang]}
                                            {(lang === "python3" ? "Python" : lang)}
                                        </li>
                                    )

                                ))}
                            </ul>
                        </div>
                    )}
                    <div className='3xl:max-4xl:col-span-6 3xl:max-4xl:block hidden'></div>
                    <div className="col-span-10 h-10 mt-4 w-50 ml-140 xl:max-2xl:col-span-3 md:max-lg:col-span-1 lg:max-xl:col-span-4 
                        flex items-center gap-1 border border-gray-300 rounded p-1 px-2 3xl:max-4xl:mt-2 3xl:max-4xl:ml-0">
                        {isEditing ? (
                            <div className="flex items-center w-full">
                                <input
                                    type="text"
                                    value={baseName}
                                    onChange={(e) => setFilenameToSaveCode(e.target.value + extension)}
                                    onBlur={handleBlur}
                                    onKeyDown={handleKeyDown}
                                    autoFocus={isEditing}
                                    className="border p-1 rounded w-full text-ellipsis focus:ring focus:ring-blue-300 outline-none text-sm text-white"
                                />
                                <span className="ml-1 text-white flex-shrink-0 text-sm">{extension || fileExtension}</span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-1 w-full">
                                <div className="flex-grow flex items-center overflow-hidden">
                                    <span
                                        className={`text-sm font-semibold ${isUnsaved ? 'text-red-500' : 'text-white'} 
                                        overflow-hidden text-ellipsis whitespace-nowrap flex-grow`}
                                        title={filenameToSaveCode} // Full filename on hover
                                    >
                                        {baseName}
                                    </span>
                                    <span className="text-white flex-shrink-0 text-sm">{extension || fileExtension}</span>
                                </div>
                                {/* Edit Icon - Doesn't shrink */}
                                <Pencil
                                    className="w-4 h-4 text-white cursor-pointer flex-shrink-0 hover:text-blue-500"
                                    onClick={handleEditClick}
                                />
                            </div>
                        )}
                    </div>

                    {open && <SingleButtonPopup open={open} onClose={() => setOpen(false)} message={message} />}
                    {open1 && <RedPopup open={open1} onClose={() => setOpen1(false)} message={message} />}
                    <div className='flex items-center pt-1.5 col-span-1 w-40 h-15 2xl:max-2xl:p-2.5 lg:max-xl:col-span-4 lg:max-xl:ml-4 lg:max-xl:p-3 md:max-lg:col-span-1 md:max-lg:p-0.5 md:max-lg:ml-8 5xs:max-md:hidden'>
                        <MdOutlineSave className='text-white mt-1 md:max-lg:h-18 md:max-lg:w-9 md:max-lg:mt-2.5 h-20 w-10 cursor-pointer  3xl:max-4xl:mt-[-10px]  3xl:max-4xl:w-10 3xl:max-4xl:ml-8' title='Save' onClick={() => saveCodeToDB(filenameToSaveCode, fileExtension, code)} />
                    </div>

                    <div className='flex items-center col-span-1 w-45 h-15 pt-1.5 2xl:max-2xl:p-2.5 lg:max-xl:ml-4 lg:max-xl:p-3 lg:max-xl:col-span-3  5xs:max-md:hidden md:max-lg:ml-7  3xl:max-4xl:mt-[-7px]  3xl:max-4xl:w-9.5 3xl:max-4xl:ml-8'>
                        {prompt &&
                            <RiAiGenerate2 className='text-white mt-1 md:max-lg:h-18 md:max-lg:w-9 md:max-lg:mt-[-1px] h-20 w-10 cursor-pointer' onClick={() => setPrompt(!prompt)} title='Hide Prompt' />
                        }
                        {!prompt &&
                            <RiAiGenerate2 className='text-white mt-1 md:max-lg:h-18 md:max-lg:w-9 md:max-lg:mt[-1px] h-20 w-10 cursor-pointer' onClick={() => setPrompt(!prompt)} title='Show Prompt' />
                        }
                    </div>
                    <div className='hidden 5xs:max-md:block 5xs:max-2xs:flex 5xs:max-2xs:items-center col-span-1 5xs:max-2xs:text-2xl 5xs:max-3xs:mb-2 3xs:max-2xs:text-3xl  sm:max-md:text-3xl sm:max-md:mt-2.5 text-white'>
                        <FontAwesomeIcon icon={faBars} />
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
                                <span className="absolute top-3 right-6 text-3xl font-bold cursor-pointer text-blue-500 hover:text-blue-700 transition duration-200">
                                    X
                                </span>
                            }
                            isOpen={slidePanel}
                            title={<span className="text-2xl font-semibold text-gray-800">My Profile</span>}
                            width="500px"
                            onRequestClose={() => setSlidePanel(false)}
                            className="!p-0 bg-gray-100 rounded-l-xl shadow-2xl relative"
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
                                    <div className="w-full flex flex-col gap-4 text-center">
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
                                    <h2 className="text-xl font-semibold text-gray-800 animate-fade-in text-center">My Projects</h2>
                                    {projects && projects.length > 0 ? (
                                        projects.map((project, index) => (
                                            <div
                                                key={project.id || index}
                                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg shadow-sm hover:bg-gray-100 transition duration-200 ease-in-out transform hover:scale-[1.02] cursor-pointer animate-slide-up"
                                                onClick={() => openProject(project)}
                                            >
                                                <div className="flex items-center gap-2 flex-1 truncate">
                                                    {getLanguageIcon(project)}
                                                    <span className="text-gray-800 font-medium truncate">{project.file_name}</span>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button
                                                        className="flex items-center gap-1 px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-200 ease-in-out text-sm transform hover:scale-105 cursor-pointer"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            deleteProject(project);
                                                        }}
                                                    >
                                                        <FaTrash className="text-sm" />
                                                        <span className="hidden sm:inline">Delete</span>
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-gray-500 text-sm italic text-center py-4 animate-fade-in">No projects saved yet</p>
                                    )}
                                </div>

                                {/* Logout Button */}
                                <div className="mt-auto">
                                    <button
                                        className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition duration-300 active:bg-blue-700 cursor-pointer"
                                        onClick={() => {
                                            <>
                                                {/* {setOpen(true)}; */}
                                                {setShowLogPop(true)}
                                                {setSlidePanel(false)}
                                            </>
                                        }}
                                    >
                                        <LuLogOut className="text-xl" />
                                        <span className="text-lg">Logout</span>
                                    </button>
                                </div>

                            </div>
                        </SlidingPane>
                    )}
                </div>
                {showLogPop && <Popup open={showLogPop} onClose={() => setShowLogPop(false)} />}
                {prompt &&
                    <div className='row-span-3 col-span-29 grid-cols-23 grid rounded-2xl bg-white shadow-md  md:max-lg:h-18 md:max-lg:p-1.5  border border-gray-600' id='textArea'>
                        <div className='col-span-15 p-2 h-18 2xl:max-2xl:h-15 lg:max-xl:col-span-14 md:max-lg:col-span-15 3xl:max-4xl:col-span-16 3xl:max-4xl:p-1'>
                            <input className='p-2 rounded-xl border-gray-300 border w-310 h-13 2xl:max-2xl:h-10 text-white 2xl:max-2xl:w-5xl xl:max-2xl:h-10 xl:max-2xl:w-3xl lg:max-xl:h-10 lg:max-xl:w-xl md:max-lg:h-10 md:max-lg:w-xl 5xs:max-2xs:w-75 5xs:max-2xs:h-10.5 3xs:max-2xs:w-100  sm:max-md:w-120  sm:max-md:h-10 3xl:max-4xl:w-full 3xl:max-4xl:h-12' onKeyDown={(e) => handlePromptKeyDown(e)} placeholder='Enter your prompt here...' ref={generate} id='field' autoComplete='off'></input>
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

                        <CodeEditor id="code-editor"
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