import { Sun, Moon, Mic, MicOff,Menu,Import} from 'lucide-react'
import { CgExport } from "react-icons/cg";
import { PiButterflyFill,PiFileJs } from "react-icons/pi";
import { MdOutlineSave } from "react-icons/md";
import { BsFiletypeHtml,BsFiletypeCss } from "react-icons/bs";
import { useState } from 'react';

function Theme() {
    const [theme, setTheme] = useState(true);
    const [prompt, setPrompt] = useState(true);
    const [mic, setMic] = useState(false);
    const [selectedLanguge, setLanguage] = useState("js");


    function lang() {
        setLanguage(document.getElementById("language").value);
    }


    if (theme) {
        return (
            <div className="w-screen h-screen grid grid-rows-40 grid-cols-20 p-5 gap-2 bg-gray-100" >
                <div className="row-span-3 col-span-29 grid-cols-22 grid rounded-xl bg-white shadow-neutral-300 shadow-md inset-shadow-sm inset-shadow-neutral-200">
                    <div className="grid-cols-1 w-18 h-18 rounded-full">
                        <img src="https://i.postimg.cc/fbfvCLrQ/p1.png" className='rounded-full 2xl:w-15 2xl:h-15 xl:w-13 xl:h-13 lg:w-12 lg:h-12 md:w-13 md:h-13'></img>
                    </div>

                    <div className='col-span-3 w-56 h-18 p-4 2xl:w-56 2xl:h-10'>
                        <select className='w-55 h-12 p-3 border-gray-400 border rounded-xl hover:border-indigo-400' id="language" onChange={lang}>
                            <option value={"js"}>Web Development</option>
                            <option value={"Java"}>Java</option>
                            <option value={"Python"}>Python</option>
                            <option value={"C++"}>C++</option>
                        </select>

                        

                    </div>
                    <div className='col-span-2 w-40 h-15 p-4'>
                        <button className='w-30 h-12 border-gray-400 border rounded-xl'>Import</button>
                        <Import className='lg:hidden md:block h-15 w-8 '/>
                    </div>
                    <div className='col-span-2 w-40 h-15 p-4'>
                        <button className='w-30 h-12 border-gray-400 border rounded-xl'>Export</button>
                        <CgExport className='lg:hidden md:block h-13 w-8 '/>
                    </div>
                    <div className='col-span-2 w-40 h-15 p-4'>
                        <button className='w-30 h-12 border-gray-400 border rounded-xl'>Beautify</button>
                        <PiButterflyFill className='lg:hidden md:block h-13 w-8 '/>
                    </div>
                    <div className='col-span-7 xl:col-span-6'></div>
                    <div className='col-span-1 p-5 w-17 h-17' onClick={() => setTheme(!theme)}>
                        {theme && <Moon className='w-8 h-8 xl:h-8 xl:w-7' />}

                    </div>
                    <div className='col-span-2 w-40 h-15 p-4'>
                        <button className='w-30 h-12 border-gray-400 border rounded-xl'>Save</button>
                        <MdOutlineSave className='md:block lg:hidden h-13 w-8 '/>
                    </div>
                    <div className='col-span-2 w-45 h-15 p-4' onClick={() => setPrompt(!prompt)}>
                        {prompt &&
                            <button className='w-30 h-12 border-gray-400 border rounded-xl'>Hide Prompt</button>
                        }
                        {!prompt &&
                            <button className='w-30 h-12  border-gray-400 border rounded-xl'>Show Prompt</button>
                        }
                    </div>
                    
                </div>
                {prompt &&
                    <div className='row-span-3 col-span-29 grid-cols-23 grid rounded-2xl bg-white shadow-md shadow-neutral-300'>
                        <div className='col-span-15 p-2 h-18'>
                            <input className='p-2 rounded-xl border-gray-300 border w-6xl h-13' placeholder='Enter your prompt here...'></input>
                        </div>
                        <div className='col-span-3 p-5 w-17 h-17' onClick={() => setMic(!mic)}>
                            {mic && <Mic className='w-8 h-8' />}
                            {!mic && <MicOff className='w-8 h-8' />}

                        </div>
                        <div className='col-span-2 w-40 h-15 p-4'>
                            <button className='w-30 h-12 rounded-xl border-gray-400 border'>Generate</button>
                        </div>
                        <div className='col-span-2 w-40 h-15 p-4'>
                            <button className='w-30 h-12 border-gray-400 border rounded-xl'>Convert</button>
                        </div>
                    </div>
                }

                <div className="row-span-34 col-span-29 p-2 grid grid-cols-2 gap-5">
                    <div className=' inset-shadow-sm inset-shadow-neutral-200 shadow-md shadow-neutral-400 rounded-xl p-4 grid grid-rows-24'>

                        <div className='row-span-2 w-3xl'>

                            {selectedLanguge != "js" ?
                                <div className='grid grid-cols-5 xl:grid-cols-7'>
                                    <p className='bg-gray-200 w-30 h-12 text-center rounded-xl p-3'>{selectedLanguge}</p>
                                    <button className='w-30 h-10 bg-green-600 shadow-md text-white rounded-md '>Run</button>
                                </div> :
                                <div className='grid grid-cols-10 gap-1'>
                                    <button className='w-20 h-10 shadow-md rounded-md col-span-2 bg-gray-200 '>HTML</button>
                                    <button className='lg:hidden md:block w-10 '><BsFiletypeHtml className='w-8 h-8'/></button>
                                    <button className='w-20 h-10 shadow-md rounded-md col-span-2 bg-gray-200 '>CSS</button>
                                    <button className='lg:hidden md:block w-10 '><BsFiletypeCss className='w-8 h-8'/></button>
                                    <button className='w-30 h-10 shadow-md rounded-md col-span-5 bg-gray-200 '>JAVASCRIPT</button>
                                    <button className='lg:hidden md:block w-10 '><PiFileJs className='w-8 h-8'/></button>
                                    <button className='w-30 h-10 bg-green-600 shadow-md text-white rounded-md'>Run</button>
                                </div>
                            }
                        </div>


                        <textarea className='border border-gray-300 rounded-xl p-5 row-span-22' style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }} placeholder='Type your codes here...'></textarea>
                    </div>
                    <div disabled className=' inset-shadow-sm inset-shadow-neutral-200 shadow-md shadow-neutral-400 rounded-xl p-4 grid grid-rows-24'>
                        <div className='row-span-2 w-3xl'>

                            {selectedLanguge != "js" ?
                                <div>
                                    <p className='bg-gray-200 w-30 h-12 text-center rounded-xl p-3'>Console</p>
                                </div> :
                                <div className='grid grid-cols-10 gap-1'>
                                    <button className='w-20 h-10 shadow-md rounded-md col-span-2 bg-gray-200'>Preview</button>
                                    <button className='w-20 h-10 shadow-md rounded-md col-span-2 bg-gray-200'>Console</button>
                                </div>
                            }
                        </div>
                        <textarea className='border border-gray-300 rounded-xl p-5 shadow-md row-span-22' style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }} disabled placeholder='Output will be printed...'></textarea>
                    </div>
                </div>
            </div >
        )
    }
    else {
        return (
            <div className="w-screen h-screen grid grid-rows-40 grid-cols-20 p-5 gap-2 bg-gray-100" id="wholeDiv">
                <div className="row-span-3 col-span-29 grid-cols-22 grid rounded-xl bg-white shadow-neutral-300 shadow-md inset-shadow-sm inset-shadow-neutral-200" id='textArea'>
                    <div className="grid-cols-1 w-18 h-18 rounded-full">
                        <img src="https://i.postimg.cc/fbfvCLrQ/p1.png" className='rounded-full'></img>
                    </div>

                    <div className='col-span-3 w-56 h-18 p-4'>
                        <select className='w-55 h-12 p-3 border-gray-300 border rounded-xl hover:border-indigo-400 text-white' id="language" onChange={lang}>
                            <option value={"js"} className='text-black'>Web Development</option>
                            <option value={"java"} className='text-black'>Java</option>
                            <option value={"python"} className='text-black'>Python</option>
                            <option value={"c++"} className='text-black'>C++</option>
                        </select>
                    </div>
                    <div className='col-span-2 w-40 h-15 p-4'>
                        <button className='w-30 h-12 border-gray-400 border rounded-xl text-white'>Import</button>
                        <Import className='lg:hidden md:block h-15 w-8 text-white'/>
                    </div>
                    <div className='col-span-2 w-40 h-15 p-4'>
                        <button className='w-30 h-12 border-gray-400 border rounded-xl text-white'>Export</button>
                        <CgExport className='lg:hidden md:block h-13 w-8 text-white'/>
                    </div>
                    <div className='col-span-2 w-40 h-15 p-4'>
                        <button className='w-30 h-12 rounded-xl border-gray-400 border text-white'>Beautify</button>
                        <PiButterflyFill className='lg:hidden md:block h-13 w-8 text-white'/>
                    </div>
                    <div className='col-span-7'></div>
                    <div className='col-span-1 p-5 w-17 h-17' onClick={() => setTheme(!theme)}>
                        {!theme && <Sun className='w-8 h-8 xl:h-8 text-white' />}

                    </div>
                    <div className='col-span-2 w-40 h-15 p-4 '>
                        <button className='w-30 h-12 border-gray-400 border rounded-xl text-white '>Save</button>
                        <MdOutlineSave className='md:block lg:hidden h-13 w-8 text-white'/>
                    </div>
                    <div className='col-span-2 w-45 h-15 p-4 text-white' onClick={() => setPrompt(!prompt)}>
                        {prompt &&
                            <button className='w-30 h-12  border-gray-400 border rounded-xl'>Hide Prompt</button>
                        }
                        {!prompt &&
                            <button className='w-30 h-12  border-gray-400 border rounded-xl'>Show Prompt</button>
                        }
                    </div>
                </div>
                {prompt &&
                    <div className='row-span-3 col-span-29 grid-cols-23 grid rounded-2xl bg-white shadow-md shadow-neutral-300' id='textArea'>
                        <div className='col-span-15 p-2 h-18'>
                            <input className='p-2 rounded-xl border-gray-300 border w-6xl h-13' id='promptTag' placeholder='Enter your prompt here...'></input>
                        </div>
                        <div className='col-span-3 p-5 w-17 h-17 2xl:13 ' onClick={() => setMic(!mic)}>
                            {mic && <Mic className='w-8 h-8 text-white' />}
                            {!mic && <MicOff className='w-8 h-8 text-white' />}

                        </div>
                        <div className='col-span-2 w-40 h-15 p-4 '>
                            <button className='w-30 h-12 rounded-xl border-gray-400 border text-white'>Generate</button>
                        </div>
                        <div className='col-span-2 w-40 h-15 p-4'>
                            <button className='w-30 h-12 border-gray-400 border rounded-xl text-white'>Convert</button>
                        </div>
                    </div>
                }

                <div className="row-span-34 col-span-29 p-2 grid grid-cols-2 gap-5">
                    <div className=' inset-shadow-sm inset-shadow-neutral-200 shadow-md shadow-neutral-400 rounded-xl p-4 grid grid-rows-24' id='textArea'>

                        <div className='row-span-2 w-3xl'>

                            {selectedLanguge != "js" ?
                                <div className='grid grid-cols-5'>
                                    <p className='bg-gray-200 w-30 h-12 text-center rounded-xl p-3 '>{selectedLanguge}</p>
                                    <button className='w-30 h-10 bg-green-600 shadow-md text-white rounded-md'>Run</button>
                                </div> :
                                <div className='grid grid-cols-10 gap-1 2xl:gap-0 xl:grid-cols-14 lg:grid-cols-18'>
                                    <button className='w-20 h-10 shadow-md rounded-md col-span-2 bg-gray-200 '>HTML</button>
                                    <button className='lg:hidden md:block w-10 md:col-span-1'><BsFiletypeHtml className='w-8 h-8 text-white'/></button>
                                    <button className='w-20 h-10 shadow-md rounded-md col-span-2 bg-gray-200 '>CSS</button>
                                    <button className='lg:hidden md:block w-10 md:col-span-1'><BsFiletypeCss className='w-8 h-8 text-white'/></button>
                                    <button className='w-30 h-10 shadow-md rounded-md col-span-5 bg-gray-200 '>JAVASCRIPT</button>
                                    <button className='lg:hidden md:block w-10 md:col-span-6'><PiFileJs className='w-8 h-8 text-white'/></button>
                                    <button className='w-30 h-10 bg-green-600 shadow-md text-white rounded-md'>Run</button>
                                </div>
                            }
                        </div>


                        <textarea className='border border-gray-300 rounded-xl p-5 row-span-22 text-white ' id='input' style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }} placeholder='Type your codes here...'></textarea>
                    </div>
                    <div disabled className=' inset-shadow-sm inset-shadow-neutral-200 shadow-md shadow-neutral-400 rounded-xl p-4 grid grid-rows-24' id='textArea'>
                        <div className='row-span-2 w-3xl '>

                            {selectedLanguge != "js" ?
                                <div>
                                    <p className='bg-gray-200 w-30 h-12 text-center rounded-xl p-3 '>Console</p>
                                </div> :
                                <div className='grid grid-cols-10 gap-1 '>
                                    <button className='w-20 h-10 shadow-md rounded-md col-span-2 bg-gray-200 '>Preview</button>
                                    <button className='w-20 h-10 shadow-md rounded-md col-span-2 bg-gray-200 '>Console</button>
                                </div>
                            }
                        </div>
                        <textarea className='border border-gray-300 rounded-xl p-5 shadow-md row-span-22 text-white ' id='input' style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }} disabled placeholder='Output will be printed...'></textarea>
                    </div>
                </div>
            </div >
        )
    }

}

export default Theme


