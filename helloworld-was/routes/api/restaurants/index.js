'use strict'

module.exports = async function (fastify, opts) {
  fastify.get('/', async function (req, reply) {
    const database = this.mongo.client.db("baedal");
    const restaurants = database.collection("restaurants");
    const result = await restaurants.find({}).toArray();
    
    reply.code(200).send(result)
  })
}