import React from "react";
import { 
  SiJavascript, SiPython, SiC, SiCplusplus, SiPhp, 
  SiRuby, SiGo, SiR
} from "react-icons/si";
import { FaJava } from "react-icons/fa";
import { TbWorldCode } from "react-icons/tb";
import { useRef, useEffect,useState } from "react";


const LanguageList = ({ selectedLanguage, setConvertLang, codeConverter }) =>  {
    const languages = [
        { label: "Web", value: "web", icon: <TbWorldCode className="text-green-500" /> },
        { label: "JS", value: "javascript", icon: <SiJavascript className="text-yellow-400" /> },
        { label: "Python", value: "python3", icon: <SiPython className="text-blue-500" /> },
        { label: "Java", value: "java", icon: <FaJava className="text-red-500" /> },
        { label: "C", value: "c", icon: <SiC className="text-blue-700" /> },
        { label: "C++", value: "cpp", icon: <SiCplusplus className="text-blue-600" /> },
        { label: "PHP", value: "php", icon: <SiPhp className="text-purple-600" /> },
        { label: "Ruby", value: "ruby", icon: <SiRuby className="text-red-600" /> },
        { label: "Go", value: "golang", icon: <SiGo className="text-blue-500" /> },
        { label: "R", value: "rlang", icon: <SiR className="text-blue-400" /> },
    ];
    const dropdownRef = useRef(null);
    const [convertLang1, setConvertLang1] = useState(false);

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setConvertLang(false); // Close dropdown if click is outside
            }
        }

        if (convertLang1) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [convertLang1]);
    return(
        <div
                            ref={dropdownRef}
                            className="absolute left-135 top-20 mt-3 w-48 rounded-xl z-10 bg-white/90 backdrop-blur-lg shadow-lg ring-1 ring-gray-300 transition-all duration-300 animate-fadeIn"
                        >
        <ul className="py-2">
            {languages
                .filter((lang) => lang.value !== selectedLanguage) // Exclude selected language
                .map((lang) => (
                    <li
                        key={lang.value}
                        className="px-4 py-3 flex items-center gap-2 text-gray-800 font-semibold hover:bg-gray-500 hover:text-white rounded-md transition-all duration-200 cursor-pointer"
                        onClick={() => {
                            setConvertLang(false);
                            codeConverter(lang.value); // Pass only the language value
                        }}
                    >
                        {lang.icon} {lang.label} {/* Show icon & text */}
                    </li>
                ))}
        </ul>
        </div>
    );
}

export default LanguageList;