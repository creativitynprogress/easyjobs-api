module.exports = (app) => { // declaracion para exportar el modulo
    const express = require('express') /// se necesita express
    const passport = require('passport')
    require('../config/passport')
    const authentication_controller = require ('../controllers/authentication');


    // Middleware to require login/authentication
    const require_authentication = passport.authenticate('jwt', {
        session: false
    })
  
    const require_login = passport.authenticate('local', {
        session: false
    })

    const api_routes = express.Router() // se crea el modelo router que contiene a todos
    const auth_routes = express.Router()
    ///Routes

    api_routes.use('/auth', auth_routes)
    auth_routes.post('/register', authentication_controller.register)
    auth_routes.post('/login', require_login ,authentication_controller.login)

    app.use ('/api', api_routes)    // Cuando se llega aqui se usa la ruta /API y la funcion apiroutes que es esta
}// end module.exports

