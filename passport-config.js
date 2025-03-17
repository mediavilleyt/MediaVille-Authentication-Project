const localStrat = require('passport-local').Strategy
const bcrypt = require('bcrypt');

function init(passport, connection) {
    const authenticateUser = async (username, password, done) => {
        connection.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
            if (err) {
                return done(err);
            }
            if (results.length === 0) {
                return done(null, false, { message: 'No user with that username' });
            }

            const user = results[0];

            try {
                if (await bcrypt.compare(password, user.password)) {
                    return done(null, user);
                } else {
                    return done(null, false, { message: 'Password incorrect' });
                }
            } catch (e) {
                return done(e);
            }
        });
    };

    passport.use(new localStrat({ usernameField: 'username' }, authenticateUser));
    passport.serializeUser((user, done) => { done(null, user.id); });
    passport.deserializeUser((id, done) => { 
        connection.query('SELECT * FROM users WHERE id = ?', [id], (err, results) => {
            if (err) {
                return done(err);
            }
            return done(null, results[0]);
        });
    });
}


module.exports = init;