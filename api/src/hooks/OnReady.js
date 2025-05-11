import {setupTickerSocketHandlers, startLoadingTickers} from "#app/modules/tickers/Index.js";
import SocketIoGuard from "#app/guards/SocketIoGuard.js";
import {setupWalletSocketHandlers} from "#app/modules/Wallet/socket/Socket.js";

const onReadyHooks = async (fastify) => {

    // socket.io guard
    await SocketIoGuard(fastify.io)

    // Start server loading tickers
    await startLoadingTickers(fastify.io)

    fastify.io.on('connection', socket => {

        /*
         * Setup app functions for the connected socket
         * - wallet
         * - tickers
         */
        setupWalletSocketHandlers(fastify.io, socket)
        setupTickerSocketHandlers(fastify.io, socket)

    })

    return 1

}

export default onReadyHooks