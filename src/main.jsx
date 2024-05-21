import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './App.jsx'
import { app } from "./services/firebaseConfig";
import { getAuth } from 'firebase/auth';

export const auth = getAuth(app);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
