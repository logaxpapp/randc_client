// index.js
import React from 'react';
import { createRoot } from 'react-dom/client'; // import createRoot
import { Provider } from 'react-redux';
import './index.css';
import App from './App';
import { store } from './app/store';
import { AuthProvider } from './context/AuthContext';
import { ContextProvider } from './context/ContextProvider';
import { ThemeProvider } from './components/themes/ThemeContext';
import { registerLicense } from '@syncfusion/ej2-base';
import { StateProvider } from './context/StateContext';



registerLicense('Ngo9BigBOggjHTQxAR8/V1NAaF1cWmhIfEx1RHxQdld5ZFRHallYTnNWUj0eQnxTdEFjW31ccXFURWJfUEFwXw==');

const container = document.getElementById('root');
const root = createRoot(container); // create a root

root.render(
 
    <Provider store={store}>
      <ContextProvider>
        <AuthProvider>
        <StateProvider>
          <ThemeProvider>
            <App />
          </ThemeProvider>
        </StateProvider>
        </AuthProvider>
      </ContextProvider>
    </Provider>
 
);