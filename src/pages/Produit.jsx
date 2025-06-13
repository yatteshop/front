import Cookies from "js-cookie";
import { useState } from "react";
import { useNavigate } from "react-router";
import { useCart } from "../contextes/CartContext";
import { useAuth } from "../contextes/AuthContext"; 
import Notif from "../composants/Notif";
import "./Produit.css";
import {useEffect} from "react"

function formatAmountWithSeparators(amount) {
  return amount.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export default function Produit({ name, price, image, id, logo, pribarrer, description, prix_livraison }) {
  const [notifications, setNotifications] = useState([]);
  const { dispatch, panier, saveGuestCart } = useCart();
  const { autentifier } = useAuth(); 
  const navigate = useNavigate();

  const ajouterNotification = () => {
    const newNotif = {
      id: Date.now(),
      message: "✓ un article a été ajouté au panier"
    };
    setNotifications((prev) => [...prev, newNotif]);

    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== newNotif.id));
    }, 4000);
  };



const handleBuy = async () => {
  const item = { id, name, price, image, logo, pribarrer, description, prix_livraison };

  // 1. Ajout dans le state (store global)
 dispatch({ type: "ADD", payload: item });
 

  
  // 2. Si l'utilisateur n'est pas connecté → stockage dans le cookie
  if (!autentifier) {
    let panierLocal = [];

    try {
      const cookie = Cookies.get("guest_cart");
      panierLocal = cookie ? JSON.parse(cookie) : [];
    } catch {
      panierLocal = [];
    }

    const exist = panierLocal.find(p => p.id === item.id);
    if (exist) {
      panierLocal = panierLocal.map(p =>
        p.id === item.id ? { ...p, quantiter: p.quantiter + 1 } : p
      );
      
    } else {
      panierLocal.push({ ...item, quantiter: 1 });
      
    }
    
    //saveGuestCart(panierLocal)
    

  } else {
    // 3. Utilisateur connecté → ajout côté backend
    const token = Cookies.get("token");
    console.log("Token actuel :", token);


    if (token) {
      try {
        const response = await fetch("http://localhost:8000/api/shop/cart-items/", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Token ${token}`,
  },
  body: JSON.stringify({
    product: item.id,
    quantity: item.quantiter || 1,
  }),
});


        if (!response.ok) {
          const errorData = await response.json();
          console.error("Erreur API panier :", errorData);
        }
      } catch (error) {
        console.error("Erreur réseau panier :", error.message);
      }
    } else {
      console.warn("Token manquant, utilisateur connecté mais token absent.");
    }
  }

  ajouterNotification();
};

  return (
    <div className="BuyWrapper">
      <div className="Buybtn" onClick={handleBuy}>Acheter</div>

      <div className="BuyCard" onClick={() => navigate(`/${id}`)}>
        <div className="BuySecond">
          <img src={image} alt={name} className="BuyImg" />
          <p className="Bescription">{description}</p>
          <p className="BuyPrice">{formatAmountWithSeparators(price)} FCFA</p>
          <p className="pribarrer">{formatAmountWithSeparators(pribarrer)} FCFA</p>
          <div className="Buyfirst">
            <img src={logo} alt={name} className="BuyLogo" />
            <p>{Math.floor((price - pribarrer) / pribarrer * 100)}%</p>
          </div>
        </div>
      </div>

      
      <div className="notif_col">
        {notifications.map((notif) => (
          <Notif key={notif.id} message={notif.message} />
        ))}
      </div>
    </div>
  );
}


