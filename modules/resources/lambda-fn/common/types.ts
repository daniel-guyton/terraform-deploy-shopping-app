interface PostPayload {
  cart_id: number,
  product_id: number,
  qty: number
}

interface Event {
  httpMethod: string
  body: {
    id?: number
  }
}

export {
  PostPayload,
  Event
}