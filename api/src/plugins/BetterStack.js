import fp from "fastify-plugin";
import {Logtail} from "@logtail/node"

export default fp(async function plugin(fastify, opts) {

    const LogtailApp = await new Logtail("QtNt5YbWmy2vABukcFwYj7U4");

    await fastify.decorate('Logtail', LogtailApp);

})