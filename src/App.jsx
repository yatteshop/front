import {Routes, Route} from "react-router"
import Accueil from "./pages/Accueil"
import Produits from "./pages/Produits"
import Detail from "./pages/Detail"
import { CartProvider } from "./contextes/CartContext"
import { ModalProvider } from "./contextes/ModalContext"
import { AuthProvider } from "./contextes/AuthContext"
import Cart from "./pages/Cart"
import Order from "./pages/Order"
import Client from "./pages/Client"
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { OrderModalProvider } from "./contextes/OrderModalContext"


export default function App(){
  return(
    <AuthProvider>
    <CartProvider>
    <ModalProvider>
    <OrderModalProvider>
    <Routes>
      <Route path="/" element={<Accueil />} />
      <Route path="/produits" element={<Produits />} />
      <Route path="/:produitId" element={<Detail />} />
      <Route path="/panier" element={<Cart />} />
      
      <Route path="/commande" element={<Order />} />
      <Route path="/client" element={<Client />} />
      
    </Routes>
    </OrderModalProvider>
    </ModalProvider>
    </CartProvider>
    <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        theme="light"
        style={{ zIndex: 999999999 }}
      />
    </AuthProvider>
  )
}