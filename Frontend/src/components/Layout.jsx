import { Outlet } from "react-router"
import Navbar from "./Navbar"


function Layout() {
  return (
    <>
   <div className="absolute top-0 left-0 w-full z-50">
     <Navbar/>
   </div>
    <Outlet/>
    </>
  )
}

export default Layout