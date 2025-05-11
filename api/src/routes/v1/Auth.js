export default function WalletRoutes(fastify, options, done) {

    fastify.post('/sig-in', async function handler(request, reply) {

        const email = request.body.email

        const userExist = await fastify.Knex.raw(`select id FROM auth.users  WHERE auth.users.email = '${email}' limit 1`)
            .then(data => data.rows.length === 1 ? data.rows[0] : null)
            .catch(error => {
                console.error('error', error)
                return -1
            })

        if (userExist === -1) return reply.status(500).send({
            status: 'error',
            error: 'Internal server error'
        })

        const emailType = !userExist ? 'invite' : 'magiclink'

        const {data: generateLinkData, error: GenerateLinkError} = await fastify.Supabase.auth.admin.generateLink({
            type: emailType,
            email: email,
            options: {
                redirectTo: `${process.env.APP_URL}/dashboard`
            }
        })

        if (GenerateLinkError) {
            return reply.status(500).send({
                d:1,
                status: 'error',
                error: GenerateLinkError
            })
        }

        let magicLink = generateLinkData.properties.action_link

        if (process.env.NODE_ENV === 'development') {
            magicLink = magicLink.replace('https://my.asylia.io', 'http://localhost:3000')
            // magicLink = magicLink.replace('https://beta.asylia.io', 'http://localhost:3000')
        }

        const subject = emailType === 'invite' ? "Secure Login to Asylia: Your Access Link" : "Secure Login to Asylia: Your Access Link"

        try {
            // const inviteUser = await fastify.NodeMailer.sendMail({
            //     from: 'noreply@asylia.io',
            //     to: email,
            //     subject,
            //     text: `Click here: ${magicLink}`,
            //     html: `<b>Click here: </b> <a href="${magicLink}" target="_blank">Link</a>`,
            // })

            const inviteUser = await fastify.NodeMailer.sendMail({
                from: 'noreply@asylia.io',
                to: email,
                subject,
                text: `
                Hello,
Welcome back to Asylia—where security meets innovation. Ready to dive back into the world of secure Bitcoin transactions? Your secure login link is ready.

Access Your Asylia Account: ${magicLink}

Login to your dashboard (only valid for the next 15 minutes for security purposes)
Why Asylia?
At Asylia, we're committed to safeguarding your digital assets. Our platform uses cutting-edge multi-signature technology to ensure that every transaction remains secure, transparent, and under your control.

Why Trust Our SSO?
Our Single Sign-On (SSO) system provides a seamless and highly secure login experience without the need for passwords. By using SSO, we reduce the risk of password breaches and ensure your access is both simple and safe, leveraging advanced encryption and authentication methods.

Need help? Our support is always here for you - Contact Us

Thank you for choosing Asylia.

Best regards,
The Asylia Team

Footer:
Asylia Inc. | Asylia.io | Privacy Policy | Unsubscribe
                
                `,
                html: `
                <p>Hello</p>,

<p>Welcome back to Asylia—where security meets innovation. Ready to dive back into the world of secure Bitcoin transactions? Your secure login link is ready.</p>

<a href="${magicLink}" target="_blank">Access Your Asylia Account</a>

<p>Login to your dashboard (only valid for the next 15 minutes for security purposes)</p>
<p>Why Asylia?</p>
<p>At Asylia, we're committed to safeguarding your digital assets. Our platform uses cutting-edge multi-signature technology to ensure that every transaction remains secure, transparent, and under your control.</p>

<p>Why Trust Our SSO?</p>
<p>Our Single Sign-On (SSO) system provides a seamless and highly secure login experience without the need for passwords. By using SSO, we reduce the risk of password breaches and ensure your access is both simple and safe, leveraging advanced encryption and authentication methods.</p>
<pp>Need help? Our support is always here for you - Contact Us</pp>

<p>Thank you for choosing Asylia.</p>

<p>
Best regards, <br/>
The Asylia Team
</p>

<p>
<small>
Asylia Inc. | <a href="https://www.asylia.io" target="_blank">Asylia.io</a> | <a href="https://www.asylia.io/terms-conditions" target="_blank">Privacy Policy</a> | Unsubscribe
</small>
</p>

                `,
                // html: `<b>Click here: </b> <a href="${magicLink}" target="_blank">Link</a>`,
            })

            reply.send({
                inviteUser
            })

        } catch (error) {
            return reply.status(500).send({
                d:2,
                status: 'error',
                error
            })
        }


    })

    done()

}