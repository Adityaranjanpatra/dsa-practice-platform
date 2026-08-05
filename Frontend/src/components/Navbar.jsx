import logo from "../assets/logo.png";
function Navbar({handleLogout}) {
  return (
    <div className="flex flex-row justify-between items-center p-4 bg-white text-black mx-50 my-10 rounded-xl h-10">
      <div className="w-[20%] flex justify-start items-center">
        <img src={logo} alt="Logo" className="w-auto h-auto" />
      </div>
      <div className="flex w-[60%] justify-center gap-3 items-center">
        <div>Problems</div>
        <div>Submissions</div>
      </div>
      <div className="w-[20%] flex justify-end items-center">
        <button className="btn btn-primary">
            <span onClick={handleLogout}>Logout</span>
        </button>
      </div>
    </div>
  )
}

export default Navbar