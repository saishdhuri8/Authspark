import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from "react-router";
import UserContextProvider from './ContextProviders/UserContextProvider.jsx';

createRoot(document.getElementById('root')).render(

    <UserContextProvider>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </UserContextProvider>

)
