import {response} from "express";
import * as repl from "node:repl";

export default function WalletRoutes(fastify, options, done) {

    fastify.get('/sessions', async function handler(request, reply) {

        const {
            data,
            error
        } = await fastify.Knex.raw(`select  au.id, au.created_at, au.updated_at, au.user_agent, au.ip FROM auth.sessions au WHERE au.user_id = '${fastify.meta.user.id}'`)
            .then(data => ({data: data.rows, error: null}))
            .catch(error => ({data: null, error: true}))

        if (error) return reply.status(500).send({
            status: 'error',
            error: error
        })

        reply.send({
            sessions: data
        })

    })

    fastify.get('/profile', function handler(request, reply) {

        reply.send({
            profile: fastify.meta.userProfile
        })

    })

    fastify.get('/pay-link', async function handler(request, reply) {

        reply.status(500)

    })


    done()

}