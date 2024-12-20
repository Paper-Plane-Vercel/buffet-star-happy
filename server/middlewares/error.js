const error = (error, request, response, next) => {
    const { stack, statusCode, message } = error

    response.status(statusCode || 500).json({ error: message || 'Internal Server Error' })
    console.error(stack)
    
    next()
}

module.exports = error