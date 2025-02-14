
function EditProfile()
{
    return(
        <div className="w-70 h-40 p-3 border shadow-xl z-10">
            <input type="text" className="border-b pt-3" placeholder="user name"></input>
            <input type="password" className="border-b pt-3" placeholder="******"></input>
            <p className="pt-3">Edit Profile Picture</p>
        </div>
    )
}

export default EditProfile