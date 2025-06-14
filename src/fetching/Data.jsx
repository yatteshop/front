export const Data = async ()=>{
  const res = await fetch("/.netlify/functions/categories")
  const response = await res.json()
  
  return response
}


