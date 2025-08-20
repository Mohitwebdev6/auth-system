import { useContext, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { userDataContext } from "../context/UserContext";
import { toast } from "react-toastify";

export default function SendVerificationLink() {
  const { serverUrl } = useContext(userDataContext);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email");
      return;
    }
    try {
      setLoading(true);
      await axios.post(`${serverUrl}/forgot-password`, { email });
      toast.success("Password reset link sent to your email 📩");
      setTimeout(() => navigate("/login"), 2000); // Redirect after 2s
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong!";
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
          Forgot Password
        </h2>
        <p className="text-center text-white/80 text-sm mb-4">
          Enter your email and we’ll send you a reset link 🔑
        </p>

        {/* Email input */}
        <div className="relative">
          <input
            type="email"
            id="email"
            name="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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

        {/* Submit button */}
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
              <span>Sending…</span>
            </>
          ) : (
            "Send Reset Link"
          )}
        </motion.button>

        <div className="text-center mt-2">
          <span className="text-white/80 text-sm">Remembered your password? </span>
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="text-yellow-300 hover:text-yellow-200 font-semibold transition-colors underline"
          >
            Back to Login
          </button>
        </div>
      </motion.form>
    </div>
  );
}
