import Cookies from "js-cookie"
import Burger from "./Burger"
import {useNavigate} from "react-router"
import "./Menu.css"
import { User } from 'lucide-react';
import { ShoppingCart } from "lucide-react"
import { Search } from "lucide-react"
import { ShoppingBasket } from "lucide-react"
import {useState, useEffect} from "react"
import SearchBar from "./SearchBar"
import { Data } from "../fetching/Data"
import { useCategoryStore } from "../stores/Store"
import { useCart} from "../contextes/CartContext"
import { useModal } from "../contextes/ModalContext"
import { useAuth } from "../contextes/AuthContext"
import Client from "../pages/Client"


export default function Menu(){
  
  const [commande, setCommande] = useState()
  
  const [user, setUser] = useState([])
  
  const { fetchPanier } = useCart();
  
  const { dispatch } = useCart();
  
  const {autentifier, setAutentifier} = useAuth()
  
  
  const { showModal, setShowModal } = useModal()
  
  const {panier} = useCart()
  
  const [cat, setCat] = useState([])
  
  const [showMenu, setShowMenu] = useState(false)
  
  
  const displayMenu = ()=>{
    setShowMenu(!showMenu)
  }
  
  const {selectedCategory, setSelectedCategory} = useCategoryStore()
  
  const navigate = useNavigate()
  
  
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
  
  const displayModal = ()=>{
    setShowModal(!showModal)
  }
  
  const goCart = ()=>{
    navigate("/panier")
  }
  
  const deconnexion = ()=>{
    Cookies.remove("token");
    Cookies.remove("autentifier");
    setAutentifier(false);
    dispatch({ type: "CLEAR" });
  }
  
const takeUser = async ()=>{
   const token = Cookies.get("token")
   const res = await fetch("http://localhost:8000/api/auth/user/", {
      headers: {
        Authorization: `Token ${token}`,
      },
    });
    
   const response = await res.json()
   setUser(response)
 } 
 
 
 const goClient = ()=>{
   navigate('/client')
 }

  
  
  useEffect(() => {
    if (autentifier) {
      fetchPanier();
      takeUser();
    }
  }, [autentifier]);
  
  
  return(
    <div className="MenuContainer">
    <div className="MenuWrapper">
    <div className="Menu">
      <div className="MenuLeft">
        <Burger displayMenu={displayMenu} />
        <div className="title" onClick={()=>navigate("/")}>
          yatte<div className="Basket"><ShoppingBasket style={{
            width:"20px",
            height:"20px",
            color:"white",
            display:"flex",
          }} /></div>
        </div>
      </div>
      <div className="MenuRight">
        <div className="user">
          {autentifier ? <div className="authUser"><User onClick={goClient} /></div> : <User onClick={displayModal} />}
        </div>
        <div className="cart" onClick={goCart}>
          <ShoppingCart />
          <p className={panier.length >0 ? "cartP" : ""}>{panier.length >0 ? panier.length : ""}</p>
        </div>
      </div>
      <div className={showMenu ? "MenuVidible" : "MenuHide"}>
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
    </div>
      <SearchBar />
    </div>
    <div className="fmenu">
      <span className="phoneSms">Commandez par appel au : </span>  <span className="phoneNumber" >07-67-74-37-32</span>
    </div>
    </div>
  )
}