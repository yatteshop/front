import {useState, useEffect} from "react"
import "./Feu.css"
import { Donnees } from "../fetching/Donnees"
import {useNavigate} from "react-router"

function lepoint(amount) {
  return amount.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}



export default function Feu(){
  
  const navigate = useNavigate()
  
  const [art, setArt] = useState([])
  
  useEffect(()=>{
    const fetchdata = async()=>{
      const res = await Donnees()
      setArt(res)
    }
    fetchdata()
  },[])
  
  const directDetail = (id)=>{
    navigate(`/${id}`)
  }
  
  
  const data = art.slice(6,19)
  return(
    <div className="Categoriels">
      {data.map(item=>{
        return(
          <div key={item.id} className="CategorieItemls" onClick={()=>directDetail(item.id)}>
            <div className="CategoriePricels">
              {item.name}
            </div>
              <img src={item.image} alt={item.name} />
            <div className="CategorieNomls">
              {lepoint(item.price)}f
            </div>
          </div>
        )
      })}
    </div>
  )
}