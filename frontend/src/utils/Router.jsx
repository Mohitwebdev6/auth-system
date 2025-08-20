import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import EmailVerification from "../pages/EmailVerification";
import Home from "../pages/Home";
import ProtectedRoutes from "../pages/ProtectedRoutes";
import { useContext } from "react";
import { userDataContext } from "../context/UserContext";
import ResetPassword from "../pages/ResetPassword";
import SendVerificationLink from "../pages/SendVerificationLink";

function Router() {
  const {user}=useContext(userDataContext)
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/resetpassword/:token" element={<ResetPassword/>} />
      <Route path="/resetpassword" element={<SendVerificationLink/>} />
      <Route path="/:id/verifyemail" element={<EmailVerification />} />
      <Route
        path={`/:id`}
        element={
          <ProtectedRoutes>
            <Home />
          </ProtectedRoutes>
        }
      />
    </Routes>
  );
}

export default Router;
