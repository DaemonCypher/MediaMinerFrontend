import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../firebase/auth";
import "./Navbar.css";

import NavbarRight from "./NavbarRight";

import { Squash as Hamburger } from "hamburger-react";
import { AnimatePresence, motion } from "framer-motion";
import { useClickAway } from "react-use";

import {
  mobileMenuVariants,
  mobileMenuItemVariants,
} from "../assets/animation/mobileMenueAnimations";

export default function Navbar() {
  const { user, logout, signInWithGooglePopup } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const menuRef = useRef(null);
  const mobileRef = useRef(null);

  const from = location.state?.from?.pathname || location.state?.from || "/";

  function closeAllDropdowns() {
    setMobileOpen(false);
    setMenuOpen(false);
  }

  // Right side Profile Drop Down
  function toggleUserMenu() {
    setMobileOpen(false);
    setMenuOpen((v) => !v);
  }

  // Close desktop dropdown on outside click
  useEffect(() => {
    function onDocClick(e) {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target)) setMenuOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  // Close mobile menu on outside click
  useClickAway(mobileRef, () => setMobileOpen(false));

  useEffect(() => {
    closeAllDropdowns();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  async function handleLogin() {
    await signInWithGooglePopup();
    closeAllDropdowns();
    navigate(from, { replace: true });
  }

  async function handleLogout() {
    await logout();
    closeAllDropdowns();
    navigate("/", { replace: true });
  }

  return (
    <nav className="navbar" ref={mobileRef}>
      <div className="navbar__container">
        <div className="navbar__bar">
          {/* Mobile hamburger */}
          <div className="navbar__mobileWrap">
            <div className="navbar__hamburgerBtn">
              <Hamburger toggled={mobileOpen}
                toggle={(next) => { setMenuOpen(false); setMobileOpen(next); }}
                size={20}
                label="Toggle mobile menu"
              />
            </div>
          </div>

          {/* Brand + desktop links */}
          <div className="navbar__brandRow">
            <Link to="/" className="navbar__brand" onClick={closeAllDropdowns}>
              MediaMiner
            </Link>

            <div className="navbar__links">
              <Link to="/downloads" className="navbar__link" onClick={closeAllDropdowns}>
                Downloads
              </Link>
              <Link to="/jobs" className="navbar__link" onClick={closeAllDropdowns}>
                Jobs
              </Link>
              <Link to="/logs" className="navbar__link" onClick={closeAllDropdowns}>
                Logs
              </Link>
            </div>
          </div>

          {/* Right side user menu */}
          <NavbarRight
            user={user}
            menuOpen={menuOpen}
            menuRef={menuRef}
            toggleUserMenu={toggleUserMenu}
            handleLogin={handleLogin}
            handleLogout={handleLogout}
            mobileMenuVariants={mobileMenuVariants}
            mobileMenuItemVariants={mobileMenuItemVariants}
            closeAllDropdowns={closeAllDropdowns}
          />
        </div>
      </div>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div className="navbar__mobilePanel" variants={mobileMenuVariants} initial="hidden" animate="visible" exit="exit">
            <div className="navbar__container">
              <div className="navbar__mobilePanelInner">
                {[
                  { to: "/downloads", label: "Downloads" },
                  { to: "/jobs", label: "Jobs" },
                ].map((item) => (
                  <motion.div key={item.to} variants={mobileMenuItemVariants}>
                    <Link to={item.to} className="navbar__mobileLink" onClick={closeAllDropdowns}>
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
