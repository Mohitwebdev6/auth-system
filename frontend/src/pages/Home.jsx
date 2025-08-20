import React, { useContext, useEffect } from "react";
import { userDataContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

export default function Home() {
  const { user, serverUrl, setUser } = useContext(userDataContext);
  const navigate = useNavigate();
  // useEffect(() => {
  //   if (!user) {
  //     navigate("/login");
  //   }
  // }, [user, navigate]);

  const handleLogout = async () => {
    try {
      const res=await axios.post(`${serverUrl}/logout`, {}, { withCredentials: true });
      setUser(null);
      toast.success("Logged out successfully!");
      navigate("/login");
    } catch (error) {
      console.log(error);
      toast.error("Logout failed!");
    }
  };

  const handleVerifyEmail = async () => {
    try {
      await axios.post(`${serverUrl}/sendverificationcode`, {email:user.email}, { withCredentials: true });
      toast.success("Verification Token send");
      navigate(`/${user._id}/verifyemail`)
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="flex flex-col items-center justify-center min-h-screen  bg-gradient-to-br from-blue-400 via-indigo-500 to-purple-600"
    >
      <div className="bg-white/40 backdrop-blur-md shadow-lg rounded-2xl p-8 w-full max-w-md text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Welcome, {user ? user.name : "Loading..."}
        </h1>
        <p className="text-gray-600 mb-6">
          You are now logged in. Enjoy your session!
        </p>
        <button
          onClick={handleLogout}
          className="w-full py-2 rounded-md bg-red-600 hover:bg-red-700 text-white font-semibold text-lg transition-colors shadow-md"
        >
          Logout
        </button>
        {user?.isVerified ? (
          ""
        ) : (
          <button
            onClick={handleVerifyEmail}
            className="mt-2 w-full py-2 rounded-md bg-yellow-600 hover:bg-yellow-700 text-white font-semibold text-lg transition-colors shadow-md"
          >
            Verify Email
          </button>
        )}
      </div>
    </motion.div>
  );
}
