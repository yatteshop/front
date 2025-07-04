import "./BanArticle.css"
import {useNavigate} from "react-router"
export default function BanArticle() {
  
  const navigate = useNavigate()
  
  const diriger = ()=>{
    navigate("/produits")
  }
  
  return(
    <div className="BanArticle">
      <div className="BanArticleA">
        <p>Promo <span>-40%</span></p>
        <img src="infinix.png" alt="nix" className="BanArticleAphoneA" />
        <img src="phones.png" alt="phonse" className="BanArticleAphone" />
        <img src="rmb.png" alt="toto" className="totos"/>
      </div>
      <div className="BanArticleB" onClick={diriger}>
        <a href="#">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <p>voir plus...</p>
        </a>
      </div>
    </div>
  )
}