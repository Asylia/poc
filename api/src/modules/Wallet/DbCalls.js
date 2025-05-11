import {Knex} from "../../plugins/Knex.js"
import {Supabase} from "../../plugins/Supabase.js";

export const loadWalletConfig = async walletId => await Supabase.from('v1_Asylia_UserWallets').select('*')
    .filter('id', 'eq', `${walletId}`)
    .single()

export const loadUsersById = async usrIdList => {

    const {
        data,
        error
    } = await Knex.from('auth.users').select('auth.users.id', 'email')
        .whereIn('auth.users.id', usrIdList)
        .join('public.users_profile', 'auth.users.id', 'public.users_profile.id')
        .then(data => ({data: data, error: data.length === 0}))
        .catch(error => {
            console.error('error', error)
            return {data: [], error: true}
        })


    if (error) {
        return {data: [], error: true}
    }
    return {data, error}

}

export const loadWalletUsers = async walletId => await Supabase.from('v1_Asylia_UserWallets').select('userIdList')
    .filter('id', 'eq', `${walletId}`)
    .single()

export const getUserWallets = async (userId) => {
    try {
        // Zavolá funkciu get_wallet_users, ktorá je definovaná v PostgreSQL
        const wallets = await Knex.raw(`
            SELECT * FROM get_user_wallets(?)
        `, [userId]);

        return wallets.rows;
    } catch (error) {
        console.error('error', error);
        return [];
    }
}


// todo refactor
export const getSingleWallet = async (walletId) => await Knex
    .select(
        "v1_Asylia_UserWallets.*",
        Knex.raw(`json_agg(json_build_object(
            'id', "users_profile"."id",
            'firstName', "users_profile"."firstName",
            'lastName', "users_profile"."lastName",
            'middleName', "users_profile"."middleName",
            'email', "auth_users"."email"
        )) as users`)
    )
    .from("v1_Asylia_UserWallets")
    .leftJoin("v1_Asylia_WalletUsers", "v1_Asylia_WalletUsers.walletId", "v1_Asylia_UserWallets.id")
    .leftJoin("users_profile", "users_profile.id", "v1_Asylia_WalletUsers.userId")
    .leftJoin("auth.users as auth_users", "auth_users.id", "users_profile.id")
    .where("v1_Asylia_WalletUsers.walletId", walletId)  // Zameniť 'specifické-wallet-id' s konkrétnym ID peňaženky
    .groupBy("v1_Asylia_UserWallets.id", "v1_Asylia_WalletUsers.order")
    .orderBy("v1_Asylia_WalletUsers.order", 'asc')
    .then(result => {
        return result;
    })
    .catch(error => {
        console.error('error', error);
        return [];
    })

export const getWalletUsers = async (walletId) => {
    try {
        const users = await Knex.raw(`
            SELECT * FROM get_wallet_users(?)
        `, [walletId]);

        return users.rows;
    } catch (error) {
        console.error('error', error);
        return [];
    }
}