import { Navigate, Route, Routes } from "react-router"
import  Homepage from "./pages/Homepage"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import { useDispatch, useSelector } from "react-redux"
import { useEffect } from "react"
import { checkauth } from "./slice/authslice"




function App() {
  
const dispatch=useDispatch();
useEffect(()=>{
  dispatch(checkauth());
},[dispatch]);
const {isAuthenticated} = useSelector((state)=>state.auth);
  return (
    <div >
      <Routes>
        <Route path='/' element={isAuthenticated?<Homepage/>:<Navigate to="/login" />}></Route>
        <Route path='/login' element={isAuthenticated?<Navigate to="/" />:<Login/>}></Route>
        <Route path='/signup' element={isAuthenticated?<Navigate to="/" />:<Signup/>}></Route>
      </Routes>
    </div>
  )
}

export default App
