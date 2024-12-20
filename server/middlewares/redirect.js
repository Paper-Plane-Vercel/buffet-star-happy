const redirect = (request, response, next) => {
    const url = request.originalUrl
    const token = (request.headers.cookie || '').match(`clientToken=([^;]*)`)?.[1]
    
    if (url.includes('/sou-cliente') && !url.includes('/login') && !token) {
        return response.redirect('/sou-cliente/login')
    }

    if (url.includes('/sou-cliente/login') && token) {
        return response.redirect('/sou-cliente')
    }

    next()
}

module.exports = redirect