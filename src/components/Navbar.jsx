// src/components/Navbar.jsx
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Moon, Sun, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";
import { translations } from "../data/translations";

const navLinks = [
  { to: "/works", key: "navWorks" },
  { to: "/thoughts", key: "navThoughts" },
  { to: "/about", key: "navAbout" },
  { to: "/contact", key: "navContact" },
];

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage } = useLanguage();
  const t = translations[language];
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  useEffect(() => {
    closeMenu();
  }, [location.pathname]);

  return (
    <header className="fixed top-0 left-0 w-full z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto">
        <div className="backdrop-blur-xl bg-white/30 dark:bg-white/10 border border-white/20 dark:border-white/10 rounded-2xl px-5 py-3.5 flex items-center justify-between shadow-lg">
          <Link
            to="/"
            onClick={closeMenu}
            className="text-base font-semibold tracking-tight"
          >
            Sina Dalaei
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm">
            {navLinks.map(({ to, key }) => (
              <Link
                key={to}
                to={to}
                className={`transition-colors duration-200 ${
                  location.pathname.startsWith(to)
                    ? "text-neutral-900 dark:text-white font-medium"
                    : "text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
                }`}
              >
                {t[key]}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {/* ─── Language Button
            <button
              onClick={toggleLanguage}
              aria-label="Toggle language"
              className="w-9 h-9 rounded-xl bg-white/30 dark:bg-white/10 backdrop-blur-md flex items-center justify-center text-sm"
            >
              {language === "en" ? "FA" : "EN"}
            </button>
─── */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="w-9 h-9 rounded-xl bg-white/30 dark:bg-white/10 backdrop-blur-md flex items-center justify-center"
            >
              {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
            </button>

            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              className="md:hidden w-9 h-9 rounded-xl bg-white/30 dark:bg-white/10 backdrop-blur-md flex items-center justify-center"
            >
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.nav
              initial={{ opacity: 0, y: -8, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -8, height: 0 }}
              transition={{ duration: 0.25 }}
              className="md:hidden overflow-hidden mt-2 rounded-2xl backdrop-blur-xl bg-white/30 dark:bg-white/10 border border-white/20 dark:border-white/10 shadow-lg"
            >
              <div className="flex flex-col p-2">
                {navLinks.map(({ to, key }) => (
                  <Link
                    key={to}
                    to={to}
                    onClick={closeMenu}
                    className={`
                      px-4 py-3 rounded-xl text-sm font-medium transition-colors
                      ${
                        location.pathname.startsWith(to)
                          ? "bg-black/5 dark:bg-white/10"
                          : "hover:bg-black/5 dark:hover:bg-white/10"
                      }
                    `}
                  >
                    {t[key]}
                  </Link>
                ))}
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
