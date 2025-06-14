const fetch = require('node-fetch')

exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }
  
  try {
    const credentials = JSON.parse(event.body)
    const response = await fetch(
      'https://yatteshop.pythonanywhere.com/api/auth/login/',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      }
    )
    
    if (!response.ok) {
      const errText = await response.text()
      return { statusCode: response.status, body: errText }
    }

    const data = await response.json()
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    }
  } catch (error) {
    console.error(error)
    return {
      statusCode: 500,
      body: JSON.stringify({ msg: error.message }),
    }
  }
}