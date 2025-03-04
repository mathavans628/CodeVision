
import React, { useRef, useState, useEffect } from "react";
import { 
  SiJavascript, SiPython, SiC, SiCplusplus, SiPhp, 
  SiRuby, SiGo, SiR, SiHtml5, SiCss3 
} from "react-icons/si";
import { FaJava } from "react-icons/fa";
import { TbWorldCode } from "react-icons/tb";

const languageOptions = [
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

const CustomDropdown = ({ selected, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(selected || "web"); // Default selected value
  const dropdownRef = useRef(null);

  // Update selected option when prop changes
  useEffect(() => {
    setSelectedValue(selected);
  }, [selected]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelect = (value) => {
    setSelectedValue(value); // Update internal state
    onSelect(value); // Notify parent component
    setIsOpen(false); // Close dropdown
  };

  const selectedOption = languageOptions.find((opt) => opt.value === selectedValue);

  return (
    <div className="relative inline-block w-64 5xs:max-2xs:w-30 5xs:max-2xs:h-4" ref={dropdownRef}>
      {/* Selected Option (Trigger) */}
      <div
        className="px-4 py-2 rounded-lg cursor-pointer flex justify-between items-center transition-all duration-200 bg-gray-800 text-white w-54 h-10 5xs:max-3xs:w-27 5xs:max-3xs:h-8 3xs:max-2xs:w-45 3xs:max-2xs:h-9 md:max-lg:w-30 md:max-lg:h-9"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2">
          {selectedOption?.icon} {selectedOption?.label || "Select Language"}
        </div>
        <span className="text-gray-300">{isOpen ? "▲" : "▼"}</span>
      </div>

      {/* Dropdown List */}
      {isOpen && (
        <div className="absolute w-full bg-gray-900 text-white rounded-lg shadow-md mt-1 z-10 overflow-hidden 5xs:max-3xs:w-30">
          {languageOptions.map((option) => (
            <div
              key={option.value}
              className="px-4 py-2 hover:bg-gray-700 cursor-pointer flex items-center gap-2 transition-all duration-200 "
              onClick={() => handleSelect(option.value)}
            >
              {option.icon} {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;
