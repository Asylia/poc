import fp from "fastify-plugin"
import Bottleneck from "bottleneck"

export const bottleNeck = new Bottleneck({
    maxConcurrent: 1,      // Max počet súčasne bežiacich úloh
    minTime: 200           // Minimálny čas (ms) medzi spusteniami úloh
})

export default fp(function plugin(fastify, opts, done) {
    fastify.decorate('BottleNeck', bottleNeck)
    done()
})