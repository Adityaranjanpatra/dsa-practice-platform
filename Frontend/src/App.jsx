import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Route, Routes } from "react-router";
import Layout from "./components/Layout";
import ProblemCreate from "./components/ProblemCreate";
import ProblemDelete from "./components/ProblemDelete";
import ProblemUpdate from "./components/ProblemUpdate";
import UpdatePage from "./components/UpdatePage";
import AdminPanel from "./pages/AdminPanel";
import Homepage from "./pages/Homepage";
import Login from "./pages/Login";
import Problem from "./pages/Problem";
import ProblemPage from "./pages/ProblemPage";
import Signup from "./pages/Signup";
import { checkauth } from "./slice/authslice";

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(checkauth());
  }, [dispatch]);
  const { isAuthenticated } = useSelector((state) => state.auth);
  return (
    <div className="font-[Inter]">
      <Routes>
        <Route element={<Layout />}>
          <Route
            path="/"
            element={isAuthenticated ? <Homepage /> : <Navigate to="/login" />}
          ></Route>
          <Route
            path="/problems"
            element={isAuthenticated ? <Problem /> : <Navigate to="/login" />}
          ></Route>
          <Route
            path="/admin"
            element={
              isAuthenticated ? <AdminPanel /> : <Navigate to="/login" />
            }
          ></Route>
          <Route
            path="/admin/create"
            element={
              isAuthenticated ? <ProblemCreate /> : <Navigate to="/login" />
            }
          ></Route>
          <Route
            path="/admin/delete"
            element={
              isAuthenticated ? <ProblemDelete /> : <Navigate to="/login" />
            }
          ></Route>
          <Route
            path="/admin/update"
            element={
              isAuthenticated ? <ProblemUpdate /> : <Navigate to="/login" />
            }
          ></Route>
          <Route
            path="/admin/update/:id"
            element={
              isAuthenticated ? <UpdatePage /> : <Navigate to="/login" />
            }
          ></Route>
          {/* <Route path="/problems" element={<Problem/>} /> */}
        </Route>
        <Route
          path="/problems/:id"
          element={isAuthenticated ? <ProblemPage /> : <Navigate to="/login" />}
        ></Route>
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/" /> : <Login />}
        ></Route>
        <Route
          path="/signup"
          element={isAuthenticated ? <Navigate to="/" /> : <Signup />}
        ></Route>
      </Routes>
    </div>
  );
}

export default App;
