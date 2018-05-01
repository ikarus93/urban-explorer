/* General Helper Functions */

const bcrypt = require('bcrypt');

function isValidEmail(q) {
    //Arguments: q(typeof "string")
    //Returns: Boolean(Indicating Input String is a valid email address)
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(q);
}

function hashPassword(password) {
    //Arguments: password(typeof "string")
    //Returns: hashed password as Promise
    return new Promise((resolve, reject) => {
        bcrypt.hash(password, 10, function(err, hash) {
        if (err) return reject(err);
        return resolve(hash);
        });
    });
}

function comparePasswords(password, hash) {
    //Arguments: password(typeof "string"), hash(typeof "string")
    //Returns: resolved or rejected promise with Boolean value based on passwords matching
    return new Promise((resolve, reject) => {
        bcrypt.compare(password, hash, (err, res) => {
            if (res) {
                return resolve(true);
            } else {
                return resolve(false);
            }
        })
    })
}

module.exports = {
    isValidEmail: isValidEmail,
    hashPassword: hashPassword,
    comparePasswords: comparePasswords
}