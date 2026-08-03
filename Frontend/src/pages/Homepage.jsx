import { useDispatch } from "react-redux"
import { LogOut } from "../slice/authslice";
import { useNavigate } from "react-router";



function Homepage() {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(LogOut());
    navigate("/login");
  }
  return (
    <div >
      <button className="btn btn-primary"
      onClick={handleLogout}
      >Logout</button>
    </div>
  )
}

export default Homepage