import "./Detail.css"
import {useParams} from "react-router"
import {Donnees} from "../fetching/Donnees"
import {useState, useEffect} from "react"
import Menu from "../composants/Menu"
import Burger from "../composants/Burger"
import { User } from 'lucide-react';
import { ShoppingCart } from "lucide-react"
import { Search } from "lucide-react"
import {ShoppingBasket} from "lucide-react"
import SearchBar from "../composants/SearchBar"
import {useCart} from "../contextes/CartContext"
import { useAuth } from "../contextes/AuthContext"; 
import Notif from "../composants/Notif";

import { useCategoryStore } from "../stores/Store"
import { Data } from "../fetching/Data"
import { useNavigate } from "react-router"
import Cookies from "js-cookie";

import { useModal} from "../contextes/ModalContext"
import  Modal from "../composants/Modal"



function formatAmountWithSeparators(amount) {

  return amount.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

}





export default function Detail(){
  
  const {autentifier, setAutentifier} = useAuth()
  
  const { showModal, setShowModal } = useModal()
  
  const [notifications, setNotifications] = useState([]);
  
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
  
  //debutcat
  
  const navigate = useNavigate()
  
  const [cat, setCat] = useState([])
  const [showMenu, setShowMenu] = useState(false)
  
  
  const displayMenu = ()=>{
    setShowMenu(!showMenu)
  }
  
  const {selectedCategory, setSelectedCategory} = useCategoryStore()
  
  useEffect(()=>{
    const fetchdata = async ()=>{
      const data = await Data()
      setCat(data)
    }
    fetchdata()
  },[]) 
  
  const choixCategorie = (nom)=>{
    setSelectedCategory(nom)
    navigate("/produits")
  }
  
  //finCat
  
  const {panier, dispatch} = useCart()
  
  const { produitId } = useParams()
  
  const [data, setData] = useState([])
  
  const [show , setShow] = useState(false)
  
  useEffect(() => {
    const fetchdata = async () => {
      const res = await Donnees()
      setData(res)
    }
    fetchdata()
  }, [])
  
  const displaySearch = ()=>{
    setShow(!show)
  }
  const gohome = ()=>{
    navigate("/")
  }
  
  const handleBuy = async (item) => {
  
 dispatch({ type: "ADD", payload: item });
 

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

const displayModal = ()=>{
    setShowModal(!showModal)
  }
 
 
 const goClient = ()=>{
   navigate('/client')
 } 



  
  return(
      <>
      <div className="detailMenu">
        
        <div className="DetailTitle">
          <Burger displayMenu={displayMenu} />
          <p onClick={gohome}>YATTE</p>
          <div className="Basket"><ShoppingBasket style={{
            width:"20px",
            height:"20px",
            color:"white",
            display:"flex",
          }} /></div>
        </div>
        <div className="DetailRightTitle">
          <div className="DetailSearch">
            <Search onClick={displaySearch} />
          </div>
          <div className="user">
            {autentifier ? <div className="authUser"><User onClick={goClient} /></div> : <User onClick={displayModal} />}
          </div>
          <div className="cart">
            <ShoppingCart onClick={()=>navigate("/panier")} />
            <p className={panier.length >0 ? "cartP" : ""}>{panier.length >0 ? panier.length : ""}</p>
          </div>
          
          <div className={showMenu ? "MenuVisible" : "MenuHide"}>
        <div className="MenuVisibleTitle" onClick={()=>setSelectedCategory(null)}>
          Nos Catégories
        </div>
        <div className="visiblewcat">
          {cat.map(item=>{
            return(
              <div key={item.id} className="itemvisible" onClick={()=>choixCategorie(item)}>
                <p>{item.name}</p>
              </div>
            )
          })}
        </div>
      </div>
      {showModal ? <Modal /> : ""}    
        </div>
      </div>
      <div className="detailWrapper">
        <div className={show ? "visible" : "cache"}>
        <SearchBar />
        </div>
        <br />
        {data.map(item=>item.id === (+produitId) ? <div key={item.id}>
          <div className="DetailH">
            <img src={item.logo} alt={item.name} />
            <p>{Math.floor((item.price-item.pribarrer)/item.pribarrer*100)}%</p>
          </div>
          <div className="conImg">
            <div className="imgDetailWrapper">
            <img src={item.image} alt={item.name} />
            <img src={item.image2} alt={item.image2} />
            <img src={item.image3} alt={item.image3} />
          </div>
          </div>
          <p className="DetailPrice">{formatAmountWithSeparators(item.price)} FCFA</p>
          <p className="Detailprix">{formatAmountWithSeparators(item.pribarrer)} FCFA</p>
          <p className="detaildes">{item.description}</p>
          <div className="btnDetail" onClick={()=>handleBuy(item)}>
        ajouter au panier
      </div>
        </div> : "")}
      </div>
      
      </>
  )
}