module.exports = (app) => { // declaracion para exportar el modulo
    const express = require('express') /// se necesita express
    const passport = require('passport')
    require('../config/passport')
    const category_controller = require('../controllers/category')
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
    const category_routes = express.Router()
    ///Routes

    api_routes.use('/auth', auth_routes)
    auth_routes.post('/register', authentication_controller.register)
    auth_routes.post('/login', require_login ,authentication_controller.login)
    /// route for fb

    api_routes.use('/category', category_routes)
    category_routes.get('/',require_authentication, category_controller.listCategories)
    category_routes.post('/',require_authentication, category_controller.createCategory)
    category_routes.put('/:categoryId',require_authentication, category_controller.editCategory)
    category_routes.delete('/:categoryId',require_authentication, category_controller.deleteCategory)


    app.use ('/api', api_routes)    // Cuando se llega aqui se usa la ruta /API y la funcion apiroutes que es esta
}// end module.exports

