const getImage = async (request, response) => {
    try {
        const url = request.query.url
        const image = await fetch(url)
        const buffer = await image.arrayBuffer()
        const bufferArray = Buffer.from(buffer)

        response.set('Content-Type', 'image/jpeg')
        response.send(bufferArray)
    } catch (error) {
        response.status(500).send('Error fetching image')
    }
}

module.exports = { getImage }