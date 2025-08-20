// SignupForm.js
import { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { userDataContext } from "../context/UserContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Eye, EyeOff, Loader2 } from "lucide-react";

export default function Signup() {
  const { user, setUser ,setisAuthenticated} = useContext(userDataContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (user) {
      setTimeout(() => {
        navigate(`/${user._id}`);
      }, 1000);
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/auth/signup",
        form,
        { withCredentials: true }
      );
      setUser(data);
      setisAuthenticated(true)
      toast.success("🎉 Account created! Logging you in...");
    } catch (error) {
      console.log("Error while Signup:", error.response?.data);
      toast.error(error.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-400 via-indigo-500 to-purple-600 p-6">
      <motion.form
        initial={{ opacity: 0, scale: 0.9, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        onSubmit={handleSubmit}
        className="flex flex-col gap-6 bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl p-8 shadow-2xl max-w-md w-full"
      >
        <h2 className="text-3xl font-extrabold text-center text-white mb-2 drop-shadow-lg">
          Create an Account
        </h2>
        <p className="text-center text-white/80 text-sm mb-4">
          Join us and explore amazing features 🚀
        </p>

        {/* Name */}
        <div className="relative">
          <input
            type="text"
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="peer w-full px-4 pt-5 pb-2 rounded-lg bg-white/30 text-white placeholder-transparent border border-white/40 focus:outline-none focus:ring-2 focus:ring-yellow-300"
            placeholder="Name"
          />
          <label
            htmlFor="name"
            className="absolute left-3 top-2 text-white/70 text-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-200 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm peer-focus:text-yellow-200"
          >
            Name
          </label>
        </div>

        {/* Username */}
        <div className="relative">
          <input
            type="text"
            id="username"
            name="username"
            value={form.username}
            onChange={handleChange}
            required
            className="peer w-full px-4 pt-5 pb-2 rounded-lg bg-white/30 text-white placeholder-transparent border border-white/40 focus:outline-none focus:ring-2 focus:ring-yellow-300"
            placeholder="Username"
          />
          <label
            htmlFor="username"
            className="absolute left-3 top-2 text-white/70 text-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-200 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm peer-focus:text-yellow-200"
          >
            Username
          </label>
        </div>

        {/* Email */}
        <div className="relative">
          <input
            type="email"
            id="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            className="peer w-full px-4 pt-5 pb-2 rounded-lg bg-white/30 text-white placeholder-transparent border border-white/40 focus:outline-none focus:ring-2 focus:ring-yellow-300"
            placeholder="Email"
          />
          <label
            htmlFor="email"
            className="absolute left-3 top-2 text-white/70 text-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-200 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm peer-focus:text-yellow-200"
          >
            Email
          </label>
        </div>

        {/* Password */}
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
            className="peer w-full px-4 pt-5 pb-2 rounded-lg bg-white/30 text-white placeholder-transparent border border-white/40 focus:outline-none focus:ring-2 focus:ring-yellow-300"
            placeholder="Password"
          />
          <label
            htmlFor="password"
            className="absolute left-3 top-2 text-white/70 text-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-200 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm peer-focus:text-yellow-200"
          >
            Password
          </label>
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 text-white/80 hover:text-yellow-200"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {/* Submit Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          disabled={loading}
          type="submit"
          className="w-full py-3 rounded-lg bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
        >
          {loading ? <Loader2 className="animate-spin" size={22} /> : "Sign Up"}
        </motion.button>

        {/* Login link */}
        <div className="text-center mt-2">
          <span className="text-white/80 text-sm">Already have an account? </span>
          <a
            href="/login"
            className="text-yellow-300 hover:text-yellow-200 font-semibold transition-colors underline"
          >
            Log In
          </a>
        </div>
      </motion.form>
      
    </div>
  );
}
