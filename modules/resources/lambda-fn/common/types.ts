interface PostPayload {
  user_id: number,
  product_id: number,
  quantity: number
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