import "./App.css";

import Helmet from "react-helmet";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./app/index";
import { useEffect } from "react";
import { loader } from "@monaco-editor/react";
import { Tomorrow } from "./components/editorthemes/Tomorrow";
import ModalManager from "./components/ModalManager";

function App() {
  useEffect(() => {
    // fetch me

    loader.init().then(async (monaco) => {
      monaco.editor.defineTheme("Tomorrow", Tomorrow);
    });
  }, []);

  return (
    <>
      <ModalManager />
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
