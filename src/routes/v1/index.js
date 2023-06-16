const express = require('express')
const scrapperRoute = require('./scrapper.route')
const docsRoute = require('./docs.route')
const config = require('../../config/config')

const router = express.Router()

const defaultRoutes = [
  {
    path: '/scrap',
    route: scrapperRoute,
  },
]

const devRoutes = [
  // routes available only in development mode
  {
    path: '/docs',
    route: docsRoute,
  },
]

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route)
})

if (config.env === 'development') {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route)
  })
}

module.exports = router
