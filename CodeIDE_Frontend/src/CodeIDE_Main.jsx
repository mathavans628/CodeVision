import { Sun, Moon, Mic, MicOff, Menu, Import } from 'lucide-react'
import { CgExport } from "react-icons/cg";
import { PiButterflyFill, PiFileJs } from "react-icons/pi";
import { MdOutlineSave } from "react-icons/md";
import { BsFiletypeHtml, BsFiletypeCss } from "react-icons/bs";
import { RiAiGenerate2 } from "react-icons/ri";
import { SiConvertio } from "react-icons/si";
import { useState } from 'react';

function CodeIDE_Main() {
    const [theme, setTheme] = useState(true);
    const [prompt, setPrompt] = useState(true);
    const [mic, setMic] = useState(false);
    const [selectedLanguge, setLanguage] = useState("js");


    function lang() {
        setLanguage(document.getElementById("language").value);
    }


    if (theme) {
        return (
            <div className="w-screen h-screen grid grid-rows-40 grid-cols-20 p-5 gap-2 bg-gray-100 2xl:max-2xl:h-screen 2xl:max-2xl:overflow-hidden xl:max-2xl:w-screen xl:max-2xl:h-screen xl:max-2xl:overflow-hidden lg:max-xl:w-screen lg:max-xl:h-screen lg:max-xl:overflow-hidden  md:max-lg:w-screen  md:max-lg:h-screen md:max-lg:overflow-x-hidden md:max-lg:overflow-y-scroll sm:max-md:overflow-x-hidden" >
                <div className="row-span-3 col-span-29 grid-cols-22 grid rounded-xl bg-white shadow-neutral-300 shadow-md inset-shadow-sm inset-shadow-neutral-200 lg:max-xl:grid-cols-35 md:max-lg:grid-cols-12 md:max-lg:h-17">
                    <div className="grid-cols-1 w-18 h-18 rounded-full2xl:max-2xl:15 2xl:max-2xl:h-15 xl:max-2xl:h-13 xl:max-2xl:p-1 lg:max-xl:h-13 lg:max-xl:p-1 lg:max-xl:col-span-2 md:max-lg:p-1.5 md:max-lg:col-span-1 sm:max-md:p-1.5  sm:max-md:col-span-2">
                        <img src="https://i.postimg.cc/fbfvCLrQ/p1.png" className='rounded-full 2xl:max-2xl:w-15 2xl:max-2xl:h-15 xl:max-2xl:w-13 xl:max-2xl:h-13 lg:max-xl:w-12 lg:max-xl:h-12 md:max-lg:w-13 md:max-lg:h-13 sm:max-md:h-12 sm:max-md:w-12'></img>
                    </div>

                    <div className='col-span-3 w-56 h-18 p-4 2xl:max-2xl:w-56 2xl:max-2xl:h-10 2xl:max-2xl:p-2.5 xl:max-2xl:h-8 xl:max-2xl:p-3 lg:max-xl:p-2.5 lg:max-xl:col-span-6 md:max-lg:p-2.5 md:max-lg:col-span-4 sm:max-md:p-2 sm:max-md:col-span-7'>
                        <select className='w-55 h-12 p-3 border-gray-400 border rounded-xl 2xl:max-2xl:h-10 2xl:max-2xl:p-0.5 2xl:max-2xl:pl-2 xl:max-2xl:h-9 xl:max-2xl:p-1.5 xl:max-2xl:w-45 lg:max-xl:h-10 lg:p-1 lg:w-44 md:max-lg:h-10 md:max-lg:w-48 md:max-lg:p-1 sm:max-md:h-10 sm:max-md:p-0 sm:max-md:w-40 cursor-pointer' id="language" onChange={lang}>
                            <option value={"js"}>Web Development</option>
                            <option value={"Java"}>Java</option>
                            <option value={"Python"}>Python</option>
                            <option value={"C++"}>C++</option>
                        </select>



                    </div>
                    <div className='col-span-2 w-40 h-15 p-4 2xl:max-2xl:p-2.5 2xl:max-2xl:ml-3 xl:max-2xl:p-3 lg:max-xl:p-3 lg:max-xl:ml-4 lg:max-xl:col-span-4 md:max-lg:col-span-1 md:max-lg:p-0.5 sm:max-md:p-0'>
                        <label className='w-30 h-12 border-gray-400 border rounded-xl 2xl:max-2xl:h-10 xl:max-2xl:h-9 xl:max-2xl:ml-5 xl:max-2xl:w-25  lg:max-xl:h-9 lg:max-xl:w-25 sm:max-lg:hidden block text-center p-2.5 cursor-pointer hover:shadow-2xs hover:border-indigo-400' id='buttons'>Import
                            <input type='file' className='hidden' accept='.txt'></input> 
                        </label>
                        <label>
                            <Import className='lg:hidden md:max-lg:block h-15 w-8 cursor-pointer'/>
                            <input type='file' className='hidden' accept='.txt'></input> 
                        </label>
                    </div>
                    <div className='col-span-2 w-40 h-15 p-4 2xl:max-2xl:p-2.5 2xl:max-2xl:ml-3 xl:max-2xl:p-3 lg:max-xl:p-3 lg:max-xl:ml-4 lg:max-xl:col-span-4 md:max-lg:col-span-1 md:max-lg:p-0.5 sm:max-md:p-0'>
                        <button className='w-30 h-12 border-gray-400 border rounded-xl 2xl:max-2xl:h-10 xl:max-2xl:h-9 xl:max-2xl:ml-5 xl:max-2xl:w-25  lg:max-xl:h-9 lg:max-xl:w-25 sm:max-lg:hidden block cursor-pointer' id='buttons'>Export</button>
                        <CgExport className='lg:hidden md:max-lg:block h-13 w-8 cursor-pointer' />
                    </div>
                    <div className='col-span-2 w-40 h-15 p-4 2xl:max-2xl:p-2.5 2xl:max-2xl:ml-3 lg:max-xl:p-3 xl:max-2xl:p-3 lg:max-xl:ml-4 md:max-lg:col-span-1 md:max-lg:p-0.5 sm:max-md:p-0'>
                        <button className='w-30 h-12 border-gray-400 border rounded-xl 2xl:max-2xl:h-10 xl:max-2xl:h-9 xl:max-2xl:ml-5 xl:max-2xl:w-25  lg:max-xl:h-9 lg:max-xl:w-25 sm:max-lg:hidden block cursor-pointer' id="buttons">Beautify</button>
                        <PiButterflyFill className='lg:hidden md:max-lg:block h-13 w-8 cursor-pointer' />
                    </div>
                    <div className='col-span-7 xl:max-2xl:col-span-6 md:max-lg:col-span-2  sm:max-md:col-span-3'></div>
                    <div className='col-span-1 p-5 w-17 h-17 2xl:max-2xl:h-10 2xl:max-2xl:p-3 xl:max-2xl:p-3 xl:max-2xl:h-8 lg:max-xl:p-3 md:max-lg:p-4 md:max-lg:col-span-1 sm:max-md:p-2.5  sm:max-md:col-span-2' onClick={() => setTheme(!theme)}>
                        {theme && <Moon className='w-8 h-8 xl:max-2xl:h-8 xl:max-2xl:w-7 md:max-lg:max-lg:h-7 md:max-lg:max-lg:w-7 cursor-pointer' />}

                    </div>
                    <div className='col-span-2 w-40 h-15 p-4 2xl:max-2xl:p-2.5 lg:max-xl:col-span-4 lg:max-xl:ml-4 lg:max-xl:p-3 md:max-lg:col-span-1 md:max-lg:p-0.5  sm:max-md:p-0'>
                        <button className='w-30 h-12 border-gray-400 border rounded-xl 2xl:max-2xl:h-10 xl:max-2xl:w-25 xl:max-2xl:h-9  lg:max-xl:h-9 lg:max-xl:w-25 sm:max-lg:hidden block cursor-pointer'id='buttons'>Save</button>
                        <MdOutlineSave className='md:max-lg:block lg:hidden h-13 w-8 cursor-pointer' />
                    </div>
                    <div className='col-span-2 w-45 h-15 p-4 2xl:max-2xl:p-2.5 lg:max-xl:ml-4 lg:max-xl:p-3 lg:max-xl:col-span-3 sm:max-lg:hidden block' onClick={() => setPrompt(!prompt)}>
                        {prompt &&
                            <button className='w-30 h-12 border-gray-400 border rounded-xl 2xl:max-2xl:h-10 xl:max-2xl:w-29 xl:max-2xl:h-9 lg:max-xl:h-9 lg:max-xl:w-25 cursor-pointer' id='buttons'>Hide Prompt</button>
                        }
                        {!prompt &&
                            <button className='w-30 h-12  border-gray-400 border rounded-xl 2xl:max-2xl:h-10 xl:max-2xl:w-29 xl:max-2xl:h-9  lg:max-xl:h-9 lg:max-xl:w-25 cursor-pointer' id='buttons'>Show Prompt</button>
                        }
                    </div>

                </div>
                {prompt &&
                    <div className='row-span-3 col-span-29 grid-cols-23 grid rounded-2xl bg-white shadow-md shadow-neutral-300 md:max-lg:p-1.5 md:max-lg:h-18 md:max-lg:mt-2'>
                        <div className='col-span-15 p-2 h-18 2xl:max-2xl:h-15 lg:max-xl:col-span-14 md:max-lg:col-span-8 sm:max-md:col-span-13'>
                            <input className='p-2 rounded-xl border-gray-300 border w-6xl h-13 2xl:max-2xl:h-10 2xl:max-2xl:w-5xl xl:max-2xl:h-10 xl:max-2xl:w-3xl lg:max-xl:h-10 lg:max-xl:w-xl md:max-lg:h-10 md:max-lg:w-3xs sm:max-md:w-xs sm:max-md:h-10' placeholder='Enter your prompt here...'></input>
                        </div>
                        <div className='col-span-3 p-5 w-17 h-17 2xl:max-2xl:13 2xl:max-2xl:p-2.5 xl:max-2xl:p-3 xl:max-2xl:col-span-2 lg:max-xl:p-2.5 md:max-lg:p-2.5 md:max-lg:col-span-8 sm:max-md:p-3.5 sm:max-md:col-span-6' onClick={() => setMic(!mic)}>
                            {mic && <Mic className='w-8 h-8 xl:max-2xl:h-7 md:max-lg:w-7 md:max-lg:h-7 sm:max-md:h-7 sm:max-md:w-7 cursor-pointer' />}
                            {!mic && <MicOff className='w-8 h-8 xl:max-2xl:h-7 md:max-lg:w-7 md:max-lg:h-7 sm:max-md:h-7 sm:max-md:w-7 cursor-pointer' />}

                        </div>
                        <div className='col-span-2 w-40 h-15 p-4 2xl:max-2xl:p-2.5 xl:max-2xl:p-2 lg:max-xl:col-span-3 lg:max-xl:p-3 md:max-lg:p-2 md:max-lg:col-span-4 sm:max-md:p-1'>
                            <button className='w-30 h-12 rounded-xl border-gray-400 border 2xl:max-2xl:h-10 xl:max-2xl:h-10 lg:max-xl:h-9 lg:max-xl:w-25 md:max-lg:w-23 md:max-lg:h-10 sm:max-md:hidden block cursor-pointer' id='buttons'>Generate</button>
                            <RiAiGenerate2 className='sm:max-md:block md:hidden h-13 w-8 cursor-pointer' />
                        </div>
                        <div className='col-span-2 w-40 h-15 p-4 2xl:max-2xl:p-2.5 xl:max-2xl:p-2 xl:max-2xl:ml-7 lg:max-xl:p-3 md:max-lg:p-2 sm:max-md:p-1'>
                            <button className='w-30 h-12 border-gray-400 border rounded-xl 2xl:max-2xl:h-10 xl:max-2xl:h-10 lg:max-xl:h-9 lg:max-xl:w-25 md:max-lg:w-23 md:max-lg:h-10 sm:max-md:hidden block cursor-pointer' id='buttons'>Convert</button>
                            <SiConvertio className='sm:max-md:block md:hidden h-13 w-7 cursor-pointer'/>
                        </div>
                    </div>
                }

                <div className="row-span-34 col-span-29 p-2 grid grid-cols-2 gap-5 sm:max-lg:grid-cols-1 md:max-lg:mt-2">
                    <div className='inset-shadow-sm inset-shadow-neutral-200 shadow-md shadow-neutral-400 rounded-xl p-4 grid grid-rows-24 2xl:p-2.5 2xl:grid-cols-15 md:max-lg:grid-rows-28 md:max-lg:gap-1 md:max-lg:p-4 '>

                        <div className='row-span-2 w-3xl md:max-lg:row-span-3'>

                            {selectedLanguge != "js" ?
                                <div className='grid grid-cols-10 xl:max-2xl:grid-cols-7 md:max-lg:grid-cols-12 md:max-lg:p-0.5 sm:max-md:grid-cols-13'>
                                    <p className='bg-gray-200 w-30 h-12 col-span-9 text-center rounded-xl p-3 xl:max-2xl:col-span-4 lg:max-xl:col-span-2 md:max-lg:col-span-9 md:max-lg:h-11 md:max-lg:rounded-md sm:max-md:col-span-7'>{selectedLanguge}</p>
                                    <button className='w-30 h-10 bg-green-600 shadow-md rounded-md cursor-pointer text-white'>Run</button>
                                </div> :
                                <div className='grid grid-cols-10 gap-1 2xl:max-2xl:gap-0 xl:max-2xl:grid-cols-14 lg:max-xl:grid-cols-18 md:max-lg:grid-cols-12 sm:max-md:grid-cols-16 sm:max-lg:h-12'>
                                    <button className='w-20 h-10 shadow-md rounded-md col-span-2 bg-gray-200 lg:max-xl:w-16 lg:max-xl:col-span-2 sm:max-lg:hidden block cursor-pointer'>HTML</button>
                                    <button className='hidden sm:max-lg:block w-10 md:max-lg:col-span-1'><BsFiletypeHtml className='w-8 h-8 cursor-pointer' /></button>
                                    <button className='w-20 h-10 shadow-md rounded-md col-span-2 bg-gray-200 lg:max-xl:w-16 lg:max-xl:col-span-2 sm:max-lg:hidden block cursor-pointer'>CSS</button>
                                    <button className='hidden sm:max-lg:block w-10 md:max-lg:col-span-1'><BsFiletypeCss className='w-8 h-8 cursor-pointer' /></button>
                                    <button className='w-30 h-10 shadow-md rounded-md col-span-5 bg-gray-200 2xl:max-2xl:col-span-4 xl:max-2xl:col-span-4 lg:max-xl:col-span-4 lg:max-xl:w-27 sm:max-lg:hidden block cursor-pointer'>JAVASCRIPT</button>
                                    <button className='hidden sm:max-lg:block w-10 md:max-lg:col-span-7 sm:max-md:col-span-7'><PiFileJs className='w-8 h-8 cursor-pointer' /></button>
                                    <button className='w-30 h-10 bg-green-600 shadow-md rounded-md lg:max-xl:w-23 cursor-pointer text-white'>Run</button>
                                </div>
                            }
                        </div>


                        <textarea className='border border-gray-300 rounded-xl p-5 row-span-22 col-span-20 2xl:max-2xl:col-span-15 xl:max-2xl:w-xl lg:max-xl:w-110 md:max-lg:w-2xl md:max-lg:row-span-25 md:max-lg:mt-1.5 sm:max-md:mt-2.5 sm:max-md:w-140'  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }} placeholder='Type your codes here...'></textarea>
                    </div>
                    <div disabled className=' inset-shadow-sm inset-shadow-neutral-200 shadow-md shadow-neutral-400 rounded-xl p-4 grid grid-rows-24 2xl:max-2xl:p-2.5 2xl:max-2xl:grid-cols-15 md:max-lg:grid-rows-28 md:max-lg:gap-1'>
                        <div className='row-span-2 w-3xl md:max-lg:row-span-3'>

                            {selectedLanguge != "js" ?
                                <div>
                                    <p className='bg-gray-200 w-30 h-12 text-center rounded-xl p-3 md:max-lg:h-11 md:max-lg:rounded-md md:max-lg:mb-2'>Console</p>
                                </div> :
                                <div className='grid grid-cols-10 gap-1 md:max-lg:p-1 sm:max-lg:h-12'>
                                    <button className='w-20 h-10 shadow-md rounded-md col-span-2 bg-gray-200 md:max-lg:h-10 md:max-lg:w-20 cursor-pointer'>Preview</button>
                                    <button className='w-20 h-10 shadow-md rounded-md col-span-2 bg-gray-200 md:max-lg:h-10 md:max-lg:w-20 cursor-pointer'>Console</button>
                                </div>
                            }
                        </div>
                        <textarea className='border border-gray-300 rounded-xl p-5 shadow-md row-span-22 2xl:max-2xl:col-span-15 xl:max-2xl:w-xl lg:max-xl:w-110 md:max-lg:w-2xl md:max-lg:row-span-25 sm:max-md:mt-2.5 sm:max-md:w-140' style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }} disabled placeholder='Output will be printed...'></textarea>
                    </div>
                </div>
            </div >
        )
    }
    else {
        return (
            <div className="w-screen h-screen grid grid-rows-40 grid-cols-20 p-5 gap-2 bg-gray-100 2xl:max-2xl:w-screen 2xl:max-2xl:h-screen 2xl:max-2xl:overflow-hidden xl:max-2xl:w-screen xl:max-2xl:h-screen xl:max-2xl:overflow-hidden lg:max-xl:w-screen lg:max-xl:h-screen lg:max-xl:overflow-hidden  md:max-lg:w-screen md:max-lg:h-screen md:max-lg:overflow-x-hidden sm:max-md:overflow-x-hidden" id="wholeDiv">
                <div className="row-span-3 col-span-29 grid-cols-22 grid rounded-xl bg-white shadow-neutral-300 shadow-md inset-shadow-sm inset-shadow-neutral-200 lg:max-xl:grid-cols-35 md:max-lg:grid-cols-12 md:max-lg:h-17 md:max-lg:p-1" id='textArea'>
                    <div className="grid-cols-1 w-18 h-18 rounded-full 2xl:max-2xl:15 2xl:max-2xl:h-15 xl:max-2xl:h-13 xl:max-2xl:p-1 lg:max-xl:h-13 lg:max-xl:p-1 lg:max-xl:col-span-2 md:max-lg:p-1.5 md:max-lg:col-span-1 sm:max-md:p-1.5  sm:max-md:col-span-2">
                        <img src="https://i.postimg.cc/fbfvCLrQ/p1.png" className='rounded-full 2xl:max-2xl:w-15 2xl:max-2xl:h-15 xl:max-2xl:w-13 xl:max-2xl:h-13 lg:max-xl:w-12 lg:max-xl:h-12 md:max-lg:w-13 md:max-lg:h-13 sm:max-md:h-12 sm:max-md:w-12'></img>
                    </div>

                    <div className='col-span-3 w-56 h-18 p-4 2xl:max-2xl:w-56 2xl:max-2xl:h-10 2xl:max-2xl:p-2.5 xl:max-2xl:h-8 xl:max-2xl:p-3 lg:max-xl:p-2.5 lg:max-xl:col-span-6 md:max-lg:p-2.5 md:max-lg:col-span-4 sm:max-md:p-2 sm:max-md:col-span-7'>
                        <select className='w-55 h-12 p-3 border-gray-300 border rounded-xl hover:border-indigo-400 text-white 2xl:max-2xl:h-10 2xl:max-2xl:p-0.5 2xl:max-2xl:pl-2 xl:max-2xl:h-9 xl:max-2xl:p-1.5 xl:max-2xl:w-45 lg:max-xl:h-10 lg:max-xl:p-1 lg:max-xl:w-44 md:max-lg:h-10 md:max-lg:w-48 md:max-lg:p-1 sm:max-md:h-10 sm:max-md:p-0 sm:max-md:w-40  cursor-pointer' id="language" onChange={lang}>
                            <option value={"js"} className='text-black'>Web Development</option>
                            <option value={"java"} className='text-black'>Java</option>
                            <option value={"python"} className='text-black'>Python</option>
                            <option value={"c++"} className='text-black'>C++</option>
                        </select>
                    </div>
                    <div className='col-span-2 w-40 h-15 p-4 2xl:max-2xl:p-2.5 2xl:max-2xl:ml-3 xl:max-2xl:p-3 lg:max-xl:p-3 lg:max-xl:ml-4 lg:max-xl:col-span-4 md:max-lg:col-span-1 md:max-lg:p-0.5 sm:max-md:p-0'>
                        <label className='w-30 h-12 border-gray-400 border text-white rounded-xl 2xl:max-2xl:h-10 xl:max-2xl:h-9 xl:max-2xl:ml-5 xl:max-2xl:w-25  lg:max-xl:h-9 lg:max-xl:w-25 sm:max-lg:hidden block text-center p-2.5  cursor-pointer'>Import
                            <input type='file' className='hidden' accept='.txt'></input> 
                        </label>
                        <label>
                            <Import className='lg:hidden md:max-lg:block h-15 w-8 text-white  cursor-pointer'/>
                            <input type='file' className='hidden' accept='.txt'></input> 
                        </label>
                    </div>
                    <div className='col-span-2 w-40 h-15 p-4 2xl:max-2xl:p-2.5 2xl:max-2xl:ml-3 xl:max-2xl:p-3 lg:max-xl:p-3 lg:max-xl:ml-4 lg:max-xl:col-span-4 md:max-lg:col-span-1 md:max-lg:p-0.5 sm:max-md:p-0'>
                        <button className='w-30 h-12 border-gray-400 border rounded-xl text-white 2xl:max-2xl:h-10 xl:max-2xl:h-9 xl:max-2xl:ml-5 xl:max-2xl:w-25  lg:max-xl:h-9 lg:max-xl:w-25 md:max-lg:hidden  sm:max-lg:hidden block  cursor-pointer'>Export</button>
                        <CgExport className='hidden sm:max-lg:block h-13 w-8 text-white  cursor-pointer' />
                    </div>
                    <div className='col-span-2 w-40 h-15 p-4 2xl:max-2xl:p-2.5 2xl:max-2xl:ml-3 xl:max-2xl:p-3 lg:max-xl:p-3 lg:max-xl:ml-4 lg:max-xl:col-span-4 md:max-lg:col-span-1 md:max-lg:p-0.5 sm:max-md:p-0'>
                        <button className='w-30 h-12 rounded-xl border-gray-400 border text-white 2xl:max-2xl:h-10 xl:max-2xl:h-9 xl:max-2xl:ml-5 xl:max-2xl:w-25  lg:max-xl:h-9 lg:max-xl:w-25 md:max-lg:hidden  sm:max-lg:hidden block  cursor-pointer'>Beautify</button>
                        <PiButterflyFill className='hidden sm:max-lg:block h-13 w-8 text-white  cursor-pointer' />
                    </div>
                    <div className='col-span-7 xl:max-2xl:col-span-6 lg:max-xl:col-span-4 md:max-lg:col-span-2  sm:max-md:col-span-3'></div>
                    <div className='col-span-1 p-5 w-17 h-17 2xl:max-2xl:h-10 2xl:max-2xl:p-3 xl:max-2xl:p-3 xl:max-2xl:h-8 lg:max-xl:p-3 md:max-lg:p-4 md:max-lg:col-span-1 sm:max-md:p-2.5  sm:max-md:col-span-2' onClick={() => setTheme(!theme)}>
                        {!theme && <Sun className='w-8 h-8 xl:max-2xl:h-8 xl:max-2xl:w-7  md:max-lg:h-7 md:max-lg:w-7 text-white  cursor-pointer' />}

                    </div>
                    <div className='col-span-2 w-40 h-15 p-4 2xl:max-2xl:p-2.5 2xl:max-2xl:ml-3 lg:max-xl:col-span-4 lg:max-xl:ml-4 lg:max-xl:p-3 md:max-lg:col-span-1 md:max-lg:p-0.5  sm:max-md:p-0'>
                        <button className='w-30 h-12 border-gray-400 border rounded-xl text-white 2xl:max-2xl:h-10 xl:max-2xl:w-25 xl:max-2xl:h-9  lg:max-xl:h-9 lg:max-xl:w-25 md:max-lg:hidden sm:max-lg:hidden block  cursor-pointer'>Save</button>
                        <MdOutlineSave className='sm:max-lg:block hidden h-13 w-8 text-white  cursor-pointer' />
                    </div>
                    <div className='col-span-2 w-45 h-15 p-4 text-white 2xl:max-2xl:p-2.5 2xl:max-2xl:ml-3 lg:max-xl:ml-4 lg:max-xl:p-3 lg:max-xl:col-span-3 md:max-lg:hidden sm:max-lg:hidden block' onClick={() => setPrompt(!prompt)}>
                        {prompt &&
                            <button className='w-30 h-12  border-gray-400 border rounded-xl 2xl:max-2xl:h-10 xl:max-2xl:w-29 xl:max-2xl:h-9  lg:max-xl:h-9 lg:max-xl:w-27  cursor-pointer'>Hide Prompt</button>
                        }
                        {!prompt &&
                            <button className='w-30 h-12  border-gray-400 border rounded-xl 2xl:max-2xl:h-10 xl:max-2xl:w-29 xl:max-2xl:h-9  lg:max-xl:h-9 lg:max-xl:w-27  cursor-pointer'>Show Prompt</button>
                        }
                    </div>
                </div>
                {prompt &&
                    <div className='row-span-3 col-span-29 grid-cols-23 grid rounded-2xl bg-white shadow-md shadow-neutral-300 md:max-lg:h-18 md:max-lg:p-1.5' id='textArea'>
                        <div className='col-span-15 p-2 h-18 2xl:max-2xl:h-15 lg:max-xl:col-span-14 md:max-lg:col-span-8 sm:max-md:col-span-13'>
                            <input className='p-2 rounded-xl border-gray-300 border w-6xl h-13 2xl:max-2xl:h-10 2xl:max-2xl:w-5xl xl:max-2xl:h-10 xl:max-2xl:w-3xl lg:max-xl:h-10 lg:max-xl:w-xl md:max-lg:h-10 md:max-lg:w-3xs sm:max-md:w-xs sm:max-md:h-10' id='promptTag' placeholder='Enter your prompt here...'></input>
                        </div>
                        <div className='col-span-3 p-5 w-17 h-17 2xl:max-2xl:13 2xl:max-2xl:p-2.5 xl:max-2xl:p-3 xl:max-2xl:col-span-2 lg:max-xl:p-2.5 md:max-lg:p-2.5 md:max-lg:col-span-8 sm:max-md:p-3.5 sm:max-md:col-span-6' onClick={() => setMic(!mic)}>
                            {mic && <Mic className='w-8 h-8 xl:max-2xl:h-7 text-white md:max-lg:w-7 md:max-lg:h-7 sm:max-md:h-7 sm:max-md:w-7  cursor-pointer' />}
                            {!mic && <MicOff className='w-8 h-8 xl:max-2xl:h-7 text-white md:max-lg:w-7 md:max-lg:h-7 sm:max-md:h-7 sm:max-md:w-7  cursor-pointer' />}

                        </div>
                        <div className='col-span-2 w-40 h-15 p-4 2xl:max-2xl:p-2.5 2xl:max-2xl:ml-3 xl:max-2xl:p-2 lg:max-xl:col-span-3 lg:max-xl:p-3 md:max-lg:p-2 md:max-lg:col-span-4 sm:max-md:p-1'>
                            <button className='w-30 h-12 rounded-xl border-gray-400 border text-white 2xl:max-2xl:h-10 xl:max-2xl:h-10  cursor-pointer  lg:max-xl:h-9 lg:max-xl:w-25 md:max-lg:w-23 md:max-lg:h-10 sm:max-md:hidden block'>Generate</button>
                            <RiAiGenerate2 className='sm:max-md:block md:hidden h-13 w-8 text-white  cursor-pointer' />
                        </div>
                        <div className='col-span-2 w-40 h-15 p-4 2xl:max-2xl:p-2.5 2xl:max-2xl:ml-3 xl:max-2xl:p-2 lg:max-xl:p-3 md:max-lg:p-2 sm:max-md:p-1'>
                            <button className='w-30 h-12 border-gray-400 border rounded-xl text-white 2xl:max-2xl:h-10 xl:max-2xl:h-10  cursor-pointer xl:max-2xl:ml-7  lg:max-xl:h-9 lg:max-xl:w-25 md:max-lg:w-23 md:max-lg:h-10 sm:max-md:hidden block'>Convert</button>
                            <SiConvertio className='sm:max-md:block md:hidden h-13 w-7 text-white  cursor-pointer'/>
                        </div>
                    </div>
                }

                <div className="row-span-34 col-span-29 p-2 grid grid-cols-2 gap-5 sm:max-lg:grid-cols-1 md:max-lg:mt-2">
                    <div className=' inset-shadow-sm inset-shadow-neutral-200 shadow-md shadow-neutral-400 rounded-xl p-4 grid grid-rows-24 2xl:max-2xl:p-2.5 2xl:max-2xl:grid-cols-15 md:max-lg:grid-rows-28 md:max-lg:gap-1' id='textArea'>

                        <div className='row-span-2 w-3xl md:max-lg:row-span-3'>

                            {selectedLanguge != "js" ?
                                <div className='grid grid-cols-10 xl:max-2xl:grid-cols-7 md:max-lg:grid-cols-12 md:max-lg:p-0.5 sm:max-md:grid-cols-13'>
                                    <p className='bg-gray-200 col-span-9 w-30 h-12 text-center rounded-xl p-3 xl:max-2xl:col-span-4 lg:max-xl:col-span-2 md:max-lg:col-span-8 md:max-lg:h-11 md:max-lg:rounded-md sm:max-md:col-span-7'>{selectedLanguge}</p>
                                    <button className='w-30 h-10 bg-green-600 shadow-md text-white rounded-md  cursor-pointer'>Run</button>
                                </div> :
                                <div className='grid grid-cols-10 gap-1 2xl:max-2xl:gap-0 xl:max-2xl:grid-cols-14 lg:max-xl:grid-cols-18 md:max-lg:grid-cols-12 sm:max-md:grid-cols-16 sm:max-lg:h-12'>
                                    <button className='w-20 h-10 shadow-md rounded-md col-span-2 bg-gray-200 lg:max-xl:w-16 lg:max-xl:col-span-2 sm:max-lg:hidden block  cursor-pointer'>HTML</button>
                                    <button className='hidden sm:max-lg:block w-10 md:max-lg:col-span-1'><BsFiletypeHtml className='w-8 h-8 text-white  cursor-pointer' /></button>
                                    <button className='w-20 h-10 shadow-md rounded-md col-span-2 bg-gray-200 lg:max-xl:w-16 lg:max-xl:col-span-2 sm:max-lg:hidden block  cursor-pointer'>CSS</button>
                                    <button className='hidden sm:max-lg:block w-10 md:max-lg:col-span-1'><BsFiletypeCss className='w-8 h-8 text-white  cursor-pointer' /></button>
                                    <button className='w-30 h-10 shadow-md rounded-md col-span-5 bg-gray-200 2xl:max-2xl:col-span-4 xl:max-2xl:col-span-4 lg:max-xl:col-span-4 lg:max-xl:w-27 sm:max-lg:hidden block  cursor-pointer'>JAVASCRIPT</button>
                                    <button className='hidden sm:max-lg:block w-10 md:max-lg:col-span-7'><PiFileJs className='w-8 h-8 text-white  cursor-pointer' /></button>
                                    <button className='w-30 h-10 bg-green-600 shadow-md text-white rounded-md lg:max-xl:w-23  cursor-pointer'>Run</button>
                                </div>
                            }
                        </div>


                        <textarea className='border border-gray-300 rounded-xl p-5 row-span-22 text-white 2xl:max-2xl:col-span-15 xl:max-2xl:w-xl lg:max-xl:w-110 md:max-lg:w-2xl md:max-lg:row-span-25 sm:max-md:mt-2.5 sm:max-md:w-140' id='input' style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }} placeholder='Type your codes here...'></textarea>
                    </div>
                    <div disabled className=' inset-shadow-sm inset-shadow-neutral-200 shadow-md shadow-neutral-400 rounded-xl p-4 grid grid-rows-24 2xl:max-2xl:p-2.5 2xl:max-2xl:grid-cols-15 md:max-lg:grid-rows-28 md:max-lg:gap-1' id='textArea'>
                        <div className='row-span-2 w-3xl md:max-lg:row-span-3'>

                            {selectedLanguge != "js" ?
                                <div>
                                    <p className='bg-gray-200 w-30 h-12 text-center rounded-xl p-3 md:max-lg:max-lg:h-11 md:max-lg:max-lg:rounded-md md:max-lg:max-lg:mb-2'>Console</p>
                                </div> :
                                <div className='grid grid-cols-10 gap-1 md:max-lg:p-1 sm:max-lg:h-12'>
                                    <button className='w-20 h-10 shadow-md rounded-md col-span-2 bg-gray-200 md:max-lg:h-10 md:max-lg:w-20  cursor-pointer'>Preview</button>
                                    <button className='w-20 h-10 shadow-md rounded-md col-span-2 bg-gray-200 md:max-lg:h-10 md:max-lg:w-20  cursor-pointer'>Console</button>
                                </div>
                            }
                        </div>
                        <textarea className='border border-gray-300 rounded-xl p-5 shadow-md row-span-22 text-white 2xl:max-2xl:col-span-15 xl:max-2xl:w-xl lg:max-xl:w-110 md:max-lg:w-2xl md:max-lg:row-span-25 sm:max-md:mt-2.5 sm:max-md:w-140' id='input' style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }} disabled placeholder='Output will be printed...'></textarea>
                    </div>
                </div>
            </div >
        )
    }

}

export default CodeIDE_Main