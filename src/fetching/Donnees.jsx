export const Donnees = async ()=>{
  const res = await fetch("http://localhost:8000/api/shop/produit/")
  const response = await res.json()
  
  return response
}