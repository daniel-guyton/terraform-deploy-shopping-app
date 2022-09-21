/* eslint-disable camelcase */

import * as AWS from 'aws-sdk'
import {PostPayload} from './common/types'
import { Context, APIGatewayProxyCallback, APIGatewayEvent } from 'aws-lambda';
import {getProducts, updateOrInsertCartItem, getCartIdByUserId, getCartItemsByCartId, getProductsByProductId} from './db'

AWS.config.update({ region: 'ap-southeast-2' })

// eslint-disable-next-line no-unused-vars
export const handler = async (event: APIGatewayEvent, context: Context, callback: APIGatewayProxyCallback) => {
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
