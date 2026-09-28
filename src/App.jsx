import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/home";
import JoinQueue from "./components/JoinQueue";
import Login from "./components/Login";
import Signup from "./components/Signup";
import RoleSelection from "./components/RoleSelection";
import ViewQueue from "./components/ViewQueue";
import OwnerLogin from "./components/OwnerLogin";
import OwnerSignup from "./components/OwnerSignup";
import OwnerDashboard from "./components/OwnerDashboard";
import CreateQueue from "./components/CreateQueue";
import CustomerDashboard from "./components/CustomerDashboard";
import QueueStatus from "./components/QueueStatus";
import OwnerProfile from "./components/OwnerProfile";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/" element={<RoleSelection />} />

        <Route path="/join-queue" element={<JoinQueue />} />
        <Route path="/view-queue/:id" element={<ViewQueue />} />
        <Route path="/queue-status/:id" element={<QueueStatus />} />

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route path="/owner-login" element={<OwnerLogin />} />
        <Route path="/owner-signup" element={<OwnerSignup />} />
        <Route path="/owner-dashboard" element={<OwnerDashboard />} />
        <Route path="/owner-profile" element={<OwnerProfile />} />

        <Route path="/customer-dashboard" element={<CustomerDashboard />} />
        <Route path="/create-queue" element={<CreateQueue />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
