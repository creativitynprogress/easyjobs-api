const express = require('express');
const app = express();
const port = process.env.PORT || 3000; // put de app on any avaliable port in that momento or the 3000
const mongoose = require('mongoose'); 
const User = require("./api/models/userModel") /// importamos nuestro schema 
const bodyParser = require('body-parser');
const logger = require('morgan')
const boom = require('boom')

mongoose.Promise = global.Promise; // declarando promise
mongoose.connect("mongodb://localhost:27017/easyjobsapi"); // conectando a mongodb

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(logger('dev'))

let routes = require("./api/routes/index"); // se crea el objeto routes que tendra las routas declaradas en todoRoutes
routes(app); // como ese obj tiene codigo node lo usamos como la app para registrar lasrutas

app.use((err,req,res,next)=>{
    console.error(err.stack)
    res.status(err.statusCode).send({
        error: err.message
    })
})

// put the server running
app.listen(port, () => {
    console.log("Ready at port: " + port);
});

