import fp from "fastify-plugin";
import FastifySocketIo from "fastify-socket.io"

export default fp(function plugin(fastify, opts, done) {

    fastify.register(FastifySocketIo, {
        path: '/socket',
        cors: '*:*'
    })

    done()

})