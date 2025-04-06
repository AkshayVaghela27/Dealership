import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import Appstate from './Context/Appstate';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from "./Context/ThemeContext"; 


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
  <Appstate>
  <ThemeProvider>
    <App />
  </ThemeProvider>
  </Appstate>
  </BrowserRouter>
);

