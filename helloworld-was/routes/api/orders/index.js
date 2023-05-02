'use strict'

const { ObjectId } = require("@fastify/mongodb");

module.exports = async function (fastify, opts) {
  fastify.get('/', async function (req, reply) {
    const database = this.mongo.client.db("baedal");
    const orders = database.collection("order");
    const result = await orders.find({}).toArray();

    reply.code(200).send(result)
  })
    
  fastify.post('/', async function (req, reply) {
    const ObjectId = this.mongo.ObjectId;
    const restaurants = this.mongo.client.db("baedal").collection("restaurants");
    const restaurant = await restaurants.findOne({ _id: new ObjectId(req.body.restaurantId) }
                                               , {projection: { _id: 0, name: 1, address: 1 },});
    
    const orders = this.mongo.client.db("baedal").collection("order");
    const order = {
        _id: new ObjectId(),
        "deliveryInfo": {
          "status":"PREPAIRING",
          "assignedCourier":"박배송",
          "estimatedDeleveryTime":40
        },
        "consumer_id": new ObjectId(),
        "restaurant": {
            "name": restaurant.name,
            "address": restaurant.address,
        },
        "orderedMenu":req.body.menu
    }
    
    const result = await orders.insertOne(order)
    order._id = result.insertedId; 
       
    reply.code(200).send(order)
    
  })

  fastify.get('/:id', async function (request, reply) {
    try {
      const orderId = new ObjectId(request.params.id);

      const client = fastify.mongo.client
      const database = client.db("baedal")
      const order = database.collection("order")

      const query = { _id: orderId };

      const result = await order.findOne(query);

      if(result != null) {
        reply
          .code(200)
          .header('Content-type', 'application/json')
          .send(result)
      } else {
        reply
          .code(404)
          .header('Content-type', 'application/json')
          .send("존재하지 않는 주문입니다.")
      }
    } catch {
      reply
        .code(500)
        .header('Content-type', 'application/json')
        .send("오류가 발생했습니다.")
    }
  })
}