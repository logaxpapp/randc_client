import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { store, persistor } from "./app/store";
import { PersistGate } from "redux-persist/integration/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AppInitializer from "./components/AppInitializer";
import AppRouter from "./router";
import { ThemeProvider } from "./context/ThemeProvider";

import "./global.css";

// Create your queryClient
const queryClient = new QueryClient();

// Mount your app inside #root
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <AppInitializer />
            <AppRouter />
          </ThemeProvider>
        </QueryClientProvider>
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
