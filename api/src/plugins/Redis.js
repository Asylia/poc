import fp from "fastify-plugin";
import FastifyRedis from '@fastify/redis'

export default fp(async function plugin(fastify, opts) {

    await fastify.register(FastifyRedis, {
        url: process.env.REDIS,
    })
    fastify.decorate('redis', fastify.redis)


})