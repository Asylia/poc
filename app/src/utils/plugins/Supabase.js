import {createClient} from '@supabase/supabase-js'

export const Supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY)

export const SUPABASE_KEY = 'SUPABASE'

export default app => app.provide(SUPABASE_KEY, Supabase)