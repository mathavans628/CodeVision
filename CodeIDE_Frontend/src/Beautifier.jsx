import CodeEditor from "./CodeEditor";

    const Beautifier = async () => {
        console.log("beautifier Function")
        try {
            const response = await fetch("http://localhost:8080/CodeVision/CodeBeautifyServlet", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams({ codes, codeLang }),
            });
            if (response.ok) {
                const data = await response.text();
                setCode(data);
            } else {
                console.log("Error Status: ", response.status);
            }
            return(
                <CodeEditor/>
            )
    
        }
        catch (error) {
            console.log("Failed to fetch")
        }
    }


export default Beautifier;