import { useState } from "react";

import Helmet from "react-helmet";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./app/index";

import "./App.css";

function App() {
  return (
    <>
      <BrowserRouter>
        <Helmet defaultTitle="IMPERIAL" titleTemplate="%s • IMPERIAL" />

        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/2" element={<div>:3</div>} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
