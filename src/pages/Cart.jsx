import {useCart} from "../contextes/CartContext"
import "./Cart.css"
import { Plus } from 'lucide-react'
import { Trash2 } from "lucide-react"
import { Minus } from "lucide-react"
import { Search} from "lucide-react"
import {User} from "lucide-react"
import {ShoppingBasket} from "lucide-react"
import { Phone } from "lucide-react"
import {Check} from "lucide-react"
import {ShoppingCart} from "lucide-react"
import Burger from "../composants/Burger"

import {useState, useEffect} from "react"
import {Donnees} from "../fetching/Donnees"
import Cookies from "js-cookie";
import { useModal} from "../contextes/ModalContext"
import OrderModal from "../composants/OrderModal"
import { useNavigate, Navigate } from "react-router"

import { useCategoryStore } from "../stores/Store"
import { Data } from "../fetching/Data"

import { useAuth } from "../contextes/AuthContext"; 
import  Modal from "../composants/Modal"

import { useOrderModal } from "../contextes/OrderModalContext"



function lepoint(amount) {
  return amount.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}



function tronquerSansCouperMot(texte, maxLongueur = 25) {
  if (texte.length <= maxLongueur) return texte;

  const mots = texte.split(" ");
  let resultat = "";

  for (let mot of mots) {
    if ((resultat + " " + mot).trim().length > maxLongueur) break;
    resultat += (resultat ? " " : "") + mot;
  }

  return resultat.trim();
}




export default function Cart(){
  
  const {autentifier, setAutentifier} = useAuth()
  
  const { showModal, setShowModal } = useModal()
  
  const { showOrderModal, setShowOrderModal } = useOrderModal()
  
  
  
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
  
  
  
  
  
  const navigate = useNavigate()
  
  const { panier, handlePlus, handleMoins, removeItem, fetchPanier, dispatch } = useCart();
  
  
  const token = Cookies.get("token")
  
  const [suggestions, setSuggestions] = useState([]);
  
  const somme = panier.reduce((som,item)=>som+item.price*item.quantiter, 0)
  
  
  
  const order = ()=>{
    if(token){
      navigate("/commande")
    }else{
      setShowOrderModal(true)
    }
  }
  
  const handleUser = ()=>{
    if(token){
      navigate("/client")
    }else{
      setShowModal(true)
    }
  }
  
  
  useEffect(()=>{
    const fetchSuggestions = async () => {
      try {
        const produits = await Donnees();
        const panierIds = panier.map(item => item.id);

        const produitsDisponibles = produits.filter(p => !panierIds.includes(p.id));

        const melanges = produitsDisponibles.sort(() => 0.5 - Math.random());
        const douze = melanges.slice(0, 12);

        setSuggestions(douze);
      } catch (e) {
        console.error("Erreur chargement suggestions :", e);
      }
    };

    fetchSuggestions();
  },[panier])
  
  useEffect(()=>{
    fetchPanier();
  },[])
 
 const detailDirect = (id)=>{
    navigate(`/${id}`)
  }
  
  const displayModal = ()=>{
    setShowModal(!showModal)
  }
 
 
 const goClient = ()=>{
   navigate('/client')
  } 
  
  return(
    <div>
    <div className="cartWrapp">
    <div className="detailMenu">
        
        <div className="DetailTitle">
          <Burger displayMenu={displayMenu} />
          <p onClick={()=>navigate("/")}>YATTE</p>
          <div className="Basket"><ShoppingBasket style={{
            width:"20px",
            height:"20px",
            color:"white",
            display:"flex",
          }} /></div>
        </div>
        <div className="DetailRightTitle">
          <div className="DetailSearch Cartperso">
            <Search className="SearchCart"  />
          </div>
          <div className="user">
            <User onClick={handleUser} />
          </div>
          <div className="cart">
            <ShoppingCart />
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
          
        </div>
      </div> 
      
      
      
    <div className="Cart">
      <p className="CartTitlea">Résumé du panier</p>
      <div className="totalCart">
        <p>Montant total</p><p className="Cartprix"><strong>{lepoint(somme)}</strong> FCFA</p>
      </div>
      <div className="subtotalCart"><Check className="Check" style={{
        marginRight:"3px",
      }} /><p> Expédition rapide et sécurisée – service client dédié à chaque commande</p></div>
      <div className="CartBody">
        <p className="CartTitlea">panier ({panier.length})</p>
        {panier.length > 0 ? 
        <div>
        {panier.map(item=>{
          return(
            <div key={item.id} className="WrapTenu">
              <div className="CARTIMG">
                <img src={item.image} alt={item.name} />
              </div>
              <div className="CartDes">
                <div>
                  <p>{item.description.split(" ").slice(0, 16).join(" ")}</p>
                </div>
                <div className="CartCount">
                  <div className="wraTrash" onClick={()=>removeItem(item.id)}><Trash2 className="Trash" /><span  style={{
                    fontSize:"0.82rem",
                    color:"rgb(255,100,0)",
                    fontFamily:'Times New Roman'
                  }}>Supprimer</span></div>
                  <div className="countSite"><Plus className="Plus" onClick={()=>handlePlus(item.id)} />{item.quantiter}    <Minus className="Minus" onClick={()=>handleMoins(item.id)} /></div>
                </div>
              <div style={{
                fontSize:"0.92rem"
              }}><strong>{lepoint(item.quantiter*item.price)}</strong> FCFA</div>
              </div>
            </div>
            
          )
        })}</div> : <div className="empty">
          <img src="anew.png" alt="anew" />
          <p>votre panier est vide</p>
        </div>}
      </div>
    </div> 
    <div className="CartOrder">
      {panier.length > 0 ? 
      <div className="wrapperCartOrder">
        <Phone className="CartPhone" />
        <div className="btnCartOrder" onClick={order}>Commander ({lepoint( somme )} FCFA)
        </div>
      </div> :
      <div className="shopsuite">
        <p onClick={()=>navigate("/produits")}>
          continuer votre shopping
        </p>
        
      </div>
      
      }
    </div>
    
  <div>
      {suggestions.length > 0 && (
  <div className="suggestions-section">
    <p className="CartTitlea" style={{color:"#0d0d82"}}>Vous aimerez aussi :</p>
    <div className="suggestions-list">
      {suggestions.map(prod => (
        <div key={prod.id} className="suggestion-item">
          <img src={prod.image} alt={prod.name} style={{
            maxWidth:"128px",
            maxHeight:"128px"
          }} onClick={()=>detailDirect(prod.id)} />
          <p>{tronquerSansCouperMot(prod.description)}</p>
          <p>{lepoint(prod.price)} FCFA</p>
        </div>
      ))}
    </div>
    
  </div>
)}
  
    </div>
    </div>
    {showModal ? <Modal /> : ""}
    {showOrderModal ? <OrderModal /> : ""}
    </div> 
  )
}



