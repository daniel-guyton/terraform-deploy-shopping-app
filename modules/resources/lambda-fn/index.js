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


exports.handler = async (event, content, callback) => {
   try {
       console.log('connection successful')
       const body = await knex('products').select();
       const res = {
           statusCode: 200,
           body: JSON.stringify(body)
       }
       return res
   } catch (err) {
       console.log(err)
   }

}