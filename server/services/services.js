const config = require('../../config')
const loader = require('../globals/loader')

const main = async (request, response, next) => {
    try {
        const idFilter = `${config.client.type === 'client' ? 'cliente' : 'parceria'}id`
        
        const urls = [
            { id: 'customer', url: `${config.apis.properties}imoveis/filtros/imobiliarias?filtro.${idFilter}=${config.client.id[config.client.type].main}&pagina=1&maximo=1` },
            { id: 'type', url: `${config.apis.properties}imoveis/filtros/tipodivulgacao?filtro.parceriaid=${config.client.id.partnership.main}&pagina=1&maximo=999999` },
            { id: 'buy', url: `${config.apis.properties}imoveis/filtros/tipoimoveis?filtro.clienteid=${config.client.id[config.client.type].buy}&filtro.tipodivulgacao=v&pagina=1&maximo=999999` },
            { id: 'rent', url: `${config.apis.properties}imoveis/filtros/tipoimoveis?filtro.clienteid=${config.client.id[config.client.type].rent}&filtro.tipodivulgacao=l&pagina=1&maximo=999999` }
        ]
        
        const data = await loader(urls)
        const responses = Object.fromEntries(data)
        
        response.locals.config = config
        response.locals.fullUrl = `${request.protocol}://${request.headers.host}${request.originalUrl}`
        response.locals.customer = responses.customer.data.resultado[0]
        response.locals.type = responses.type.data.resultado
        response.locals.buy = responses.buy
        response.locals.rent = responses.rent
        
        next()
    } catch (error) {
        next(error)
    }
}

const index = async (request, response, next) => {
    try {
        const idFilter = `${config.client.type === 'client' ? 'cliente' : 'parceria'}id`
        const isMobile = /Mobi|Android/i.test(request.headers['user-agent'])
        const maximum = isMobile ? 8 : 9

        const urls = [
            { id: 'offer', url: `${config.apis.properties}imoveis/pesquisa?filtro.${idFilter}=${config.client.id[config.client.type].main}&Ordenacao=imoveldataincluido&AscDesc=desc&pagina=1&maximo=${maximum}&fotos=true&cpsvalores=true` }
        ]

        const data = await loader(urls)
        const responses = Object.fromEntries(data)
        
        response.locals.offer = responses.offer

        next()
    } catch (error) {
        next(error)
    }
}

const properties = async (request, response, next) => {
    try {
        
        const parameters = await new SearchParameters(request.params[0], config).init()
        const queries = new URLSearchParams(parameters).toString()
        const idFilter = `${config.client.type === 'client' ? 'cliente' : 'parceria'}id`
        const id = config.client.id[config.client.type][parameters['filtro.tipodivulgacao'] ? parameters['filtro.tipodivulgacao'] === 'V' ? 'buy' : 'rent' : 'main']
        const order = parameters.ordenacao ? '' : '&ordenacao=imovelvalor&ascdesc=desc'
        const isMobile = /Mobi|Android/i.test(request.headers['user-agent'])
        const maximum = isMobile ? 8 : 9
        
        const urls = [
            { id: 'properties', url: `${config.apis.properties}imoveis/pesquisa?filtro.${idFilter}=${id}&${queries}${order}&filtro.salvarpesquisa=true&maximo=${maximum}&fotos=true&cpsvalores=true` }
        ]

        const data = await loader(urls)
        let responses = Object.fromEntries(data)
        
        response.setHeader('set-cookie', `parameters=${encodeURIComponent(JSON.stringify(parameters))}; path=/;`)
        response.locals.parameters = { ...parameters }

        const recursiveRequest = async () => {
            if (responses.properties.data.total > 0) return

            delete parameters.ordenacao
            delete parameters.ascdesc
            delete parameters.pagina
            delete parameters[Object.keys(parameters).pop()]

            const queries = new URLSearchParams(parameters).toString()
            
            const urls = [
                { id: 'properties', url: `${config.apis.properties}imoveis/pesquisa?filtro.${idFilter}=${id}&${queries}${order}&filtro.salvarpesquisa=true&maximo=${maximum - 2}&fotos=true&cpsvalores=true` }
            ]
            
            const data = await loader(urls)
            responses = Object.fromEntries(data)
            responses.properties.success = false

            if (responses.properties.data.total === 0) {
                return recursiveRequest()
            }

            return
        }

        await recursiveRequest()
        
        response.locals.properties = responses.properties

        next()
    } catch (error) {
        next(error)
    }
}

