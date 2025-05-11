import v1Routes from './v1/Index.js'
import BlockChainInfoApiRoutes from './global/BlockChainInfoProxy.js'

export default async function MainJs(fastify, options) {

    // Global routes
    await fastify.register(BlockChainInfoApiRoutes, {prefix: '/global'})

    /*
     * Load app routes
     * - v1
     */
    await fastify.register(v1Routes, {prefix: '/v1'})

}