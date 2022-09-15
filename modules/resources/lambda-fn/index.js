const AWS = require('aws-sdk')
AWS.config.update({region: 'ap-southeast-2'})

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
  const {user_id, product_id, quantity} = payload
  return knex('cart').insert({user_id, product_id, quantity})
}

// eslint-disable-next-line no-unused-vars
exports.handler = async (event, content, callback) => {
  console.log('Received event:', JSON.stringify(event, null, 2));
  let body;
  let payload;
  try {
      switch (event.httpMethod) {
          case "GET":
              body = await read()// GET product
              break;
          case "POST":
              payload = event.body;
              await create(payload)
              body = `Succesfully posting ${payload}`; // POST /product
              break;
          default:
              throw new Error(`Unsupported route: "${event.httpMethod}"`);
      }

      console.log(body);
      return {
          statusCode: 200,
          headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS"
          },
          body: JSON.stringify({
          message: `Successfully finished operation: "${event.httpMethod}"`,
          body: body
          })
      };

  } catch (e) {
      console.error(e);
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: "Failed to perform operation.",
          errorMsg: e.message
        })
      };
  }
}