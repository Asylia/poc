import AppRoutes from './routes/Routes.js'

export default async function AppJs(fastify, options) {

    fastify.get('/', async function (request, reply) {
        reply.send({
            response: 1
        })
    })

    // Register all routes
    await fastify.register(AppRoutes)

}

