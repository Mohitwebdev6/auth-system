// CodeEntryPage.js
import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import axios from "axios";
import { useContext } from "react";
import { userDataContext } from "../context/UserContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function EmailVerification() {
  const { user, serverUrl, setUser } = useContext(userDataContext);
  const navigate=useNavigate()

  const [code, setCode] = useState("");
  useEffect(() => {
      if (user?.isVerified) {
        const t = setTimeout(() => navigate(`/${user._id}`), 800);
        return () => clearTimeout(t);
      }
    }, [user, navigate]);

  const handleChange = (e) => {
    // Only allow numbers and limit length to 6 (or desired length)
    const value = e.target.value.replace(/\D/g, "").slice(0, 7);
    setCode(value);
  };
  console.log(code);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${serverUrl}/verify-email`,
        { code, email: user.email },
        { withCredentials: true }
      );
      toast.success(res.data.message)
      console.log(res)
    } catch (error) {
      console.log("Error while submiting Code", error);
      toast.error(error.response.data.message);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="w-fit flex items-center justify-center"
    >
      <form
        onSubmit={handleSubmit}
        className="bg-white/30 shadow-lg rounded-xl p-8 max-w-md w-full text-center"
      >
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Enter Your Code
        </h2>
        <input
          type="text"
          inputMode="numeric"
          className="w-full text-center text-2xl tracking-widest px-4 py-3 border  rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Enter 6-digit code"
          value={code}
          onChange={handleChange}
          required
          maxLength={7}
          autoFocus
        />
        <button
          type="submit"
          disabled={code.length !== 6}
          className={`mt-6 w-full py-2 rounded-md font-semibold text-white transition-colors ${
            code.length === 6
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-blue-300 cursor-not-allowed"
          }`}
        >
          Verify Code
        </button>
      </form>
    </motion.div>
  );
}
