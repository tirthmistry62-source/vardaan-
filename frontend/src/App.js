import "@/App.css";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Toaster } from "sonner";
import { getSession } from "@/lib/api";
import { initializeFirebase, setupForegroundMessageListener } from "@/lib/firebase";
import { useEffect, useState } from "react";
import ParentForgotPassword from "@/pages/ParentForgotPassword";
import ParentForgotPasswordVerify from "@/pages/ParentForgotPasswordVerify";
import ParentForgotPasswordReset from "@/pages/ParentForgotPasswordReset";

import Landing from "@/pages/Landing";
import SelectRole from "@/pages/SelectRole";
import ParentLogin from "@/pages/ParentLogin";
import ParentRegister from "@/pages/ParentRegister";
import ParentDashboard from "@/pages/ParentDashboard";
import AddChild from "@/pages/AddChild";
import ChildProfile from "@/pages/ChildProfile";
import EditChild from "@/pages/EditChild";
import ParentNotifications from "@/pages/ParentNotifications";
import ParentSettings from "@/pages/ParentSettings";
import DoctorLogin from "@/pages/DoctorLogin";
import DoctorRegister from "@/pages/DoctorRegister";
import DoctorDashboard from "@/pages/DoctorDashboard";
import DoctorChildRecord from "@/pages/DoctorChildRecord";
import DoctorSettings from "@/pages/DoctorSettings";
import OnboardingExperience, { ONBOARDING_STORAGE_KEY } from "@/components/onboarding/OnboardingExperience";

function RequireRole({ role, children }) {
  const s = getSession();
  if (!s || s.role !== role) return <Navigate to={role === "parent" ? "/parent/login" : "/doctor/login"} replace />;
  return children;
}

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.22, ease: [0.2, 0.8, 0.2, 1] }}
      >
        <Routes location={location}>
          <Route path="/" element={<Landing />} />
          <Route path="/select-role" element={<SelectRole />} />

          <Route path="/parent/login" element={<ParentLogin />} />
          <Route
                 path="/parent/forgot-password"
                 element={<ParentForgotPassword />}
          />  
          <Route
                 path="/parent/forgot-password/verify"
                 element={<ParentForgotPasswordVerify />}
          />
          <Route
                 path="/parent/forgot-password/reset"
                 element={<ParentForgotPasswordReset />}
          />
          <Route path="/parent/register" element={<ParentRegister />} />
          <Route path="/parent/dashboard" element={<RequireRole role="parent"><ParentDashboard /></RequireRole>} />
          <Route path="/parent/settings" element={<RequireRole role="parent"><ParentSettings /></RequireRole>} />
          <Route path="/parent/add-child" element={<RequireRole role="parent"><AddChild /></RequireRole>} />
          <Route path="/parent/child/:id" element={<RequireRole role="parent"><ChildProfile /></RequireRole>} />
          <Route path="/parent/child/:id/edit" element={<RequireRole role="parent"><EditChild /></RequireRole>} />
          <Route path="/parent/notifications" element={<RequireRole role="parent"><ParentNotifications /></RequireRole>} />

          <Route path="/doctor/login" element={<DoctorLogin />} />
          <Route path="/doctor/register" element={<DoctorRegister />} />
          <Route path="/doctor/dashboard" element={<RequireRole role="doctor"><DoctorDashboard /></RequireRole>} />
          <Route path="/doctor/settings" element={<RequireRole role="doctor"><DoctorSettings /></RequireRole>} />
          <Route path="/doctor/child/:id" element={<RequireRole role="doctor"><DoctorChildRecord /></RequireRole>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

function App() {
  const [onboardingComplete, setOnboardingComplete] = useState(() => {
    try {
      return localStorage.getItem(ONBOARDING_STORAGE_KEY) === "true";
    } catch (_error) {
      return false;
    }
  });

  // Initialize Firebase on app load
  useEffect(() => {
    initializeFirebase();
  }, []);

  // Check if user has a valid session on app load
  const session = getSession();
  
  return (
    <div className="App">
      <BrowserRouter>
        <Toaster richColors position="top-center" />
        <AnimatedRoutes />
        {!onboardingComplete && <OnboardingExperience onComplete={() => setOnboardingComplete(true)} />}
      </BrowserRouter>
    </div>
  );
}

export default App;
