import fp from "fastify-plugin";
import fastifyView from "@fastify/view"
import ejs from 'ejs'

export default fp(function fastifyViewPlugin(fastify, opts, done) {

    fastify.register(fastifyView, {
        engine: {
            ejs: ejs
        },
        root: './src/views'
    })

    done()

})