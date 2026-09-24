import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import { PublicLayout } from "./components/PublicLayout"
import { StoreProvider, useStore } from "./context/Store"
import { pathForRole } from "./data/logic"
import CitizenDashboard from "./pages/CitizenDashboard"
import Features from "./pages/Features"
import GovernmentDashboard from "./pages/GovernmentDashboard"
import Home from "./pages/Home"
import Impact from "./pages/Impact"
import IndustryDashboard from "./pages/IndustryDashboard"
import LiveDemo from "./pages/LiveDemo"
import NotFound from "./pages/NotFound"
import PoseTrack from "./pages/PoseTrack"
import Register from "./pages/Register"
import ReportProblem from "./pages/ReportProblem"
import SignIn from "./pages/SignIn"
import UniversityDashboard from "./pages/UniversityDashboard"

function Guard({ roles, children }) {
  const { user } = useStore()
  if (!user) return <Navigate to="/sign-in" replace />
  if (roles && !roles.includes(user.role)) return <Navigate to={pathForRole(user.role)} replace />
  return children
}

function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/features" element={<Features />} />
        <Route path="/impact" element={<Impact />} />
        <Route path="/live-demo" element={<LiveDemo />} />
        <Route path="/pose" element={<PoseTrack />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/register" element={<Register />} />
        <Route path="/report" element={<ReportProblem />} />
      </Route>
      <Route path="/citizen" element={<Guard roles={["citizen", "community"]}><CitizenDashboard /></Guard>} />
      <Route path="/government" element={<Guard roles={["government"]}><GovernmentDashboard /></Guard>} />
      <Route path="/university" element={<Guard roles={["university"]}><UniversityDashboard /></Guard>} />
      <Route path="/industry" element={<Guard roles={["industry"]}><IndustryDashboard /></Guard>} />
      <Route path="*" element={<PublicLayout><NotFound /></PublicLayout>} />
    </Routes>
  )
}

export default function App() {
  return (
    <StoreProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </StoreProvider>
  )
}
