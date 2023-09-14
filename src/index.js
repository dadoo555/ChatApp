import React from "react"
import ReactDOM from "react-dom";
import {createRoot} from "react-dom/client"
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from './App';


  
  const AppConfig = () => {
    return (
    <React.StrictMode>
        <BrowserRouter>
           <App />
        </BrowserRouter>
     </React.StrictMode>
    );
  }; 


  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(<AppConfig />);