/* eslint-disable camelcase */
import * as AWS from "aws-sdk";
import { Context, APIGatewayProxyCallback, APIGatewayEvent } from "aws-lambda";
import {
  getProducts,
  updateOrInsertCartItem,
  getCartIdByUserId,
  getCartItemsByCartId,
  getProductsByProductId,
  deleteProductFromCart,
  updateCartQuantity,
} from "./db-queries";

AWS.config.update({ region: "ap-southeast-2" });

// eslint-disable-next-line no-unused-vars
export const handler = async (
  event: APIGatewayEvent,
  context: Context,
  callback: APIGatewayProxyCallback
) => {
  console.log("Received event:", JSON.stringify(event, null, 2));
  let body;
  let payload;
  const headers = {
    "Access-Control-Allow-Origin": "http://localhost:4200",
    "Access-Control-Allow-Methods": "POST, PATCH, GET, HEAD, OPTIONS, DELETE",
    "Access-Control-Allow-Headers":
      "Access-Control-Allow-Headers , X-Requested-With, Content-Type, Authorization, X-Auth-Token, Origin",
    "Cache-Control": "max-age=0, no-store, must-revalidate",
    Pragma: "no-cache",
    Expires: 0,
  };
  const data = {
    statusCode: 200,
    multiValueHeaders: {},
    isBase64Encoded: false,
    ...headers,
    body: "",
  };
  try {
    switch (true) {
      case event.httpMethod == "OPTIONS":
        await callback(null, data);
        break;
      case event.httpMethod == "GET" && event.path == "/getUserCart":
        const cartId = await getCartIdByUserId(2);
        const listOfCartItems = await getCartItemsByCartId(cartId[0].id);
        body = await Promise.all(
          listOfCartItems.map(async (item) => ({
            product: Object.assign.apply(
              {},
              await getProductsByProductId(item.product_id)
            ),
            qty: item.qty,
          }))
        );
        break;
      case event.httpMethod == "PUT":
        const { qty, product } = JSON.parse(event.body);
        await updateCartQuantity(qty, product);
        body = `Sucessfully updated quantity to ${event.body}`;
        break;
      case event.httpMethod == "DELETE":
        // const {product_id} = event.pathParameters.proxy
        await deleteProductFromCart(parseInt(event.pathParameters.proxy));
        body = `Sucessfully delete product with id of ${event.pathParameters.proxy}`;
        break;
      case event.httpMethod == "POST":
        if (event.body !== null && event.body !== undefined) {
          payload = JSON.parse(event.body);
        }
        await updateOrInsertCartItem({
          cart_id: 1,
          product_id: payload.id,
          qty: 1,
        });
        body = `Succesfully posting ${event.body}`; // POST /product
        break;

      case event.httpMethod == "GET":
        body = await getProducts(); // GET product
        break;

      default:
        throw new Error(`Unsupported route: "${event.httpMethod}"`);
    }
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        message: `Successfully finished operation: "${event.httpMethod}"`,
        body,
      }),
    };
  } catch (e) {
    console.error(e);
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({
        message: "Failed to perform operation.",
        errorMsg: e.message,
      }),
    };
  }
};
