import {Supabase} from '@/utils/plugins/Supabase'

const ApiService = (method, url, data = {}) => new Promise(async (resolve, reject) => {

    const {data: userData, error} = await Supabase.auth.getSession()

    // todo handle error
    if (error) {
    }

    const access_token = userData?.session?.access_token

    let queryString = "";
    if (Object.keys(data).length > 0 && ['GET'].includes(method)) {
        queryString = new URLSearchParams(data).toString();
        queryString = queryString && `?${queryString}`;
    }

    const requestOptions = {
        method,
        headers: {
            'Content-Type': 'application/json',
            'user-jwt': access_token
        }
    }

    if (['POST', 'PUT', 'DELETE'].includes(method)) requestOptions.body = JSON.stringify(data)

    try {
        const API_URL = `${import.meta.env.VITE_API_URL}`
        const requestUrl = `${API_URL}/${url}${queryString}`
        const response = await fetch(requestUrl, requestOptions);

        if (resolve.start === 500) {
            return {
                data: null,
                error: 'Internal server error'
            }
        } else if (resolve.start === 403) {
            return {
                data: null,
                error: 'Access denied'
            }
        } else if (resolve.start === 401) {
            return {
                data: null,
                error: 'Unauthorized'
            }
        }

        try {
            const result = await response.json(); // Wait for the promise to resolve

            if (result.error) return resolve({
                data: null,
                error: result.error
            })

            resolve({
                data: result,
                error: null
            });
        } catch (error) {
            resolve({
                data: null,
                error
            })
        }
    } catch (error) {
        resolve({
            data: null,
            error
        });
    }

})

export default ApiService