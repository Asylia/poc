import WalletRoutes from "./Wallet.js";
import UserRoutes from "./User.js";
import HttpGuard from "#app/guards/HttpGuard.js";

export default async function MainJs(fastify, options, done) {

    // guard
    await fastify.register(HttpGuard)

    fastify.register(WalletRoutes, {prefix: '/wallet'})
    fastify.register(UserRoutes, {prefix: '/user'})

    done()

}