import fp from "fastify-plugin";
import {createClient} from '@supabase/supabase-js'

export const Supabase = await createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
})

export default fp(async function plugin(fastify, opts) {

    await fastify.decorate('Supabase', Supabase)

})