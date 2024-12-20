const NodeCache = require('node-cache')
const redis = require('redis')
let dataCache = new NodeCache()
let redisClient

if (process.env.NODE_ENV === 'production') {
    redisClient = redis.createClient({
        url: 'redis://default:dKpa1ZyGvE7CfEnuYiSUAqABJOXC8OvI@redis-11584.c61.us-east-1-3.ec2.redns.redis-cloud.com:11584',
        socket: { reconnectStrategy: () => 1000 }
    })
    
    redisClient.connect().catch(() => {
        redisClient = null
    })
}

const loader = async (urls) => {
    const dataPromises = urls.map(async ({ id, url, options = {}, cache = true, duration = 600 }) => {
        if (cache) {
            let cachedData

            if (redisClient) {
                cachedData = await redisClient.get(url)

                if (cachedData) {
                    return [id, JSON.parse(cachedData)]
                }
            } else {
                cachedData = dataCache.get(url)

                if (cachedData) {
                    return [id, cachedData]
                }
            }
        }

        const response = await fetch(url, options)
        const data = await response.json()

        if (cache) {
            if (redisClient) {
                await redisClient.set(url, JSON.stringify(data), { EX: duration })
            } else {
                dataCache.set(url, data, duration)
            }
        }

        return [id, data]
    })

    return await Promise.all(dataPromises)
}

module.exports = loader