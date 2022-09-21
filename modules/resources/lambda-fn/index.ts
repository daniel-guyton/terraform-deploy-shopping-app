/* eslint-disable camelcase */
import Knex from 'knex'
import * as AWS from 'aws-sdk'
import {Event, PostPayload} from './common/types'
import { Context, APIGatewayProxyCallback } from 'aws-lambda';

const knex = Knex({
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

AWS.config.update({ region: 'ap-southeast-2' })

const getProducts = () => {
  return knex('products')
  .select()
}

const updateOrInsertCartItem = (payload: PostPayload) => {
  return knex('cart_item')
  .insert(payload)
  .onConflict('product_id')
  .merge({qty: knex.raw('?? + 1', 'qty')})
}

const getCartIdByUserId = (user_id) => {
  return knex('cart')
  .join('users', 'users.id', 'cart.user_id')
  .where('user_id', user_id)
  .select('cart.id')
}

const getCartItemsByCartId = (cart_id) => {
  return knex('cart_item')
  .select('*')
  .where('cart_id', cart_id)
}

const getProductsByProductId = (product_id) => {
  return knex('products')
    .select()
    .where('id', product_id)
}

// eslint-disable-next-line no-unused-vars
export const handler = async (event: any, context: Context, callback: APIGatewayProxyCallback) => {
  console.log('Received event:', JSON.stringify(event, null, 2))
  let body;
  let payload;
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
    switch (true) {
      case event.httpMethod == 'POST':
        if(event.body !== null && event.body !== undefined) {
          payload = JSON.parse(event.body)
        }
        await updateOrInsertCartItem({ cart_id: 1, product_id: payload.id, qty: 1 })
        body = `Succesfully posting ${event.body}` // POST /product
        break
      case event.httpMethod == 'GET' && event.path == '/getUserCart':
        const cartId = await getCartIdByUserId(2)
        const listOfCartItems = await getCartItemsByCartId(cartId[0].id)
        body = await Promise.all(listOfCartItems.map(async (item) => ({
          product: Object.assign.apply({}, await getProductsByProductId(item.product_id)),
          qty: item.qty
        })))
        break
      case event.httpMethod == 'GET':
        body = await getProducts()// GET product
        break
      case event.httpMethod == 'OPTIONS':
        context.done(undefined, data)
        break
      default:
        throw new Error(`Unsupported route: "${event.httpMethod}"`)
    }

    console.log(event.body)
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
