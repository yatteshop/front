const fetch = require('node-fetch')

exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }

  try {
    const newUser = JSON.parse(event.body)
    const response = await fetch(
      'https://yatteshop.pythonanywhere.com/api/auth/registration/',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      }
    )
    
    if (!response.ok) {
      const errText = await response.text()
      return { statusCode: response.status, body: errText }
    }
    
    const data = await response.json()
    return {
      statusCode: 201,
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