import passport from 'passport';
import localStrategy from 'passport-local';
import passportCustom from 'passport-custom';
import userModel from '../models/User.js';

const LocalStrategy = localStrategy.Strategy;
const CustomStrategy = passportCustom.Strategy;

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, async (email, password, done) => {
    try {
        const user = await userModel.findUserByEmail(email);
        if (!user || !userModel.validatePassword(password, user.salt, user.password)) {
            return done(null, null, {
                status: 400,
                message: 'Login and/or Password is invalid'
            });
        }
        delete user.salt;
        delete user.password;
        return done(null, user, {
            status: 200,
            message: 'Logged In Successfully'
        });
    } catch (e) {
        return done(new Error('Authentification failed'), null, {
            status: 500,
            message: 'Error'
        });
    }
}));

passport.use(new CustomStrategy(
    async function (req, done) {
        try {
            const user = await userModel.findUserByEmail(req.body.email);
            delete user.salt;
            delete user.password;
            done(null, user, {
                status: 200,
                message: 'Logged In Successfully'
            });
        } catch (e) {
            return done(new Error('Activation failed'), null, {
                status: 500,
                message: 'Error'
            });
        }
    }
));

passport.serializeUser(function (user, done) {
    done(null, user.email);
});

passport.deserializeUser(function (email, done) {
    done(null, {
        email: email
    });
});

export default passport;
