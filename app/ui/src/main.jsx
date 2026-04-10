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
import ControlPanel from "./pages/admins/ControlPanel.jsx";
import ControlPanelOverview from "./pages/admins/ControlPanelOverview.jsx";
import ControlPanelUsersList from "./pages/admins/users/ControlPanelUsersList.jsx";
import ControlPanelProblemsList from "./pages/admins/problems/ControlPanelProblemsList.jsx";
import ControlPanelContestsList from "./pages/admins/contests/ControlPanelContestsList.jsx";
import ControlPanelProblemDetails from "./pages/admins/problems/ControlPanelProblemDetails.jsx";
import ControlPanelProblemCreate from "./pages/admins/problems/ControlPanelProblemCreate.jsx";
import ControlPanelProblemUpdate from "./pages/admins/problems/ControlPanelProblemUpdate.jsx";
import ControlPanelProblemDelete from "./pages/admins/problems/ControlPanelProblemDelete.jsx";
import ControlPanelUserDetails from "./pages/admins/users/ControlPanelUserDetails.jsx";
import ControlPanelUserUpdate from "./pages/admins/users/ControlPanelUserUpdate.jsx";
import ControlPanelUserDelete from "./pages/admins/users/ControlPanelUserDelete.jsx";
import ControlPanelUserCreate from "./pages/admins/users/ControlPanelUserCreate.jsx";
import ControlPanelContestDelete from "./pages/admins/contests/ControlPanelContestDelete.jsx";
import ControlPanelContestDetails from "./pages/admins/contests/ControlPanelContestDetails.jsx";
import ControlPanelContestCreate from "./pages/admins/contests/ControlPanelContestCreate.jsx";
import ControlPanelContestUpdate from "./pages/admins/contests/ControlPanelContestUpdate.jsx";
import ContactUs from "./pages/ContactUs.jsx";
import PrivacyPolicy from "./pages/PrivacyPolicy.jsx";
import TNC from "./pages/TNC.jsx";


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
          <Route path="contact-us" element={<ContactUs />} />
          <Route path="privacy-policy" element={<PrivacyPolicy />} />
          <Route path="tnc" element={<TNC />} />

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

          <Route path="admins">
            <Route index element={<ControlPanel />} />

            <Route path="control-panel">
              <Route index element={<ControlPanelOverview />} />
              <Route path="overview" element={<ControlPanelOverview />} />


              <Route path="users">
                <Route index element={<ControlPanelUsersList />} />
                <Route path="all" element={<ControlPanelUsersList />} />
                <Route path=":userId" element={<ControlPanelUserDetails />} />
                <Route path="create" element={<ControlPanelUserCreate />} />
                <Route path="update/:userId" element={<ControlPanelUserUpdate />} />
                <Route path="delete/:userId" element={<ControlPanelUserDelete />} />
              </Route>


              <Route path="problems">
                <Route index element={<ControlPanelProblemsList />} />
                <Route path="all" element={<ControlPanelProblemsList />} />
                <Route path=":slug" element={<ControlPanelProblemDetails />} />
                <Route path="create" element={<ControlPanelProblemCreate />} />
                <Route path="update/:slug" element={<ControlPanelProblemUpdate />} />
                <Route path="delete/:slug" element={<ControlPanelProblemDelete />} />
              </Route>


              <Route path="contests">
                <Route index element={<ControlPanelContestsList />} />
                <Route path="all" element={<ControlPanelContestsList />} />
                <Route path=":slug" element={<ControlPanelContestDetails />} />
                <Route path="create" element={<ControlPanelContestCreate />} />
                <Route path="update/:slug" element={<ControlPanelContestUpdate />} />
                <Route path="delete/:slug" element={<ControlPanelContestDelete />} />
              </Route>


            </Route>

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
