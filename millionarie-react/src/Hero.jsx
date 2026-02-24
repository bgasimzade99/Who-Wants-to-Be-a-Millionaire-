import { NavLink } from "react-router-dom";
import { useState } from "react";

export default function Hero() {
  const [open, setOpen] = useState(false);

  return (
    <nav>
      <h1><NavLink to="/">MySite</NavLink></h1>

      <ul>
        <li><NavLink to="/">Home</NavLink></li>
        <li><NavLink to="/about">About</NavLink></li>
        <li><NavLink to="/contact">Contact</NavLink></li>
      </ul>

      <div className="menu-btn" onClick={() => setOpen(!open)}>☰</div>

      {open && (
        <div className="mobile-menu">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/about">About</NavLink>
          <NavLink to="/contact">Contact</NavLink>
        </div>
      )}
    </nav>
  );
}