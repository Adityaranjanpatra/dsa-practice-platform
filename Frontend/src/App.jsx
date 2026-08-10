import { Navigate, Route, Routes } from "react-router"
import  Homepage from "./pages/Homepage"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import { useDispatch, useSelector } from "react-redux"
import { useEffect } from "react"
import { checkauth } from "./slice/authslice"
import Layout from "./components/Layout"
import Problem from "./pages/Problem"
import ProblemPage from "./pages/ProblemPage"





function App() {
  
const dispatch=useDispatch();
useEffect(()=>{
  dispatch(checkauth());
},[dispatch]);
const {isAuthenticated} = useSelector((state)=>state.auth);
  return (
    <div className="font-[Inter]">
      <Routes>
        <Route element={<Layout/>}>
          <Route path='/' element={isAuthenticated?<Homepage/>:<Navigate to="/login" />}></Route>
          <Route path='/problems' element={isAuthenticated?<Problem/>:<Navigate to="/login" />}></Route>
          {/* <Route path="/problems" element={<Problem/>} /> */}
        </Route>
        <Route path='/problems/:id' element={isAuthenticated?<ProblemPage/>:<Navigate to="/login" />}></Route>
        <Route path='/login' element={isAuthenticated?<Navigate to="/" />:<Login/>}></Route>
        <Route path='/signup' element={isAuthenticated?<Navigate to="/" />:<Signup/>}></Route>
      </Routes>
      
    </div>
  )
}

export default App
