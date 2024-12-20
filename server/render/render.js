const config = require('../../config')

const render = Object.fromEntries(
    Object.entries(config.pages).map(([key, value]) =>
        [key, (request, response) => response.render(`pages/${value.view}`, { fileName: value.view })]
    )
)

module.exports = render