/* eslint-disable camelcase */
const AWS = require('aws-sdk')
AWS.config.update({ region: 'ap-southeast-2' })

const knex = require('knex')({
  client: 'mysql',
  connection: {
    ssl: {
      rejectUnauthorized: false
    },
    host: process.env.DB_ENDPOINT,
    user: 'tstdb01',
    password: 'tstdb01234',
    database: 'mydb'
  }
})

const read = () => {
  return knex('products').select()
}

const create = (payload) => {
  const { user_id, product_id, quantity } = payload
  return knex('cart').insert({ user_id, product_id, quantity })
}

// eslint-disable-next-line no-unused-vars
exports.handler = async (event, context, callback) => {
  console.log('Received event:', JSON.stringify(event, null, 2))
  let body
  let payload
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, PUT, GET, OPTIONS',
    'Access-Control-Allow-Headers': '*',
    'Cache-Control': 'max-age=0, no-store, must-revalidate',
    Pragma: 'no-cache',
    Expires: 0
  }
  const data = {
    multiValueHeaders: {},
    isBase64Encoded: false,
    statusCode: 200,
    headers,
    body: ''
  }
  try {
    switch (event.httpMethod) {
      case 'GET':
        body = await read()// GET product
        break
      case 'POST':
        payload = event.body
        await create({ user_id: 1, product_id: payload.id, quantity: payload.price })
        body = `Succesfully posting ${payload}` // POST /product
        break
      case 'OPTIONS':
        context.done(undefined, data)
        break
      default:
        throw new Error(`Unsupported route: "${event.httpMethod}"`)
    }

    console.log(body)
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        message: `Successfully finished operation: "${event.httpMethod}"`,
        body
      })
    }
  } catch (e) {
    console.error(e)
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: 'Failed to perform operation.',
        errorMsg: e.message
      })
    }
  }
}
