import fp from "fastify-plugin";
import Stripe from "stripe";

export default fp((fastify, opts, done) => {

    fastify.addHook('onRequest', async function HttpGuardFunction(request, reply) {

        const userJwt = request.headers['user-jwt']
        if (!userJwt) reply.code(401).send({message: 'authentication error'})

        try {

            const {data: {user}, error} = await fastify.Supabase.auth.getUser(userJwt)

            if (error) return reply.code(500).send({error})
            if (!user) return reply.code(401).send({message: 'Invalid token'})
            if (!fastify.meta) fastify.meta = {}

            fastify.meta['user'] = user

            const {data: userProfileData, error: userProfileError} = await fastify.Supabase
                .from('users_profile')
                .select('*')
                .eq('id', user.id)

            if (userProfileError) return reply.code(500).send({error: userProfileError})

            let userProfile = userProfileData[0]
            // create user profile if not exists
            if (!userProfile) {

                const {data: createdProfile, error: createUserProfileError} = await fastify.Supabase
                    .from('users_profile')
                    .upsert([{
                        id: user.id,
                        firstName: '',
                        lastName: '',
                        middleName: '',
                        language: 'EN',
                        currency: 'USD',
                    }])
                    .select('*')
                    .single()

                if (createUserProfileError) return reply.code(500).send({error: createUserProfileError})
                userProfile = createdProfile

            }

            const {data: userSubs, error: userSubsError} = await fastify.Supabase
                .from('users_subscriptions')
                .select('*')
                .eq('user_id', user.id)

            if (userSubsError) return reply.code(500).send({error: userSubsError})

            let userSub = userSubs[0]
            // create user profile if not exists
            if (!userSub) {

                const stripeCustomer = await fastify.Stripe.getOrCreateCustomer(user.email, user.id)

                const {data: createdUserSub, error: createdUserSubErr} = await fastify.Supabase
                    .from('users_subscriptions')
                    .upsert([{
                        user_id: user.id,
                        stripe_customer_id: stripeCustomer.id,
                        subscription_type: 0,
                        subscription_is_active: false,
                        stripe_subscription_id: null
                    }])
                    .select('*')
                    .single()

            }

            fastify.meta['userSubscription'] = userSub
            fastify.meta['userProfile'] = userProfile

        } catch (error) {
            reply.code(500).send({error})
        }

    })

    done()
})