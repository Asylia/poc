import fp from "fastify-plugin"
import fetch from "node-fetch"
import {bottleNeck} from "./BottleNeck.js"

const createBlockChainInfo = (authToken = process?.env?.BLOCKCHAIN_INFO_API_KEY || 'a03d1245-6bb5-45a9-8124-ae0105d7034b') => {
    const BlockChainInfo = {

        _callApi: async (method, path, body) => {

            const requestOptions = {
                method:
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Cookie': 'auth_token=' + authToken
                },
            }

            let query = ''
            if (!['GET', 'HEAD'].includes(method)) {
                requestOptions.body = JSON.stringify(body);
            } else {
                query = `?${new URLSearchParams(body).toString()}`
            }

            try {
                const url = `${process.env.BLOCKCHAIN_INFO_API_URL}/${path}${query}`;
                const apiResponse = await fetch(url, requestOptions);
                const responseText = await apiResponse.text(); // Get the response as text

                try {
                    const data = JSON.parse(responseText); // Try to parse it as JSON
                    return {data, error: null};
                } catch (e) {
                    return {data: null, error: e};
                }
            } catch (error) {
                return {data: null, error};
            }

        },

        Post: async (path, body) => await BlockChainInfo._callApi('POST', path, body),

        Get: async (path, query) => await BlockChainInfo._callApi('GET', path, query)

    }

    const api = BlockChainInfo
    api._callApi = bottleNeck.wrap(api._callApi)
    return api
}

export const BlockChainInfoApi = createBlockChainInfo()

export default fp(function plugin(fastify, opts, done) {

    fastify.decorate('BlockchainInfo', BlockChainInfoApi)

    done()

})