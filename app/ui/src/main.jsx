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


ReactDOM.createRoot(root).render(
  <WebSocketProvider>

    <BrowserRouter>
      <Routes>
        <Route index element={<App />} />

        <Route path="login" element={<Login />} />
        <Route path="signup" element={<SignUp />} />

        <Route path="problems">
          <Route index element={<ProblemsList />} />
          <Route path=":slug" element={<ProblemEditor />} />
        </Route>

        <Route path="*" element={<PageNotFound />} />

      </Routes>

    </BrowserRouter>
  </WebSocketProvider>
  ,
);
