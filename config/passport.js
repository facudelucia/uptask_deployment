var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
 
//We will need the models folder to check passport agains
var Usuarios = require('../models/Usuarios');
 
// Local Strategy - login con credenciales propias
// Local Strategy - login con credenciales propias
passport.use(
    new LocalStrategy(
        // Our user will sign in using an email, rather than a "username"
        {
            usernameField: 'email',
            passwordField: 'password'
        },
        function(email, password, done) {
            // When a user tries to sign in this code runs
            Usuarios.findOne({
                where: {
                    email,
                    activo: 1
                }
            }).then(function(usuario) {
                // If there's no user with the given email
                if (!usuario) {
                    return done(null, false, {
                        message: 'Esa Cuenta no Existe'
                    });
                }
                if (!usuario.verificarPassword(password)) {
                    // If there is a user with the given email, but the password the user gives us is incorrect
                    return done(null, false, {
                        message: 'Password Incorrecto'
                    });
                }
                // If none of the above, return the user
                // console.log(usuario);
                return done(null, usuario);
            });
        }
    )
);
//
// In order to help keep authentication state across HTTP requests,
// Sequelize needs to serialize and deserialize the user
// Just consider this part boilerplate needed to make it all work
passport.serializeUser(function(usuario, cb) {
    cb(null, usuario);
});
//
passport.deserializeUser(function(obj, cb) {
    cb(null, obj);
});
//
// Exporting our configured passport
module.exports = passport;