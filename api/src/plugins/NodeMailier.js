import nodemailer from "nodemailer"
import fp from "fastify-plugin"

const transporter = nodemailer.createTransport({
    host: process.env.EMAILER_HOST,
    port: process.env.EMAILER_PORT,
    secure: true,
    auth: {
        user: process.env.EMAILER_USER,
        pass: process.env.EMAILER_PASSWORD
    }
})

export default fp(async function plugin(fastify, opts) {
    await fastify.decorate('NodeMailer', transporter)
})