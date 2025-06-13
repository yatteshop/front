import {useState, useEffect} from "react"
import "./SixOffre.css"
import { Donnees } from "../fetching/Donnees"
import {useNavigate} from "react-router"


function lepoint(amount) {

  return amount.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

}

export default function SixOffre(){
  
  const navigate = useNavigate()
  
  const [art, setArt] = useState([])
  useEffect(()=>{
    const fetchdata = async ()=>{
      const res = await Donnees()
      setArt(res)
    }
    fetchdata()
  },[])
  
  const data = art.slice(4,10)
  
  const detailDirect = (id)=>{
    navigate(`/${id}`)
  }
  
  return(
    <div className="SixOffre">
      {data.map(item=>{
        return(
        <div key={item.id} className="SixOffreItem" onClick={()=>detailDirect(item.id)}>
          <p>{item.name}</p>
          <img src={item.image} alt={item.name} />
          <p className="sixPrice">{lepoint(item.price)}f</p>
        </div>
        )
      })}
    </div>
  )
}