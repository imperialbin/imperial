import "./App.css";

import Helmet from "react-helmet";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { loader } from "@monaco-editor/react";

import Index from "./app/index";
import Document from "./app/Document";
import Discord from "./app/Auth/Discord";
import GitHub from "./app/Auth/GitHub";

import { IMPERIAL_THEME } from "./components/editorthemes/Imperial";
import ModalManager from "./components/ModalManager";
import NotificationsManager from "./components/NotificationsManager";
import { useUser } from "./hooks/useUser";
import FourOFour from "./app/404";

function App() {
  useUser();
  useEffect(() => {
    loader.init().then(async (monaco) => {
      monaco.editor.defineTheme("imperial", IMPERIAL_THEME);
    });
  }, []);

  return (
    <BrowserRouter>
      <NotificationsManager />
      <ModalManager />
      <Helmet defaultTitle="IMPERIAL" titleTemplate="%s • IMPERIAL" />

      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/:document_id" element={<Document />} />

        {/* Auth routes */}
        <Route path="auth">
          <Route path="discord" element={<Discord />} />
          <Route path="github" element={<GitHub />} />
        </Route>

        <Route path="*" element={<FourOFour />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
