import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import ShopContextProvider from './context/ShopContext.jsx'
import AuthContextProvider from './context/AuthContext.jsx'
import ProductContextProvider from './context/ProductContext.jsx'

createRoot(document.getElementById('root')).render(

    <BrowserRouter>
        <AuthContextProvider>
            <ProductContextProvider>
                <ShopContextProvider>
                    <App />
                </ShopContextProvider>
            </ProductContextProvider>
        </AuthContextProvider>
    </BrowserRouter>
)

