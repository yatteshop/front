const fetch = require('node-fetch')

exports.handler = async function (event, context) {
  if (!context.clientContext || !context.clientContext.identity) {
    return {
      statusCode: 500,
      body: JSON.stringify({ msg: 'No identity instance detected. Did you enable it?' }),
    }
  }
  
  try {
    let response
    if (event.httpMethod === 'GET') {
      response = await fetch('https://yatteshop.pythonanywhere.com/api/shop/order-items/')
    } else if (event.httpMethod === 'POST') {
      const body = JSON.parse(event.body)
      response = await fetch('https://yatteshop.pythonanywhere.com/api/shop/order-items/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
    } else {
      return { statusCode: 405, body: 'Method not allowed' }
    }
    
    
    if (!response.ok) {
      return { statusCode: response.status, body: response.statusText }
    }

    const data = await response.json()
    return { statusCode: 200, body: JSON.stringify(data) }

  } catch (error) {
    console.log(error)
    return { statusCode: 500, body: JSON.stringify({ msg: error.message }) }
  }
}