const property = async (request, response, next) => {
    try {
        const { clientid, reference } = request.params
        const idFilter = `${config.client.type === 'client' ? 'cliente' : 'parceria'}id`
        const isMobile = /Mobi|Android/i.test(request.headers['user-agent'])
        const maximum = isMobile ? 3 : 9

        const propertyUrl = [
            { id: 'property', url: `${config.apis.properties}imoveis/ficha?clienteid=${clientid}&imovelreferencia=${reference}&contabilizar=true&fotos=true&videos=true&links=true&cpsvalores=true&outrosvalores=true` },
        ]
        
        const propertyData = await loader(propertyUrl)
        const propertyResponses = Object.fromEntries(propertyData)

        if (propertyResponses.property.data) {
            let { imovelTipoDivulgacao, tipoImovelDescricao, imovelEnderecoBairro } = propertyResponses.property.data
            imovelEnderecoBairro = imovelEnderecoBairro.normalize('NFD').replace(/[\u0300-\u036F]/g, '')
            const id = config.client.id[config.client.type][imovelTipoDivulgacao === 'V' ? 'buy' : 'rent']
    
            const similarUrl = [
                { id: 'similar', url: `${config.apis.properties}imoveis/pesquisa?filtro.${idFilter}=${id}&filtro.tipodivulgacao=${imovelTipoDivulgacao}&filtro.tiposimoveis=${tipoImovelDescricao}&filtro.bairro=${imovelEnderecoBairro}&pagina=1&maximo=${maximum}&fotos=true&cpsvalores=true` }
            ]
    
            const similarData = await loader(similarUrl)
            const similarResponses = Object.fromEntries(similarData)
            response.locals.similar = similarResponses.similar
        }
        
        response.locals.property = propertyResponses.property.data
        
        next()
    } catch (error) {
        next(error)
    }
}

const propertyPrint = async (request, response, next) => {
    try {
        const { clientid, reference } = request.params

        const urls = [
            { id: 'property', url: `${config.apis.properties}imoveis/ficha?clienteid=${clientid}&imovelreferencia=${reference}&contabilizar=true&fotos=true&videos=true&links=true&cpsvalores=true&outrosvalores=true` },
        ]
        
        const data = await loader(urls)
        const responses = Object.fromEntries(data)

        response.locals.property = responses.property.data
        
        next()
    } catch (error) {
        next(error)
    }
}

const favorites = async (request, response, next) => {
    try {
        const token = (request.headers.cookie || '').match(`favoritesToken=([^;]*)`)?.[1]
        const user = (request.headers.cookie || '').match(`favoritesUser=([^;]*)`)?.[1]
        const idFilter = `${config.client.type === 'client' ? 'cliente' : 'parceria'}id`
        const page = request.params[0].includes('pagina') ? request.params[0].split('-')[1] : 1
        const headers = { 'authorization': `bearer ${token}` }
        const isMobile = /Mobi|Android/i.test(request.headers['user-agent'])
        const maximum = isMobile ? 8 : 9

        const urls = [
            { id: 'favorites', url: `${config.apis.properties}imoveisfavoritos/pesquisar?filtro.${idFilter}=${config.client.id.client.buy}&filtro.email=${user}&ordenacao=datacriacaofavorito&ascdesc=desc&pagina=${page}&maximo=${maximum}&fotos=true&cpsvalores=true`, options: { headers }, cache: false }
        ]
        
        const data = await loader(urls)
        const responses = Object.fromEntries(data)
        
        response.locals.user = user
        response.locals.favorites = responses.favorites
    
        next()
    } catch (error) {
        next(error)
    }
}

module.exports = {
    main,
    index,
    properties,
    property,
    propertyPrint,
    favorites,
}