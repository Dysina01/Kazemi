// src/App.jsx — نسخه آپدیت شده با routes جدید
import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Works from "./pages/Works";
import Project from "./pages/Project";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Thoughts from "./pages/Thoughts";
import Post from "./pages/Post";
import Navbar from "./components/Navbar";
import useLenis from "./hooks/useLenis";
import { useLanguage } from "./context/LanguageContext";
import Cursor from "./components/Cursor";
import PageTransition from "./components/PageTransition";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";

export default function App() {
  const { language } = useLanguage();
  useLenis();
  return (
    <div
      dir={language === "fa" ? "rtl" : "ltr"}
      className="
        bg-white
        text-[#1d1d1f]
        dark:bg-black
        dark:text-[#f5f5f7]
        min-h-screen
        transition-colors
        duration-500
      "
    >
      <ScrollToTop />

      <Cursor />
      <Navbar />
      <PageTransition>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/works" element={<Works />} />
          <Route path="/project/:id" element={<Project />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/thoughts" element={<Thoughts />} />
          <Route path="/thoughts/:id" element={<Post />} />
        </Routes>
      </PageTransition>
      <Footer />
    </div>
  );
}
