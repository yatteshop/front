export const Donnees = async ()=>{
  const res = await fetch("/.netlify/functions/produits")
  const response = await res.json()
  
  return response
}