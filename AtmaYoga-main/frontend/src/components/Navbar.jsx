import { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; 
import "../styles/Navbar.css";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const closeMenuAndNavigate = (path) => {
    setIsOpen(false);
    document.body.style.overflow = "auto";
    navigate(path);
    setDropdownOpen(false);
  };

  const handleToggle = () => {
    setIsOpen((prev) => {
      const next = !prev;
      document.body.style.overflow = next ? "hidden" : "auto";
      return next;
    });
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  return (
    <nav className="navbar">
      <div className="container">

        <div
          className={`menu-toggle ${isOpen ? "active" : ""}`}
          onClick={handleToggle}
        >
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </div>

        <div className="logo">
          <Link to="/">AtmaYoga</Link>
        </div>

        <Link to={user ? "/account" : "/login"} className="mobile-profile-icon">
          <i className="fas fa-user"></i>
        </Link>

        <ul className={`nav-menu ${isOpen ? "active" : ""}`}>
          <li><NavLink onClick={() => closeMenuAndNavigate("/")} to="/">Home</NavLink></li>
          <li><NavLink onClick={() => closeMenuAndNavigate("/about")} to="/about">About</NavLink></li>
          <li><NavLink onClick={() => closeMenuAndNavigate("/asanas")} to="/asanas">Asanas</NavLink></li>
          <li><NavLink onClick={() => closeMenuAndNavigate("/form")} to="/form">Recommendations</NavLink></li>
          <li><NavLink onClick={() => closeMenuAndNavigate("/team")} to="/team">Our Team</NavLink></li>
          <li><NavLink onClick={() => closeMenuAndNavigate("/asanalens")} to="/asanalens">AsanaLens</NavLink></li>

          {/* ✅ CORRECT LIVE POSE ENTRY */}
          <li>
            <NavLink
              onClick={() => closeMenuAndNavigate("/start")}
              to="/start"
            >
              Live Pose
            </NavLink>
          </li>

          <li className="nav-user" ref={dropdownRef}>
            {user ? (
              <div
                className="user-dropdown"
                onClick={() => setDropdownOpen((prev) => !prev)}
              >
                Hi, {user.name}
                {dropdownOpen && (
                  <ul className="dropdown-menu">
                    <li onClick={() => closeMenuAndNavigate("/account")}>My Account</li>
                    <li onClick={() => { logout(); closeMenuAndNavigate("/"); }}>
                      Logout
                    </li>
                  </ul>
                )}
              </div>
            ) : (
              <NavLink
                onClick={() => closeMenuAndNavigate("/login")}
                to="/login"
              >
                Login
              </NavLink>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
