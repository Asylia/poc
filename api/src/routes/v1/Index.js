import AfterAuthRoutes from "./after-auth/Index.js"
import AuthRoutes from "./Auth.js"

export default function WalletRoutes(fastify, options, done) {

    fastify.register(AfterAuthRoutes, {})
    fastify.register(AuthRoutes, {prefix: '/auth'})
    
    done()

}