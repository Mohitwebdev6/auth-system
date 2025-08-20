import { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { userDataContext } from "../context/UserContext";
import { toast } from "react-toastify";

export default function LoginForm() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const { user, setUser, serverUrl ,setisAuthenticated} = useContext(userDataContext);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?._id) {
      const t = setTimeout(() => navigate(`/${user._id}`), 800);
      return () => clearTimeout(t);
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post(`${serverUrl}/login`, formData, {
        withCredentials: true,
      });
      setUser(data);
      setisAuthenticated(true)
      toast.success(`Welcome back ${data.name} 🎉`);
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "Login failed. Try again.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-500 via-indigo-600 to-blue-600 p-6">
      <motion.form
        initial={{ opacity: 0, scale: 0.9, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        onSubmit={handleSubmit}
        className="flex flex-col gap-6 bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl p-8 shadow-2xl max-w-md w-full"
      >
        <h2 className="text-3xl font-extrabold text-center text-white drop-shadow-lg">
          Welcome Back
        </h2>
        <p className="text-center text-white/80 text-sm mb-4">
          Login to continue 🚀
        </p>

        {/* Email */}
        <div className="relative">
          <input
            type="email"
            id="email"
            name="email"
            autoComplete="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="Email"
            className="peer w-full px-4 pt-5 pb-2 rounded-lg bg-white/30 text-white placeholder-transparent border border-white/40 focus:outline-none focus:ring-2 focus:ring-yellow-300"
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
            autoComplete="current-password"
            value={formData.password}
            onChange={handleChange}
            required
            placeholder="Password"
            className="peer w-full px-4 pt-5 pb-2 rounded-lg bg-white/30 text-white placeholder-transparent border border-white/40 focus:outline-none focus:ring-2 focus:ring-yellow-300"
          />
          <label
            htmlFor="password"
            className="absolute left-3 top-2 text-white/70 text-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-200 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm peer-focus:text-yellow-200"
          >
            Password
          </label>
          <button
            type="button"
            onClick={() => setShowPassword((s) => !s)}
            className="absolute right-3 top-3 text-white/80 hover:text-yellow-200"
          >
            {showPassword ? (
              // Eye off SVG
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.8"
                  d="M3 3l18 18M10.58 10.58A2 2 0 0012 14a2 2 0 001.42-3.42M9.88 9.88C8.75 10.37 7.8 11.2 7.2 12c.96 1.28 3.55 3.5 6.8 3.5.67 0 1.31-.1 1.9-.3M6.1 6.1C4.3 7.24 2.93 8.84 2 10c1.6 2.12 5.18 5.5 10 5.5 1.13 0 2.18-.18 3.14-.5"
                />
              </svg>
            ) : (
              // Eye SVG
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.8"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.8"
                  d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12z"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Login Button */}
        <motion.button
          whileHover={{ scale: loading ? 1 : 1.05 }}
          whileTap={{ scale: loading ? 1 : 0.97 }}
          disabled={loading}
          type="submit"
          className="w-full py-3 rounded-lg bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70"
        >
          {loading ? (
            <>
              <span className="inline-block w-5 h-5 border-2 border-white/70 border-t-transparent rounded-full animate-spin" />
              <span>Logging in…</span>
            </>
          ) : (
            "Log In"
          )}
        </motion.button>

        {/* Register link */}
        <div className="text-center mt-2">
          <span className="text-white/80 text-sm">Don’t have an account? </span>
          <NavLink
            to="/signup"
            className="text-yellow-300 hover:text-yellow-200 font-semibold transition-colors underline"
          >
            Register
          </NavLink>
        </div>
        <div className="text-center mt-2">
          <NavLink
            to="/resetpassword"
            className="text-red-300 hover:text-red-200 font-semibold transition-colors underline"
          >
            forget passowrd
          </NavLink>
        </div>
      </motion.form>
    </div>
  );
}
