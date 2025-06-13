import "./SearchBar.css"
import { useNavigate } from "react-router"
import {useSearchStore} from "../stores/Store"


export default function SearchBar(){
  
  const navigate = useNavigate()
  
  const {searchQuery, setSearchQuery} = useSearchStore()
  
 const handleSubmit = (e)=>{
   e.preventDefault()
   navigate("/produits")
 }
 
 const handleChange = (e) =>{
   setSearchQuery(e.target.value)
 } 
  
  return(
    <div className="Search">
      <form onSubmit={handleSubmit}>
        <input type="search" value={searchQuery}
            onChange={handleChange} placeholder="Cherchez sur YATTE" />
        <img src="search.png" alt="serch"/>
      </form>
    </div>
    
  )
}