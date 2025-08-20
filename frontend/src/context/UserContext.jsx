import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import { createContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { analytics } from "../config/FirebaseConfig";



export const userDataContext = createContext();

export default function UserContext({ children }) {
  const serverUrl = "http://localhost:5000/api/auth";
  const [isAuthenticated, setisAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const getUserData = async () => {
    try {
      let { data } = await axios.get(`${serverUrl}/getuser`, {
        withCredentials: true,
      });
      if (data.user) {
        toast.success("Logging you in");
        setisAuthenticated(true);
      }
      setUser(data.user);
    } catch (error) {
      setisAuthenticated(false);
      console.log("Error while geting data", error);
    }
  };
  useEffect(() => {
    console.log(analytics)
    getUserData();
  
  }, []);

  const value = {
    serverUrl,
    user,
    setUser,
    isAuthenticated,
    setisAuthenticated,
  };
  return (
    <userDataContext.Provider value={value}>
      {children}
    </userDataContext.Provider>
  );
}
