import { useNavigate } from "react-router"

export default function BanArt() {
  
  const navigate = useNavigate()
  
  const diriger = ()=>{
    navigate("/produits")
  }
  
  return(
    <div className="BanArticle">
      <div className="BanArticleA">
        <p>Promo <span>-60%</span></p>
        <img src="redmi.png" alt="nix" className="BanArticleAphoneA" />
        <img src="tyl.png" alt="phonse" className="BanArticleAphone" />
        <img src="mika3.png" alt="toto" className="totos"/>
      </div>
      <div className="BanArticleB" onClick={diriger}>
        <a href="#">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <p>voir plus</p>
        </a>
      </div>
    </div>
  )
}