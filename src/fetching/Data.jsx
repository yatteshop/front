export const Data = async ()=>{
  const res = await fetch("http://localhost:8000/api/shop/categorie/")
  const response = await res.json()
  
  return response
}


