import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./Layout/Layout";
import Login from "./pages/0.Auth/Login";
import Dashboard from "./pages/1.Dashboard/Dashboard";
import MyProfile from "./pages/2.MyProfile/MyProfile";
import Progress from "./pages/3.Progress/Progress";
import DirectMessages from "./pages/4.DirectMessages/DirectMessages";
import Notifications from "./pages/5.Notifications/Notifications";
import Settings from "./pages/6.Settings/Settings";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" />
            ) : (
              <Login setIsAuthenticated={setIsAuthenticated} />
            )
          }
        />
        <Route element={<Layout setIsAuthenticated={setIsAuthenticated} />}> {/* Protected routes */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<MyProfile />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/direct-messages" element={<DirectMessages />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
