const index = (request, response, next) => {
    const { customer, fullUrl } = response.locals
    
    response.locals.seo = {
        title: 'Star Happy Buffet Infantil',
        description: 'Home - Há 9 anos criando memórias que duram para sempre',
        keywords: 'Home, Star Happy Buffet Infantil',
        image: '/share.jpg',
        robots: 'index, follow',
        url: fullUrl
    }

    next()
}

const party = (request, response, next) => {
    const { customer, fullUrl } = response.locals

    response.locals.seo = {
        title: 'Faça sua festa - Star Happy Buffet Infantil',
        description: 'Faça sua festa - O Star Happy Buffet Infantil é o buffet número 1 de Curitiba',
        keywords: 'Faça sua festa, Star Happy Buffet Infantil',
        image: '/share.jpg',
        robots: 'index, follow',
        url: fullUrl
    }

    next()
}

const franchise = (request, response, next) => {
    const { customer, fullUrl } = response.locals

    response.locals.seo = {
        title: 'Seja um franqueado - Star Happy Buffet Infantil',
        description: 'Seja um franqueado - O Star Happy Buffet Infantil é o buffet líder em festas infantis',
        keywords: 'Seja um franqueado, Star Happy Buffet Infantil',
        image: '/share.jpg',
        robots: 'index, follow',
        url: fullUrl
    }

    next()
}

const notFound = (request, response, next) => {
    const { customer, fullUrl } = response.locals

    response.locals.seo = {
        title: 'Página não encontrada - Star Happy Buffet Infantil',
        description: 'Página não encontrada - O Star Happy Buffet Infantil é o buffet número 1 de Curitiba',
        keywords: 'Página não encontrada, 404, Star Happy Buffet Infantil',
        image: '/share.jpg',
        robots: 'noindex, nofollow',
        url: fullUrl
    }

    next()
}

module.exports = {
    index,
    party,
    franchise,
    notFound
}