

function ConvertLang() {
    <div className='absolute left-140 z-10 w-50 h-120 mt-20 bg-white font-extrabold text-left rounded-xl shadow-xl shadow-gray-500'>
        <ul>
            <li className=' flex items-center hover:bg-gray-300 h-13' onClick={() => { setConvertLang(!convertLang); codeConverter("java") }}>
                <p className='ml-6'>Java</p>

            </li>
            <li className=' flex items-center hover:bg-gray-300 h-13' onClick={() => { setConvertLang(!convertLang); codeConverter("javascript") }}>
                <p className='ml-6'>JavaScript</p>
            </li>
            <li className=' flex items-center hover:bg-gray-300 h-13' onClick={() => { setConvertLang(!convertLang); codeConverter("python3") }}>
                <p className='ml-6'>Python</p>
            </li>
            <li className=' flex items-center hover:bg-gray-300 h-13' onClick={() => { setConvertLang(!convertLang); codeConverter("c") }}>
                <p className='ml-6'>C</p>
            </li>
            <li className=' flex items-center hover:bg-gray-300 h-13' onClick={() => { setConvertLang(!convertLang); codeConverter("cpp") }}>
                <p className='ml-6'>C++</p>
            </li>
            <li className=' flex items-center hover:bg-gray-300 h-13' onClick={() => { setConvertLang(!convertLang); codeConverter("php") }}>
                <p className='ml-6'>Php</p>
            </li>
            <li className=' flex items-center hover:bg-gray-300 h-13' onClick={() => { setConvertLang(!convertLang); codeConverter("ruby") }}>
                <p className='ml-6'>Ruby</p>
            </li>
            <li className=' flex items-center hover:bg-gray-300 h-13' onClick={() => { setConvertLang(!convertLang); codeConverter("golang") }}>
                <p className='ml-6'>Go</p>
            </li>
            <li className=' flex items-center hover:bg-gray-300 h-13' onClick={() => { setConvertLang(!convertLang); codeConverter("rlang") }}>
                <p className='ml-6'>R</p>
            </li>

        </ul>
    </div>
}
export default ConvertLang();