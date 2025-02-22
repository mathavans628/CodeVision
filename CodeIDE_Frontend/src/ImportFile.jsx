import { Component } from "lucide-react";

class ImportFile extends Component()
{
    constructor(props) {
        super(props);
        this.state = {
            fileName: "",
            fileContent: ""
        };
    }

    handleFile = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();

        if (file) {
            reader.readAsText(file);
            reader.onload = () => {
                this.setState({
                    fileName: file.name,
                    fileContent: reader.result
                });
            };
            reader.onerror = (error) => {
                console.log("File reading error: ", error);
            };
        }
    };

    render() {
        return (
            <div className="p-4 bg-gray-900 text-white rounded-lg w-full max-w-md mx-auto mt-4">
                <h2 className="text-xl mb-4">Import and Read File</h2>
                <input
                    type="file"
                    onChange={this.handleFile}
                    className="block w-full text-sm text-gray-300 bg-gray-800 rounded-lg border border-gray-700 cursor-pointer"
                />
                <div className="mt-4">
                    <p><strong>File Name:</strong> {this.state.fileName || "No file selected"}</p>
                    <p className="mt-2 whitespace-pre-wrap"><strong>File Content:</strong> {this.state.fileContent || "No content yet"}</p>
                </div>
            </div>
        );
    }
}