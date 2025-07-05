import { Routes, Route, Navigate } from "react-router";
import Home from "./Components/Home";
import SignUp from "./Components/Auth/SignUp";
import Login from "./Components/Auth/Login";
import { useEffect, useContext } from "react";
import { getUserData } from "./API/Api";
import  UserContext  from "./context/UserContext";
import DashBoard from "./Components/DashBoard";
import ProjectDashboard from "./Components/ProjectDashboard";
import Docs from "./Components/Docs";

function App() {
  const { userId, setuserId, setemail, setname } = useContext(UserContext);

  useEffect(() => {
    const getData = async () => {
      const data = await getUserData();
      if (data) {
        setuserId(data._id || null);
        setemail(data.email || null);
        setname(data.name || null);
      }
    };
    getData();
  }, []);

  return (
    <Routes>
      {!userId && (
        <>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/docs" element={<Docs/>} />
          <Route path="*" element={<Navigate to="/" />} />
        </>
      )}
      {userId && (
        <>
          <Route path="/dashboard" element={<DashBoard/>} />
          <Route path="/project/:projectId" element={<ProjectDashboard/>} />
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </>
      )}
    </Routes>
  );
}

export default App;
