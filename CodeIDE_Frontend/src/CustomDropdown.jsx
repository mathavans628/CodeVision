// import React, { useRef, useState,useEffect } from "react";
// import { SiJavascript, SiPython, SiC, SiCplusplus, SiPhp, SiRuby, SiGo, SiR, SiHtml5, SiCss3 } from "react-icons/si";
// import { FaJava } from "react-icons/fa";
// import { TbWorldCode } from "react-icons/tb";

// const languageOptions = [
//   { label: "Web Development", value: "web", icon: <TbWorldCode className="text-green-500" /> },
//   { label: "JavaScript", value: "javascript", icon: <SiJavascript className="text-yellow-400" /> },
//   { label: "Python", value: "python3", icon: <SiPython className="text-blue-500" /> },
//   { label: "Java", value: "java", icon: <FaJava className="text-red-500" /> },
//   { label: "C", value: "c", icon: <SiC className="text-blue-700" /> },
//   { label: "C++", value: "cpp", icon: <SiCplusplus className="text-blue-600" /> },
//   { label: "PHP", value: "php", icon: <SiPhp className="text-purple-600" /> },
//   { label: "Ruby", value: "ruby", icon: <SiRuby className="text-red-600" /> },
//   { label: "Go", value: "golang", icon: <SiGo className="text-blue-500" /> },
//   { label: "R", value: "rlang", icon: <SiR className="text-blue-400" /> },
// ];



// const CustomDropdown = ({ selected, onSelect }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const selectedOption = languageOptions.find((opt) => opt.value === selected);
//   const closeDropDown = useRef(null);

//   useEffect(()=>{
//     const handleClickOutside = (event) => {
//         if (closeDropDown.current && !closeDropDown.current.contains(event.target)) {
//           setIsOpen(false);
//         }
//     }
//     document.addEventListener("mousedown", handleClickOutside);
//     return() =>{
//         document.removeEventListener("mousedown", handleClickOutside);
//     };
    
//   },[]);

//   return (
//     <div className="relative inline-block w-64">
//       {/* Selected Option (Trigger) */}
//       <div ref={closeDropDown}
//         className=" px-4 py-2 rounded-lg cursor-pointer flex justify-between items-center transition-all duration-200"
//         onClick={() => setIsOpen(!isOpen)}
//       >
//         <div className="flex items-center gap-2">
//           {selectedOption?.icon} {selectedOption?.label || "Select Language"}
//         </div>
//         <span className="text-gray-300">{isOpen ? "▲" : "▼"}</span>
//       </div>

//       {/* Dropdown List */}
//       {isOpen && (
//         <div className="absolute w-full bg-gray-900 text-white rounded-lg shadow-md mt-1 z-10 overflow-hidden">
//           {languageOptions.map((option) => (
//             <div
//               key={option.value}
//               className="px-4 py-2 hover:bg-gray-700 cursor-pointer flex items-center gap-2 transition-all duration-200"
//               onClick={() => {
//                 onSelect(option.value);
//                 setIsOpen(false);
//               }}
//             >
//               {option.icon} {option.label}
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default CustomDropdown;

import React, { useRef, useState, useEffect } from "react";
import { 
  SiJavascript, SiPython, SiC, SiCplusplus, SiPhp, 
  SiRuby, SiGo, SiR, SiHtml5, SiCss3 
} from "react-icons/si";
import { FaJava } from "react-icons/fa";
import { TbWorldCode } from "react-icons/tb";

const languageOptions = [
  { label: "Web Development", value: "web", icon: <TbWorldCode className="text-green-500" /> },
  { label: "JavaScript", value: "javascript", icon: <SiJavascript className="text-yellow-400" /> },
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
    <div className="relative inline-block w-64" ref={dropdownRef}>
      {/* Selected Option (Trigger) */}
      <div
        className="px-4 py-2 rounded-lg cursor-pointer flex justify-between items-center transition-all duration-200 bg-gray-800 text-white w-54 h-10"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2">
          {selectedOption?.icon} {selectedOption?.label || "Select Language"}
        </div>
        <span className="text-gray-300">{isOpen ? "▲" : "▼"}</span>
      </div>

      {/* Dropdown List */}
      {isOpen && (
        <div className="absolute w-full bg-gray-900 text-white rounded-lg shadow-md mt-1 z-10 overflow-hidden">
          {languageOptions.map((option) => (
            <div
              key={option.value}
              className="px-4 py-2 hover:bg-gray-700 cursor-pointer flex items-center gap-2 transition-all duration-200"
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
