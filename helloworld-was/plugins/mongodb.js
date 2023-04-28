'use strict'

const fp = require('fastify-plugin')

const { MONGO_HOST, MONGO_PORT, MONGO_USERNAME, MONGO_PASSWORD } = process.env

module.exports = fp(async function (fastify, opts) {
  const url = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOST}:${MONGO_PORT}/?authMechanism=DEFAULT`  
  console.log(url)

  fastify.register(require('@fastify/mongodb'), {
    forceClose: true,
    url: url
  })
})