import Fastify from 'fastify'
import cors from '@fastify/cors'
import fastifyEnv from '@fastify/env'
import 'dotenv/config'

const fastify = Fastify({
    logger: true
})

/*
 * Fastify modules
 * CORS
 * ENV
 */
await fastify.register(cors, {
    origin: '*'
})

fastify.register(fastifyEnv, {
    dotenv: true,
    schema: {
        type: 'object',
    }
})

/*
 * Register app plugins
 * - Knex
 *  -Supabase
 * - BottleNeck
 * - BlockChainInfo API
 */
import Knex from './plugins/Knex.js'
import Supabase from './plugins/Supabase.js'
import BottleNeck from './plugins/BottleNeck.js'
// import Redis from './plugins/Redis.js'
import BlockChainInfo from './plugins/BlockChainInfoApi.js'
import NodeMailer from './plugins/NodeMailier.js'
import FastifyLog from 'fastify-log'
import SocketIo from './plugins/SocketIo.js'
import BetterStack from './plugins/BetterStack.js'
import fastifyViewPlugin from './plugins/FastifyView.js'
import fastifyStripe from './plugins/Stripe.js'

fastify.register(FastifyLog);
fastify.register(fastifyViewPlugin);
fastify.register(fastifyStripe);
fastify.register(Knex, {})
fastify.register(Supabase, {})
fastify.register(BottleNeck, {})
fastify.register(BlockChainInfo, {})
// fastify.register(Redis, {})
fastify.register(NodeMailer, {})
fastify.register(SocketIo, {})
fastify.register(BetterStack, {})

/*
 * App hoos
 */
// or async/await style
fastify.addHook('onReady', () => {
    onReadyHooks(fastify)
})

/*
 * Load app routes
 */
import app from './app.js'
import onReadyHooks from "#app/hooks/OnReady.js";


fastify.register(app)

/*
 * Run server
 */
const runServer = async () => {
    try {
        await fastify.listen({port: process.env.APP_PORT, host: '0.0.0.0'})

        fastify.Logtail.info("Server started successfully at: " + new Date().getTime())
        fastify.Logtail.flush()

        return 1
    } catch (err) {
        fastify.log.error(err)
        process.exit(1)
        return 0
    }
}

await runServer()