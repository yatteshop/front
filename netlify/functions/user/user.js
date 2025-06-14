const fetch = require('node-fetch')

exports.handler = async function(event) {
  
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }


  const authHeader = event.headers.authorization || event.headers.Authorization
  if (!authHeader) {
    return { statusCode: 401, body: 'Missing Authorization header' }
  }

  try {
    
    const response = await fetch(
      'https://yatteshop.pythonanywhere.com/api/auth/user/',
      { headers: { Authorization: authHeader } }
    )

    if (!response.ok) {
      
      const text = await response.text()
      return { statusCode: response.status, body: text }
    }

    const userData = await response.json()
    return {
      statusCode: 200,
      body: JSON.stringify(userData),
    }
  } catch (error) {
    console.error('Error in Netlify function get-user:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({ msg: error.message }),
    }
  }
}
