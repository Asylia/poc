import fp from "fastify-plugin";
import {getUserWallets} from "#app/modules/Wallet/DbCalls.js";
import {Supabase} from "#app/plugins/Supabase.js";

const MIN_AUTH_DURATION_IN_MS = 500

export default io => {

    io.use(async (socket, next) => {

        try {

            const start = new Date().getTime()
            const userJwt = socket.handshake.auth.token
            if (!userJwt) return next(new Error('Authentication failed'))

            const {data: {user}, error} = await Supabase.auth.getUser(userJwt)
            if (error || !user) return next(new Error('Invalid token'))
            if (!socket.meta) socket.meta = {}
            socket.meta['user'] = user

            const userWallets = await getUserWallets(user.id)
            socket.meta['user']['wallets'] = userWallets

            const end = new Date().getTime()
            const diffInMs = (end - start)

            if (diffInMs < MIN_AUTH_DURATION_IN_MS) {
                setTimeout(() => next(), MIN_AUTH_DURATION_IN_MS - diffInMs);
            } else {
                next();
            }

        } catch (err) {
            next(err);
        }

    })

}