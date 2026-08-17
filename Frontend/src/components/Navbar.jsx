import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink, useNavigate } from "react-router";
import logo from "../assets/logo.png";
import { LogOut } from "../slice/authslice";

function Navbar() {
  const dispatch = useDispatch();
  const { data } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(LogOut());
    navigate("/Login");
  };

  return (
    <div className="flex flex-row justify-between items-center gap-10 p-4 bg-white text-slate-900 mx-auto my-10 rounded-full h-15 w-[75vw] shadow-xl border min-w-190 border-slate-200">
      <div className="w-[25%] flex justify-start items-center ml-10">
        <NavLink to="/">
          <img src={logo} alt="Logo" className="w-auto h-auto" />
        </NavLink>
      </div>
      <div className=" relative flex w-[60%] justify-end gap-6 items-center mr-10">
        <Link to="/problems"><div className="text-xl font-semibold">Problems</div></Link>
        <div className="text-xl font-semibold">Submissions</div>
        {data?.user?.role === "admin" && <span className="px-2 py-0.5 text-[10px] font-semibold text-white absolute -top-6 -right-0.5 bg-black rounded-full shadow-md border border-white/20">Admin</span>}
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="avatar avatar-placeholder btn btn-ghost btn-circle w-10"
          >
            
            <div className="bg-neutral text-neutral-content w-12 rounded-full">
              <span className="text-xl">{data?.user?.firstName[0]}</span>
            </div>
          </div>
          <ul
            tabIndex="-1"
            className="menu menu-sm dropdown-content bg-slate-800 text-slate-100 border border-slate-700 gap-3 rounded-box z-1 mt-3 w-52 p-2 shadow-xl"
          >
            <li>
              <a className="text-xl hover:bg-slate-700 hover:text-white rounded-lg">
                Profile
              </a>
            </li>
            {data?.user?.role === "admin" && (
              <li>
              <Link to = "/admin" className="text-xl hover:bg-slate-700 hover:text-white rounded-lg">
                Admin Panel
              </Link>
            </li>
            )}
            <li>
              <button className="btn bg-indigo-500 hover:bg-indigo-400 text-white border-none rounded-full w-25 ">
                <span onClick={handleLogout} className="text-lg font-medium">
                  Logout
                </span>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
