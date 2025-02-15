import { useState} from "react";
import { Sun, Moon, User, Mic, MicOff} from 'lucide-react';
import EditProfile from "./EditProfile";


function MainPage() {
    const [viewProfie, setProfile] = useState(false);
    const [theme, setTheme] = useState(false);
    const [editProfile, setEditProfile] = useState(false);
    const [showPrompt, setPrompt] = useState(true);
    const [showPromptProfile, setPromptProfile] = useState(true);
    const[mic,setMic] = useState(false);
    const[mic1,setMic1] = useState(false);


    return (
        <div className="p-2 border w-screen h-screen grid grid-cols-30 grid-rows-16 bg-blue-50">
            <div className="bg-blue-600 w-17 p-1.5">
            <div className="w-13 h-13 rounded-4xl p-1.5 col-span-1 row-span-1 bg-white">
                <User className="w-10 h-10" onClick={() => setProfile(!viewProfie)} />
            </div>
            </div>
            
            {viewProfie && <div className="col-span-3 row-span-1 pt-5 text-center bg-blue-600">
                {viewProfie && <p className="text-white">User Name</p>}
            </div>
            }
            {viewProfie &&

                <div className="row-span-1 col-span-26 border p-2.5 grid grid-cols-12 bg-white">
                    <div className="col-span-1">

                        <div className="w-10 h-10 p-1.5" onClick={() => setTheme(!theme)}>
                            {!theme &&
                                <Sun />
                            }
                            {theme &&
                                <Moon />
                            }
                        </div>


                    </div>
                    <select className="col-span-2 border w-31 h-11 p-1 rounded-xl  shadow-neutral-400 shadow-md">
                        <option value="js">JavaScript</option>
                        <option value="java">Java</option>
                        <option value="python">Python</option>
                        <option value="c++">C++</option>
                    </select>
                    <button className="col-span-2  w-31 h-11 p-1 rounded-xl border  shadow-neutral-400 shadow-md">Import</button>
                    <button className="col-span-2  w-31 h-11 p-1 rounded-xl border  shadow-neutral-400 shadow-md">Export</button>
                    <button className="col-span-2  w-31 h-11 p-1 rounded-xl border  shadow-neutral-400 shadow-md">Beautify</button>
                    <button className="col-span-2  w-31 h-11 p-1 rounded-xl border bg-red-500 text-white  shadow-neutral-400 shadow-md">Save</button>
                    <button className="col-span-1  w-31 h-11 p-1 rounded-xl border  shadow-neutral-400 shadow-md" onClick={() => setPromptProfile(!showPromptProfile)}>
                    {showPromptProfile &&
                            <p>Hide Prompt</p>
                        }
                        {!showPromptProfile &&
                            <p>Show Prompt</p>
                        }
                    </button>
                </div>
            }
            {!viewProfie &&
                <div className="row-span-1 col-span-29 border p-2.5 grid grid-cols-11 rounded-xl ml-6 bg-white">
                    <div className="col-span-1">

                        <div className="w-10 h-10 p-1.5" onClick={() => setTheme(!theme)}>
                            {!theme &&
                                <Sun />
                            }
                            {theme &&
                                <Moon />
                            }
                        </div>


                    </div>
                    <select className="col-span-2 border w-31 h-11 p-1 rounded-xl" id="language" onClick={console.log(document.getElementById("language"))}>
                        <option value="js">JavaScript</option>
                        <option value="java">Java</option>
                        <option value="python">Python</option>
                        <option value="c++">C++</option>
                    </select>
                    <button className="col-span-2  w-31 h-11 p-1 rounded-xl border  shadow-neutral-400 shadow-md">Import</button>
                    <button className="col-span-2  w-31 h-11 p-1 rounded-xl border  shadow-neutral-400 shadow-md">Export</button>
                    <button className="col-span-2  w-31 h-11 p-1 rounded-xl border  shadow-neutral-400 shadow-md ">Beautify</button>
                    <button className="col-span-1  w-31 h-11 p-1 rounded-xl border bg-red-500 text-white  shadow-neutral-400 shadow-md ">Save</button>
                    <button className="col-span-1  w-31 h-11 p-1 rounded-xl border  shadow-neutral-400 shadow-md" onClick={() => setPrompt(!showPrompt)}>
                        {showPrompt &&
                            // <Eye/>
                            <p>Hide Prompt</p>
                        }
                        {!showPrompt &&
                        //    <EyeOff/>
                        <p>Show Prompt</p>
                        }
                        </button>
                </div>}
            {viewProfie &&
                <>
                    <div className="row-span-15 col-span-4 border p-2">
                        <button onClick={() => setEditProfile(!editProfile)} className="w-35 h-12 border rounded-xl bg-blue-500 text-white  shadow-neutral-400 shadow-md">Edit Profile</button>
                        {editProfile && <EditProfile></EditProfile>}

                    </div>
                    <div className="border row-span-15 col-span-26 p-2 grid grid-rows-13">
                        {showPromptProfile &&
                            <div className="row-span-1 border p-2 grid grid-cols-11 gap-3">
                                <input className="col-span-7 border rounded-xl p-2 h-13  shadow-neutral-400 shadow-md" placeholder="Enter your prompt here..."></input>
                                <div className="col-span-1 w-13 h-13 rounded-xl shadow-2xl bg-gray-300 p-2.5" onClick={()=> setMic1(!mic1)}>
                                {!mic1 && <MicOff className="w-8 h-8" />}
                                {mic1 && <Mic className="w-8 h-8 rounded-full" />}
                                </div>
                                <button className="col-span-1 w-30 h-12 rounded-xl border  shadow-neutral-400 shadow-md">Generate</button>
                            </div>
                        }

                        <div className="border grid grid-cols-16 w-10xl h-13 p-1">
                            <button className="ml-5 w-30 h-10 rounded-xl bg-gray-200 text-center pt-1.5 col-span-6  shadow-neutral-400 shadow-md">Input</button>
                            <button className="ml-5 col-span-2 w-30 h-10 rounded-xl border bg-green-600 text-white shadow-neutral-400 shadow-md">Run</button>
                            <button className="ml-5 w-30 h-10 rounded-xl bg-gray-200 text-center pt-1.5 col-span-3  shadow-neutral-400 shadow-md">Output</button>
                            <button className="col-span-3 border rounded-xl w-30 h-10  shadow-neutral-400 shadow-md">Convert</button>
                            
                        </div>
                        <div className="row-span-11 grid grid-cols-2 p-2 rounded-xl gap-2">
                            <textarea className="border rounded-xl p-3 bg-gray-50 shadow-neutral-400 shadow-2xl" placeholder="Type your code here..."></textarea>
                            <div className="border rounded-xl bg-gray-50 shadow-neutral-400 shadow-2xl"></div>
                        </div>
                    </div>

                </>
            }
            {!viewProfie &&
                <div className="row-span-16 col-span-30 grid grid-rows-13 grid-cols-12 ">

                    {showPrompt &&
                    
                        <div className="row-span-1 col-span-12 grid grid-cols-22 p-2 gap-8 rounded-xl">
                            <div className="col-span-1"></div>
                            <input className="col-span-14 border rounded-xl p-2 h-13  shadow-neutral-400 shadow-md" placeholder="Enter your prompt here..."></input>
                            <div className="col-span-1 w-13 h-13 rounded-xl bg-gray-300 p-2.5  shadow-neutral-400 shadow-md" onClick={()=>setMic(!mic)}>
                                {!mic && <MicOff className="w-8 h-8" />}
                                {mic && <Mic className="w-8 h-8" />}
                            </div>
                            <button className="col-span-1 w-30 h-12 rounded-xl border shadow-neutral-400 shadow-md">Generate</button>
                        </div>
                    }

                    <div className="mt-3 col-span-12 grid grid-cols-17 w-8xl h-13 p-1 content-center">
                        <p className="col-span-1"></p>
                        <button className=" w-30 h-10 rounded-xl bg-gray-200 text-center pt-1 col-span-6  shadow-neutral-400 shadow-md">Input</button>
                        <button className="col-span-2 w-30 h-10 rounded-xl border bg-green-600 text-white  shadow-neutral-400 shadow-md">Run</button>
                        <button className=" w-30 h-10 rounded-xl bg-gray-200 text-center pt-1.5 col-span-3  shadow-neutral-400 shadow-md">Output</button>
                        <button className="col-span-3 border rounded-xl w-30 h-10  shadow-neutral-400 shadow-md">Convert</button>
                        
                    </div>
                    <div className="row-span-15 col-span-12 grid grid-cols-34 p-2 rounded-xl gap-5"> style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }} 
                        <div className="col-span-1"></div>
                        <textarea className="col-span-16 rounded-xl p-5 overflow-auto bg-gray-50 shadow-neutral-400 shadow-2xl" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }} placeholder="Type your code here..."></textarea>
                        <div className="col-span-16 rounded-xl p-3 overflow-auto bg-gray-50 shadow-neutral-400 shadow-2xl" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }} ></div>
                        <div className="col-span-1"></div>
                    </div>
                </div>
            }




        </div>
    )
}



export default MainPage