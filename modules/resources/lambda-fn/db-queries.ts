import Knex from 'knex'

import { PostPayload } from './common/types'

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


const updateCartQuantity = (quantity: number, product_id: number) => {
  (quantity)
  console.log(product_id)
  return knex('cart_item')
  .update('qty', quantity)
  .where('product_id', product_id)
}

const deleteProductFromCart = (id: number) => {
  console.log(id)
  return knex('cart_item')
  .where('product_id', id)
  .del()
}

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

export {
  getProducts,
  updateOrInsertCartItem,
  getCartIdByUserId,
  getCartItemsByCartId,
  getProductsByProductId,
  deleteProductFromCart,
  updateCartQuantity
}