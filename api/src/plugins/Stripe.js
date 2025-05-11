import fp from "fastify-plugin"

export default fp(function plugin(fastify, opts, done) {

    async function getOrCreateCustomer(email, id) {
    }

    fastify.decorate('Stripe', {})
    fastify['Stripe']['getOrCreateCustomer'] = getOrCreateCustomer

    done()

})