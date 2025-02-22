import React from "react";

const FileReaderComponent = ({ onFileRead, triggerId }) => {
  // Function to handle file input and return content
  const handleFile = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    if (file) {
      reader.readAsText(file);
      reader.onload = () => {
        const content = reader.result; // Get file content
        onFileRead(content); // Pass content back to parent
      };
      reader.onerror = (error) => {
        console.error("Error reading file:", error);
      };
    }
  };

  return (
    <input
      type="file"
      accept=".txt"
      onChange={handleFile}
      className="hidden"
      id={triggerId} // Attach input to the label via ID
    />
  );
};

export default FileReaderComponent;