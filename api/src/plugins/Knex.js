import fp from "fastify-plugin";
import knex from "knex"
import fs from 'fs'
import path from 'path'
import {fileURLToPath} from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const path_to_certificate = path.resolve(__dirname, './db-certificate.crt');

/*
 * Create Knex instance
 */

const connection = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT,
    ssl: {
        rejectUnauthorized: false,
        cert: fs.readFileSync(path_to_certificate).toString(),
    }
}

export const Knex = await knex({
    client: 'pg',
    debug: false,
    connection
})

export default fp(async function plugin(fastify, opts) {

    /*
     * Db connection test each 10 seconds
     * If connection is lost, it will try to reinitialize Knex instance
     */
    setInterval(async () => {
        try {
            await Knex.raw('SELECT 1');
        } catch (error) {
            // todo handle  error
            Knex.destroy().then(() => Knex.initialize());
        }
    }, 10_000)

    await fastify.decorate('Knex', Knex)

})