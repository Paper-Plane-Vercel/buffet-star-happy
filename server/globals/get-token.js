const config = require('../../config')

const getToken = async (request, response) => {
    try {
        const url = 'https://auth.api.cloudslim.com.br/login'

        const body = {
            'username': 'paperplane@paperplane.com.br',
            'password': 'Pap@101',
            'empresa': config.client.id.client.main
        }

        const options = {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                'accept': 'application/json'
            },
            body: JSON.stringify(body)
        }

        const data = await fetch(url, options)
        const token = await data.json()

        response.status(data.status).json(token)
    } catch (error) {
        response.status(500).send('Error fetching data')
    }
}

module.exports = { getToken }