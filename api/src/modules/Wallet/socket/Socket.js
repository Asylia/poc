import {getRoomName, findWalletInList, userJoinedWallet, disconnectUserFromWallet} from "./Utils.js";

export const setupWalletSocketHandlers = (io, socket) => {
    socket.on('joinToWallet', async (wallet) => {
        const roomName = getRoomName(wallet.id);
        socket.join(roomName);
        const walletConfig = findWalletInList(socket.meta.user.wallets, wallet.id);
        if (walletConfig) {
            await userJoinedWallet(walletConfig, io, socket.id);
            socket.emit('wallet-connected', true)
        } else {
        }

        socket.on('disconnect', () => {
            leaveWallet(roomName);
        })
    })

    const leaveWallet = (roomName) => {
        socket.leave(roomName);
        disconnectUserFromWallet(roomName, socket.id);
    }

    socket.on('leaveWallet', (wallet) => {
        const roomName = getRoomName(wallet.id);
        leaveWallet(roomName);
    })
}