import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { RestaurantProvider } from "./context/RestaurantContext";

// if (window.location.pathname.startsWith("/admin")) {
//   import("bootstrap/dist/css/bootstrap.min.css");
// }

createRoot(document.getElementById('root')).render(
    <BrowserRouter>
    <RestaurantProvider>

        <App />
  

  </RestaurantProvider>
    </BrowserRouter>
)
