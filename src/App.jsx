import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./Layout/Layout";
import Login from "./pages/0.Auth/Login";
import Dashboard from "./pages/1.Dashboard/Dashboard";
import MyProfile from "./pages/2.MyProfile/MyProfile";

import DirectMessages from "./pages/4.DirectMessages/DirectMessages";
import Notifications from "./pages/5.Notifications/Notifications";
import Settings from "./pages/6.Settings/Settings";
import ProtectedRoutes from "./routes/ProtectedRoutes";
import OrdinaryRoutes from "./routes/OrdinaryRoutes";
import ResearchRequests from "./pages/3.ResearchRequests/ResearchRequests";
import SubmitResearchRequest from "./pages/3.ResearchRequests/SubmitResearchRequest";
import Evaluations from "./pages/7.Evaluations/Evaluations";

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoutes>
              <Layout />
            </ProtectedRoutes>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<MyProfile />} />
          <Route path="/requests" element={<ResearchRequests />} />
          <Route path="/requests/submit" element={<SubmitResearchRequest />} />
          <Route path="/evaluations" element={<Evaluations />} />
          <Route path="/direct-messages" element={<DirectMessages />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
        
        <Route element={<OrdinaryRoutes />}>
          <Route path="/login" element={<Login />} />
        </Route>
        
        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
