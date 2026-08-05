import { useDispatch, useSelector } from "react-redux"
import { LogOut } from "../slice/authslice";
import { useNavigate } from "react-router";
import Navbar from "../components/Navbar";




function Homepage() {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data } = useSelector((state) => state.auth);


  

  const handleLogout = () => {
      dispatch(LogOut());
      navigate("/login");
  }

  return (
    <>
    <Navbar handleLogout={handleLogout}/>
    </>
  )
}

export default Homepage
