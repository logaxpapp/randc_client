// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store, persistor } from './app/store'; // <--- import persistor
import { PersistGate } from 'redux-persist/integration/react'; // <--- import PersistGate
import AppRouter from './router';
import './global.css';
import { ThemeProvider } from './context/ThemeProvider';
import AppInitializer from './components/AppInitializer';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      {/* PersistGate delays rendering until state is rehydrated */}
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider>
          <AppInitializer />
          <AppRouter />
        </ThemeProvider>
      </PersistGate>
    </Provider>
  </React.StrictMode>,
);
