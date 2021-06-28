const passport = require('passport')
const Usuarios = require('../models/Usuarios')
const crypto = require('crypto')
const { Op } = require('sequelize')
const bcrypt = require('bcrypt')
const enviarEmail = require('../handlers/email')
exports.autenticarUsuario = passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/iniciar-sesion',
    failureFlash: true,
    badRequestMessage: 'Ambos campos son obligatorios'
})
exports.usuarioAutenticado = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next()
    }
    return res.redirect('/iniciar-sesion')
}
exports.cerrarSesion = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/iniciar-sesion')
    })
}
exports.enviarToken = async (req, res) => {
    const usuario = await Usuarios.findOne({ where: { email: req.body.email } })
    if (!usuario) {
        req.flash('error', 'Correo no registrado')
        res.redirect('/reestablecer')
    }
    usuario.token = crypto.randomBytes(20).toString('hex')
    usuario.expiracion = Date.now() + 3600000

    await usuario.save()

    const resetUrl = `http://${req.headers.host}/reestablecer/${usuario.token}`

    await enviarEmail.enviar({
        usuario,
        subject: 'Password reset',
        resetUrl,
        archivo: 'reestablecer-password'
    })
    req.flash('correcto', 'Revisa tu correo electronico')
    res.redirect('/iniciar-sesion')
}

exports.validarToken = async (req, res) => {
    const usuario = await Usuarios.findOne({
        where: {
            token: req.params.token
        }
    })
    if (!usuario) {
        req.flash('error', 'No valido')
        res.redirect('/reestablecer')
    }
    res.render('resetPassword', {
        nombrePagina: 'Reestablecer contraseña'
    })
}
exports.actualizarPassword = async (req, res) => {
    const usuario = await Usuarios.findOne({
        where: {
            token: req.params.token,
            expiracion: {
                [Op.gte]: Date.now()
            }
        }
    })
    if (!usuario) {
        req.flash('error', 'No valido')
        res.redirect('/reestablecer')
    }

    usuario.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10))
    usuario.token = null
    usuario.expiracion = null
    await usuario.save()
    req.flash('correcto', 'Tu password se ha modificado correctamente')
    res.redirect('/iniciar-sesion')
}