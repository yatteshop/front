const fetch = require('node-fetch')

const handler = async function (event, context) {
  if (!context.clientContext && !context.clientContext.identity) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        msg: 'No identity instance detected. Did you enable it?',
      }),
    }
  }
  const { identity, user } = context.clientContext
  try {
    let response
    if (event.httpMethod === 'GET') {
      response = await fetch('https://yatteshop.pythonanywhere.com/api/shop/orders/')
    } else if (event.httpMethod === 'POST') {
      const body = JSON.parse(event.body)
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      }
      response = await fetch('https://yatteshop.pythonanywhere.com/api/shop/orders/', options)
    } else {
      return { statusCode: 405, body: 'Method not allowed' }
    }
    if (!response.ok) {
      return { statusCode: response.status, body: response.statusText }
    }
    const data = await response.json()

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    }
  } catch (error) {
    console.log(error)
    return {
      statusCode: 500,
      body: JSON.stringify({ msg: error.message }),
    }
  }
}

module.exports = { handler }

