const fs = require('fs')
const path = require('path')

const saveJson = async (request, response) => {
    try {
        const filePath = path.join(__dirname, '../../client/json/property-views.json')
        const data = request.body
        
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8')

        response.status(200).send('JSON saved successfully')
    } catch (error) {
        response.status(500).send('Error saving json')
    }
}

module.exports = { saveJson }