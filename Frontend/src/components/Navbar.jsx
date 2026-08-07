import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router";
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
    <div className="flex flex-row justify-between items-center  p-4 bg-white text-slate-900 mx-auto my-10 rounded-full min-h-20 w-[60%] shadow-xl border border-slate-200">
            <div className="w-[25%] flex justify-start items-center ml-10">
        <NavLink to="/"><img src={logo} alt="Logo" className="w-auto h-auto" /></NavLink>
      </div>
      <div className="flex w-[60%] justify-end gap-6 items-center mr-4">
        <div className="text-2xl font-semibold">Problems</div>
        <div className="text-2xl font-semibold">Submissions</div>
             <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="avatar avatar-placeholder btn btn-ghost btn-circle w-18"
          >
            <div className="bg-neutral text-neutral-content w-18 rounded-full">
              <span className="text-3xl">{data?.user?.firstName[0]}</span>
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
