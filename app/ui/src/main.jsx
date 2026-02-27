import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";

// Home Page is App.jsx i.e. the Landing Page
import App from './App.jsx';
import './index.css';

import ProblemsList from "./pages/problem/ProblemsList";
import SignUp from "./pages/auth/signup/SignUp";
import Login from "./pages/auth/login/Login";
import ProblemEditor from "./pages/problem/ProblemEditor";
import PageNotFound from "./pages/PageNotFound/PageNotFound";
import { WebSocketProvider } from "./contexts/WebSocketContext.jsx";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import LogOut from "./pages/auth/logout/LogOut.jsx";
import UserDashboard from "./pages/users/UserDashboard.jsx";

// For Toast Notification & Sorry if You were Expecting some other package here for this use case :)
import { Toaster } from 'sonner';
import About from "./pages/about/About.jsx";
import Careers from "./pages/careers/Careers.jsx";
import ContestsList from "./pages/contests/ContestsList.jsx";
import ContestDetails from "./pages/contests/ContestDetails.jsx";
import ContentStart from "./pages/contests/ContestStart.jsx";
import ContestProblemEditor from "./pages/contests/ContestProblemEditor.jsx";


ReactDOM.createRoot(root).render(
  <WebSocketProvider>

    <AuthProvider>


      <BrowserRouter>
        {/* Toaster Component Required to Place Here to Show Toast Notifications Across the Frontend */}
        {/* Toaster Compoent - Starts Here */}
        <Toaster />
        {/* Toaster Compoent - Ends Here */}

        <Routes>
          <Route index element={<App />} />

          <Route path="about" element={<About />} />
          <Route path="careers" element={<Careers />} />

          <Route path="login" element={<Login />} />
          <Route path="signup" element={<SignUp />} />
          <Route path="logout" element={<LogOut />} />

          <Route path="problems">
            <Route index element={<ProblemsList />} />
            <Route path="all" element={<ProblemsList />} />
            <Route path=":slug" element={<ProblemEditor />} />

          </Route>

          <Route path="users">
            <Route index element={<UserDashboard />} />
            <Route path="dashboard" element={<UserDashboard />} />

          </Route>

          <Route path="contests">
            <Route index element={<ContestsList />} />
            <Route path="all" element={<ContestsList />} />
            <Route path=":slug" element={<ContestDetails />} />
            <Route path="start/:slug" element={<ContentStart />} />
            <Route path=":contestSlug/editor/:problemIndex" element={<ContestProblemEditor />} />

          </Route> 



          <Route path="*" element={<PageNotFound />} />

        </Routes>
      </BrowserRouter>

    </AuthProvider>

  </WebSocketProvider>
  ,
);
