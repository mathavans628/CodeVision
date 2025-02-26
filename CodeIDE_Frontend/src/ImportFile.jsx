import React from "react";

const FileReaderComponent = ({ onFileRead, triggerId }) => {
    const handleFile = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
    
        if (file) {
          
          reader.readAsText(file);
          reader.onload = () => {
            const content = reader.result;
            onFileRead(content,file.name);
          };
          reader.onerror = (error) => {
            console.error("Error reading file:", error);
          };
        }
      };
    
      return (
        <input
          type="file"
          onChange={handleFile}
          className="hidden"
          id={triggerId} 
        />
      );
};

export default FileReaderComponent;