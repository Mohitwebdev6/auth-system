import { useContext } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { userDataContext } from "../context/UserContext";
import { Children } from "react";

export default function ProtectedRoutes({children}) {
  const { isAuthenticated,serverUrl } = useContext(userDataContext);
  const navigate = useNavigate();

  useEffect(()=>{
    if(!isAuthenticated) navigate(`/login`)
  },[])
  return (children);
}
