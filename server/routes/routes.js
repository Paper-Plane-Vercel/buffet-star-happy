const express = require('express')
const router = express.Router()
const config = require('../../config')
const services = require('../services/services')
const seo = require('../seo/seo')
const render = require('../render/render')

const middlewares = [services, seo, render]

Object.entries(config.pages).forEach(([key, value]) => {
    const pageMiddlewares = middlewares.map(middleware => middleware[key]).filter(Boolean)

    pageMiddlewares.unshift(services.main)
    router.get(value.route, pageMiddlewares)
})

module.exports = router