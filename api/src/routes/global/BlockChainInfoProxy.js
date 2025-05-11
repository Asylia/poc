import HttpGuard from "#app/guards/HttpGuard.js";

export default async function blockChainInfoProxy(fastify, options, done) {

    // guard
    await fastify.register(HttpGuard)

    fastify.get('/blockchain-info-proxy/*', async (request, reply) => {
        return await fastify.BlockchainInfo.Get(request.params['*'], request.query)
    })

    fastify.post('/blockchain-info-proxy/*', async (request, reply) => {
        return await fastify.BlockchainInfo.Post(request.params['*'], request.body)
    })

    done()


}