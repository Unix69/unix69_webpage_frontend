import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Home from "./Home";
import Profile from "./components/Profile";
import Repositories from "./components/Repositories";
import Languages from "./components/Languages";
import Lessons from "./components/Lessons";

function Layout() {
  const location = useLocation();

  let currentPageName = "Home";

  switch (location.pathname) {
    case "/":
      currentPageName = "Home";
      break;
    case "/profile":
      currentPageName = "Profile";
      break;
    case "/repositories":
      currentPageName = "Repositories";
      break;
    case "/languages":
      currentPageName = "Languages";
      break;
    default:
      currentPageName = "Unknown";
  }

  return (
    <>
      <Header currentPageName={currentPageName} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/repositories" element={<Repositories />} />
        <Route path="/languages" element={<Languages />} />
        <Route path="/activities" element={<Activities />} />
        <Route path="/activities/lessons" element={<Lessons />} />
      </Routes>\
      <Footer />
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <BrowserRouter>
    <Layout />
  </BrowserRouter>
);