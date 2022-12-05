import "./App.css";

import Helmet from "react-helmet";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./app/index";
import Document from "./app/document";
import { useEffect } from "react";
import { loader } from "@monaco-editor/react";
import { IMPERIAL_THEME } from "./components/editorthemes/Imperial";
import ModalManager from "./components/ModalManager";
import NotificationsManager from "./components/NotificationsManager";
import { useUser } from "./hooks/useUser";

function App() {
  const user = useUser();
  useEffect(() => {
    // fetch me

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
      </Routes>
    </BrowserRouter>
  );
}

export default App;
