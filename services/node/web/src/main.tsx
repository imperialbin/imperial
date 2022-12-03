import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import App from "./App";
import { store } from "./state";
import { SkeletonTheme } from "react-loading-skeleton";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <SkeletonTheme baseColor="red" highlightColor="blue">
        <App />
      </SkeletonTheme>
    </Provider>
  </React.StrictMode>
);
