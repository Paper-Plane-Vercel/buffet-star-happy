export default class Loader {

    async load(urls) {
        const results = {}

        const dataPromises = urls.map(async ({ id, url, options = {}, cache = true, duration = 600 }) => {
            const parsedUrl = new URL(url)
            const cacheKey = `${parsedUrl.pathname}${parsedUrl.search}`
            
            if (cache) {
                const cachedItem = localStorage.getItem(cacheKey)
                
                if (cachedItem) {
                    const { data, timestamp } = JSON.parse(cachedItem)
                    const isExpired = (Date.now() - timestamp) > duration * 1000

                    if (!isExpired) {
                        results[id] = data

                        return
                    } else {
                        localStorage.removeItem(cacheKey)
                    }
                }
            }

            const response = await fetch(url, options)
            const data = await response.json()

            if (cache) {
                const cacheData = {
                    data,
                    timestamp: Date.now()
                }

                localStorage.setItem(cacheKey, JSON.stringify(cacheData))
            }

            results[id] = data
        })
        
        await Promise.all(dataPromises)

        return results
    }
    
}