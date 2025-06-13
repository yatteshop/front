import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import {
  ShoppingBasket,
  ShoppingCart,
  User,
  Search,
  BookOpen,
  MoveLeft,
  AlignJustify
} from "lucide-react";
import Burger from "../composants/Burger";
import "./Client.css";
import { useCart} from "../contextes/CartContext"
import { useAuth } from "../contextes/AuthContext"
import { useNavigate, Navigate } from "react-router"




const truncateAfterGarantie = (text) => {
  const keyword = "garantie 12 mois";
  const idx = text.toLowerCase().indexOf(keyword); 
  if (idx === -1) {
    return text;
  }
  
  const endIndex = idx + keyword.length;
  
  return text.slice(0, endIndex) + "...";
};




const getStatusLabel = (status) => {
  switch (status) {
    case "P":
      return "En cours de livraison";
    case "C":
      return "Livré";
    case "F":
      return "Échoué";
    default:
      return "Inconnu";
  }
};

export default function Client() {
  
  const token = Cookies.get("token")
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [allItems, setAllItems] = useState([]); 
  const [itemsByOrder, setItemsByOrder] = useState({}); 
  
  const { dispatch } = useCart();
  const {setAutentifier} = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      const token = Cookies.get("token");
      if (!token) return;

      try {
        
        const userRes = await fetch("http://localhost:8000/api/auth/user/", {
          headers: { Authorization: `Token ${token}` },
        });
        if (userRes.ok) {
          const userData = await userRes.json();
          setUser(userData);
        }

        
        const orderRes = await fetch("http://localhost:8000/api/shop/orders/", {
          headers: { Authorization: `Token ${token}` },
        });
        let orderData = [];
        if (orderRes.ok) {
          orderData = await orderRes.json();
          setOrders(orderData);
        }

        
        const itemsRes = await fetch(
          "http://localhost:8000/api/shop/order-items/",
          {
            headers: { Authorization: `Token ${token}` },
          }
        );
        if (itemsRes.ok) {
          const itemsData = await itemsRes.json();
          setAllItems(itemsData);

          
          const grouping = {};
          
          for (const item of itemsData) {
            const oid = item.order; 
            if (!grouping[oid]) grouping[oid] = [];
            grouping[oid].push(item);
          }
          setItemsByOrder(grouping);
        }
      } catch (err) {
        console.error("Erreur de récupération :", err);
      }
    };

    fetchData();
  }, []);
  
  
 const deconnexion = ()=>{
    Cookies.remove("token");
    Cookies.remove("autentifier");
    setAutentifier(false);
    dispatch({ type: "CLEAR" });
    navigate("/")
  }
  
  if (!token) {
    return <Navigate to="/produits" replace />;
  }
  
  
  

  return (
    <div className="ClientOrder">
      
      <div className="detailMenu">
        <div className="DetailTitle">
          <AlignJustify className="AlignJustify" />
          <p onClick={()=>navigate("/")}>YATTE</p>
          <div className="Basket">
            <ShoppingBasket
              style={{ width: 20, height: 20, color: "white" }}
            />
          </div>
        </div>
        <div className="DetailRightTitle">
          <div className="DetailSearch cltSearch">
            <Search />
          </div>
          <div className="user cltUser">
            <User />
          </div>
          <div className="cart cltCart">
            <ShoppingCart />
          </div>
        </div>
      </div>

      
      {user && (
        <div className="idClient">
          Bonjour, <span>{user.last_name}</span>&nbsp;
          <span>{user.first_name}</span>
          <br />
          <p>{user.email}</p>
        </div>
      )}

      <div className="compteYatte">
        <span>votre compte yatte</span>

  

  <label htmlFor="toggle-orders" className="toggleHistorique">
    Historique
  </label>
      </div>

    <input type="checkbox" id="toggle-orders" hidden />
      <div className="contentCompte2">
        {orders.length === 0 ? (
          
          <div className="clientWrapper">
            <div className="clientTitle">Vos commandes</div>
            <div className="clientNotif">
              <BookOpen className="BookOpen" />
              <p>vous n'avez pas encore de commande</p>
            </div>
            
          </div>
        ) : (
          
          <>
            <div className="clientTitle">Vos commandes</div>

            {orders.map((order) => {
              
              const itemsForThisOrder = itemsByOrder[order.id] || [];
              return (
                <div key={order.id} className="orderCard">
                  <div className="clientHeader" style={{ fontSize: "0.75rem" }}>
                    <p>Commande n°{order.id}</p>
                    <p>
                      <span>Total :</span>{" "}
                      {order.total_price.toLocaleString()} FCFA
                    </p>
                  </div>

                  
                  <OrderItems items={itemsForThisOrder} />

                  <p className="clientLabel">
                    <span>Statut de la commande :</span>{" "}
                    {getStatusLabel(order.status)}
                  </p>
                </div>
              );
            })}
            
          </>
        )}
      </div>
      <div className="wrapperclientBTN">
        <div className="clientBTN">
          <MoveLeft className="MoveLeft" onClick={()=>navigate("/produits")} />
          <p>continuer votre shopping</p>
          </div>
      </div>
      
      <div className="btnlogout" onClick={deconnexion}>se deconnecter</div>
    </div>
  );
}


function OrderItems({ items }) {
  return (
    <div className="itemsList">
      {items.map((item, index) => (
        <div
          key={item.id}
          className="itemCard"
          style={{
            borderBottom:
              index !== items.length - 1 ? "1px solid #e0e0e0" : "none",
            paddingBottom: "10px",
            marginBottom: "10px",
          }}
        >
          {item.image ? (
            <img src={item.image} alt={item.description || item.name} />
          ) : (
            <div className="placeholder-img">Pas d’image</div>
          )}

          <div className="itemInfo">
            {item.description ? (
              <p>{truncateAfterGarantie(item.description)}</p>
            ) : (
              <p className="no-description">Pas de description disponible</p>
            )}
            <p>Quantité : {item.quantity}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
