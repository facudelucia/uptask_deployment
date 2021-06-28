const express = require('express')
const routes = require('./routes')
const path = require('path')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const db = require('./config/db')
const passport = require('./config/passport')
const flash = require('connect-flash');
require('dotenv').config({ path: 'variables.env' })
require('./handlers/email')
require('./models/Proyectos')
require('./models/Tareas')
require('./models/Usuarios')

db.sync()
    .then(() => console.log('conectado'))
    .catch(e => console.log(e))

const app = express()

app.use(express.static('public'))

app.set('view engine', 'pug')

app.use(express.json())

app.use(express.urlencoded({ extended: false }));

app.set('views', path.join(__dirname, './views'))

app.use(cookieParser())

app.use(session({
    secret: 'supersecreto',
    resave: false,
    saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())

app.use(flash());

app.use((req, res, next) => {
    res.locals.mensajes = req.flash()
    res.locals.usuario = { ...req.user } || null
    next()
})

app.use('/', routes())

const host = process.env.HOST || '0.0.0.0'
const port = process.env.PORT || 3000

app.listen(port, host, () => {
    console.log('El servidor esta funcionando')
})