const express = require('express')
const router = express.Router()
const { body } = require('express-validator')
const { proyectosHome,
    formularioProyecto,
    nuevoProyecto,
    proyectoPorUrl,
    formularioEditar,
    actualizarProyecto,
    eliminarProyecto } = require('../controllers/proyectosController')
const { agregarTarea, cambiarEstadoTarea, eliminarTarea } = require('../controllers/tareasController')
const { formCrearCuenta, crearCuenta, formIniciarSesion, formReestablecerPassword, confirmarCuenta } = require('../controllers/usuariosController')
const { autenticarUsuario, usuarioAutenticado, cerrarSesion, enviarToken, validarToken, actualizarPassword } = require('../controllers/authController')

module.exports = function () {
    router.get('/',
        usuarioAutenticado,
        proyectosHome
    )

    router.get('/nuevo-proyecto',
        usuarioAutenticado,
        formularioProyecto
    )

    router.post("/nuevo-proyecto",
        usuarioAutenticado,
        body('nombre').not().isEmpty().trim().escape(),
        nuevoProyecto
    )

    router.get('/proyectos/:url',
        usuarioAutenticado,
        proyectoPorUrl
    )

    router.delete('/proyectos/:url',
        usuarioAutenticado,
        eliminarProyecto
    )
    router.post('/proyectos/:url',
        usuarioAutenticado,
        agregarTarea
    )

    router.get('/proyecto/editar/:id',
        usuarioAutenticado,
        formularioEditar
    )

    router.post("/nuevo-proyecto/:id",
        usuarioAutenticado,
        body('nombre').not().isEmpty().trim().escape(),
        actualizarProyecto
    )

    router.patch('/tareas/:id',
        usuarioAutenticado,
        cambiarEstadoTarea
    )

    router.delete('/tareas/:id',
        usuarioAutenticado,
        eliminarTarea
    )

    router.get('/crear-cuenta', formCrearCuenta)
    router.post('/crear-cuenta', crearCuenta)

    router.get('/confirmar/:correo', confirmarCuenta)

    router.get('/iniciar-sesion', formIniciarSesion)
    router.post('/iniciar-sesion', autenticarUsuario)

    router.get('/cerrar-sesion', cerrarSesion)

    router.get('/reestablecer', formReestablecerPassword)
    router.post('/reestablecer', enviarToken)
    router.get('/reestablecer/:token', validarToken)
    router.post('/reestablecer/:token', actualizarPassword)

    return router
}