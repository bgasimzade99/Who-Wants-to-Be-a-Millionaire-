import "./App.css";
import Hero from "./Hero";
import Game from "./Game";
import About from "./about";

import { Routes, Route } from "react-router-dom";

export default function App() {
  return (
    <>
      <Hero />
      <div className="layout">
        <Routes>
          <Route path="/" element={<Game />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
    </>
  );
}