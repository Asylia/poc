import {createGlobalStore, getGlobalStore, existGlobalStore} from "#app/plugins/custom/GlobalStore.js";
import {getUserWallets} from "#app/modules/Wallet/DbCalls.js";
import {getRoomName, findWalletInList, createWalletInstance} from '#app/modules/Wallet/socket/Utils.js'

export default function WalletRoutes(fastify, options, done) {

    const walletsStore = createGlobalStore('wallets')

    // grant access to wallet data only for users who have access to it
    fastify.addHook('onRequest', async (request, reply) => {
        const userWallets = await getUserWallets(fastify.meta.user.id);
        const walletId = request.query?.walletId ?? request.body?.walletId;
        if (walletId) {
            const sendError = () => reply.code(403).send({error: 'Access denied'})
            if (!userWallets.some(wallet => wallet.id === walletId)) return sendError()
            if (!walletsStore.has(getRoomName(walletId))) {
                const walletConfig = findWalletInList(userWallets, walletId)
                if (walletConfig) {
                    await createWalletInstance(walletConfig, fastify.io)
                } else {
                    return sendError()
                }
            }
        }
        fastify.meta.user.wallets = userWallets;
    })

    /*
     * Load and map wallet data from blockchain
     */
    fastify.get('/', async function getSingleWalletData(request, reply) {

        const start = new Date().getTime()
        const walletId = request.query.walletId
        // const rebuild = request.query.rebuild
        const roomName = getRoomName(walletId)
        let wallet = walletsStore.get(roomName)

        if (!wallet) {
            const walletConfig = findWalletInList(fastify.meta.user.wallets, walletId)
            // const walletConfig = findWalletInList(fastify.meta.user.wallets, walletId, 2)
            if (!walletConfig) {
                return reply.send({
                    data: null,
                    error: 'Wallet not found',
                    time: new Date().getTime() - start
                })
            } else {
                // if (rebuild) {
                //     const walletConfig = findWalletInList(fastify.meta.user.wallets, walletId)
                //     wallet = await createWalletInstance(walletConfig, fastify.io)
                // } else {
                //
                // }

                wallet = await createWalletInstance(walletConfig, fastify.io)

            }
        }

        return reply.send({
            ...wallet.fullWalletData
        })

    })

    fastify.post('/reload-balance', async function reloadWalletBalance(request, reply) {
        try {
            const walletId = request.query.walletId
            await walletsStore[getRoomName(walletId)].calculateWalletBalance()
            reply.send({
                status: 1
            })
        } catch (e) {
            reply.send({
                status: 0
            })
        }
    })

    fastify.post('/update-name', async function getWalletTransactions(request, reply) {
        const name = request.body.name
        const walletId = request.body.walletId
        const data = await fastify.Knex.from('v1_Asylia_UserWallets').update({
            name
        }).where('id', walletId)

        if (data === 0) {
            return reply.status(500).send({})
        } else {
            reply.status(200).send({})
            const roomName = getRoomName(walletId)
            // walletsStore[getRoomName(walletId)].setWalletDataObjectKeyVal('rawWalletConfig', 'name', name, true)
            walletsStore[roomName].setWalletDataObjectKeyVal('mappedWalletConfig', 'name', name, false)
            walletsStore[roomName].setWalletDataObjectKeyVal('rawWalletConfig', 'name', name, false)
            walletsStore[roomName].emitWalletData('config', walletsStore[roomName].mappedWalletConfig)
        }
    })

    fastify.post('/add-wallet-ledger-policy', async function getWalletTransactions(request, reply) {

        const policy = request.body.policy
        const walletId = request.body.walletId
        const roomName = getRoomName(walletId)

        const actualPolicy = walletsStore[roomName].rawWalletConfig.ledgerPolicyHmacs
        actualPolicy.push(policy)

        const data = await fastify.Knex.from('v1_Asylia_UserWallets').update({
            ledgerPolicyHmacs: actualPolicy
        }).where('id', walletId)

        if (data === 0) {
            return reply.status(500).send({})
        } else {
            reply.status(200).send({})
            walletsStore[roomName].emitWalletData('config', walletsStore[roomName].mappedWalletConfig)
        }
    })

    fastify.get('/wallet-transactions', async function getWalletTransactions(request, reply) {

        const walletId = request.query.walletId
        const n = request.query.n ?? 10
        const offset = request.query.offset ?? 0

        const data = await walletsStore[getRoomName(walletId)].getWalletBlockChainTransactions(n, offset)
        // const data = await walletsStore.get(getRoomName(walletId)).getWalletBlockChainTransactions(n, offset)

        reply.send({
            ...data
        })

    })

    /*
     * Add new user id do wallet userIdList
     */
    fastify.post('/add-wallet-key', async function handler(request, reply) {

        const walletId = request.body.walletId
        const key = request.body.key

        const walletConfig = findWalletInList(fastify.meta.user.wallets, walletId)
        const keys = walletConfig.extendedPublicKeys
        keys.push(key)

        const roomName = getRoomName(walletId)

        const {error, data} = await fastify.Supabase.from('v1_Asylia_UserWallets')
            .update({
                extendedPublicKeys: keys
            })
            .eq('id', walletId)

        if (data === 0) {
            return reply.status(500).send({})
        }

        walletsStore[roomName].rawWalletConfig.extendedPublicKeys.push(key)
        await walletsStore[roomName].create()
        await walletsStore[roomName].emitWalletFullData()

        reply.status(200).send({})

    })


    fastify.get('/wallet-list', async function handler(request, reply) {

        const userWalletList = fastify.meta.user.wallets
        for (let i = 0; i < userWalletList.length; i++) {

            const walletConfig = userWalletList[i]
            if (walletsStore.has(getRoomName(walletConfig.id))) continue
            // if (walletListHasWallet(getRoomName(walletConfig.id))) continue
            await createWalletInstance(walletConfig, fastify.io)

        }

        const walletListData = userWalletList.map(wallet => {
            const singleWallet = walletsStore.get(getRoomName(wallet.id))
            const data = {
                ...wallet,
                balance: singleWallet?.fullWalletData?.balance ?? null,
                status: singleWallet?.fullWalletData?.status ?? null
            }
            return data
        })

        reply.send({
            data: walletListData
        })

    })

    /*
     * Reload wallet users after user is removed
     */
    fastify.post('/reload-users', async function handler(request, reply) {
        const walletId = request.body.walletId
        await walletsStore[getRoomName(walletId)].reloadWalletUsers()
        reply.send({
            status: 1
        })
    })

    /*
     * Delete wallet
     */
    fastify.post('/delete-wallet', async function handler(request, reply) {
        const walletId = request.body.walletId
        await walletsStore[getRoomName(walletId)].reloadWalletUsers()
        // await walletsStore.get(getRoomName(walletId)).reloadWalletUsers()
        // await walletList[getRoomName(walletId)].reloadWalletUsers()
        reply.send({
            status: 1
        })
    })

    /*
    * Add new user id do wallet userIdList
    */
    fastify.post('/invite-user', async function handler(request, reply) {

        const RESPONSE_STATUS_ENUM = {
            ERROR: 1,
            USER_NOT_FOUND: 2,
            OK: 3
        }

        const replyStatus = (status, err, debug) => {
            reply.send({
                status,
                debug,
                error: err
            })
        }

        const inviteEmail = request.body.email
        const walletId = request.body.walletId
        const rights = request.body.rights

        // function to insert new userId into wallet userIdList
        const insertInviteUserIdIntoWalletAccessList = async id => {
            const {error: updateWalletError} = await fastify.Supabase.from('v1_Asylia_WalletUsers')
                .insert({
                    walletId,
                    userId: id,
                    rights
                })
            return updateWalletError !== null
        }

        /*
         * Check if user with inviteEmail exists
         */
        const {
            data,
            error
        } = await fastify.Knex.raw(`select au.id, au.email FROM auth.users au WHERE au.email = '${inviteEmail}'`)
            .then(data => ({data: data.rows[0]?.id ?? null}))
            .catch(error => ({data: null, error: true}))

        if (error) return replyStatus(RESPONSE_STATUS_ENUM.ERROR, error, 1)

        const userNotExists = !data
        let inviteUserId = userNotExists ? null : data.id

        // redirect to wallet
        const redirectTo = `${process.env.APP_URL}/wallet/${walletId}`

        // function to send invitation email
        const sendEmail = async type => {

            const {data, error} = await fastify.Supabase.auth.admin.generateLink({
                type,
                email: inviteEmail,
                options: {
                    redirectTo
                }
            })

            if (error) return replyStatus(RESPONSE_STATUS_ENUM.ERROR, error, 2)
            inviteUserId = data.user.id

            // const magicLink = data.properties.action_link

            let magicLink = data.properties.action_link

            if (process.env.NODE_ENV === 'development') {
                magicLink = magicLink.replace('https://my.asylia.io', 'http://localhost:3000')
            }


            // Create user Profile

            if (type === 'invite') {
                const {error: createProfileError} = await fastify.Supabase.from('users_profile').insert({
                    id: inviteUserId,
                    firstName: '',
                    lastName: '',
                    middleName: ''
                })
                if (createProfileError) return replyStatus(RESPONSE_STATUS_ENUM.ERROR, createProfileError, 3)
            }


            const inviteUser = await fastify.NodeMailer.sendMail({
                from: 'noreply@asylia.io',
                // to: 'tee@mailinator.com',
                to: inviteEmail,
                subject: "Inivitation to Asylia.io wallet",
                text: `Join to wallet: ${magicLink}`,
                html: `<b>Join to wallet: </b> <a href="${magicLink}" target="_blank">Link</a>`,
            })


            // todo handle email send error

            return inviteUser
        }

        /*
         * If user not exists, send invitation email
         */
        const emailType = userNotExists ? 'invite' : 'magiclink'
        const emailResult = await sendEmail(emailType)

        const addedToWalletError = await insertInviteUserIdIntoWalletAccessList(inviteUserId)

        await walletsStore[getRoomName(walletId)].reloadWalletUsers()
        // await walletsStore.get(getRoomName(walletId)).reloadWalletUsers()

        if (addedToWalletError) return replyStatus(RESPONSE_STATUS_ENUM.ERROR, addedToWalletError, 4)

        reply.send({
            status: RESPONSE_STATUS_ENUM.OK,
        })


    })

    done()

}