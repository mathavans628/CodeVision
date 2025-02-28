import React from "react";
import CustomDropdown from "./CustomDropdown";
import CodeIDE_Main from "./CodeIDE_Main";

const FileReaderComponent = ({ onFileRead, triggerId }) => {
  var fileName = "";
  var lang = "";
    const handleFile = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        fileName = file.name;
    
        if (file) {
          
          reader.readAsText(file);
          reader.onload = () => {
            const content = reader.result;
            console.log(fileName);
            changeDropDownByFile();
            if(lang == "")
            {
              return;
            }
            
            onFileRead(content,fileName,lang);
          };
          reader.onerror = (error) => {
            console.error("Error reading file:", error);
          };
        }
      };

      const changeDropDownByFile = () =>{
        console.log("File Name: ",fileName)
        console.log("Inside");
        console.log(fileName.includes(".r"))
        
        if (fileName.endsWith(".js")) {
                lang = "javascript";
        }
        else if (fileName.endsWith(".java")) {
                lang = "java";
        }
        else if (fileName.endsWith(".py")) {
            lang = "python3";
        }
        else if (fileName.endsWith(".c")) {
                lang = "c";
        }
        else if (fileName.endsWith(".cpp")) {
            lang = "cpp";
        }
        else if (fileName.endsWith(".rb")) {
            lang = "ruby";
        }
        else if (fileName.endsWith(".go")) {
            lang = "golang";
        }
        else if (fileName.endsWith(".r")) {
                lang = "rlang";
        }
        else if (fileName.endsWith(".php")) {
            lang = "php";
        }
        else{
          return;
        }
    }
    
      return (
        <>
        <input
          type="file"
          accept=".js,.java,.php,.c,.cpp,.rb,.py,.go,.r"
          onChange={handleFile}
          className="hidden"
          id={triggerId} 

        />
        </>
        
      );
};

export default FileReaderComponent;