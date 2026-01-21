import {Elysia} from "elysia";



const api = new Elysia({prefix: '/api'})
.get('/status', {
  return: {
    message: 'working ig'
  }
})