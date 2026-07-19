import "@/App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import { getSession } from "@/lib/api";

import Landing from "@/pages/Landing";
import SelectRole from "@/pages/SelectRole";
import ParentLogin from "@/pages/ParentLogin";
import ParentRegister from "@/pages/ParentRegister";
import ParentDashboard from "@/pages/ParentDashboard";
import AddChild from "@/pages/AddChild";
import ChildProfile from "@/pages/ChildProfile";
import ParentNotifications from "@/pages/ParentNotifications";
import DoctorLogin from "@/pages/DoctorLogin";
import DoctorRegister from "@/pages/DoctorRegister";
import DoctorDashboard from "@/pages/DoctorDashboard";
import DoctorChildRecord from "@/pages/DoctorChildRecord";

function RequireRole({ role, children }) {
  const s = getSession();
  if (!s || s.role !== role) return <Navigate to={role === "parent" ? "/parent/login" : "/doctor/login"} replace />;
  return children;
}

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Toaster richColors position="top-center" />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/select-role" element={<SelectRole />} />

          <Route path="/parent/login" element={<ParentLogin />} />
          <Route path="/parent/register" element={<ParentRegister />} />
          <Route path="/parent/dashboard" element={<RequireRole role="parent"><ParentDashboard /></RequireRole>} />
          <Route path="/parent/add-child" element={<RequireRole role="parent"><AddChild /></RequireRole>} />
          <Route path="/parent/child/:id" element={<RequireRole role="parent"><ChildProfile /></RequireRole>} />
          <Route path="/parent/notifications" element={<RequireRole role="parent"><ParentNotifications /></RequireRole>} />

          <Route path="/doctor/login" element={<DoctorLogin />} />
          <Route path="/doctor/register" element={<DoctorRegister />} />
          <Route path="/doctor/dashboard" element={<RequireRole role="doctor"><DoctorDashboard /></RequireRole>} />
          <Route path="/doctor/child/:id" element={<RequireRole role="doctor"><DoctorChildRecord /></RequireRole>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
