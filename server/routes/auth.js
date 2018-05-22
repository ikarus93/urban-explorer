/* Routes related to User Signup and Authentication */

const express = require('express'),
      router = express.Router(),
      { dbUserPassword, jwtSecret } = require('../../config'),
      connection = require('../db/connection'),
      { isValidEmail, hashPassword, comparePasswords } = require('../helpers/helpers'),
      jwt = require('jsonwebtoken'),
      passport = require('passport'),
      passportJWT = require('passport-jwt');
      
//===Passport Authentication Options===//   
let ExtractJwt = passportJWT.ExtractJwt;
let JwtStrategy = passportJWT.Strategy;

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: jwtSecret
}
let strategy = new JwtStrategy(jwtOptions, (payload, next) => {
    const client = connection('ubuntu', dbUserPassword);
    client.connect();
    client.query("SELECT * FROM users WHERE id = $1", [payload.id], (err, res) => {
        if (res.rows) {
            return next(null, res);
        } else {
           return  next(null, false);
        }
    }); 

})
passport.use(strategy);


router.post('/signup', (req, res, next) => {
    //Creates User entry in user table
    const [name, email, password] = [req.body.name, req.body.email, req.body.password];
    const client = connection('ubuntu', dbUserPassword);
    (async () => {
        
        await client.connect();
        let hash = await hashPassword(password);
        await client.query("INSERT INTO users(name, password, email) VALUES($1,$2,$3)", [name, hash, email]);
        res.json({type: 'success', status: 200, message: 'You\'ve successfully signed up', data: {}});
    })().catch(e => {
        let err;
        if (e.code === '23502') {
            err = new Error('Username or Email already exists');
            err.status = 409;
            err.type = 'Duplicate Error';
        } else {
            err = new Error('Error handling database request');
            err.status = 500;
            err.type = 'Database Error';
        }
        
        return next(err);
        
    })
})


router.post('/login', (req, res, next) => {
    //Validates user is in database and creates session token
    const [user, password] = [req.body.user, req.body.password];
    const client = connection("ubuntu", dbUserPassword);
    
    //Check whether the request was made with email or username
    let q = isValidEmail(user) ? "SELECT * from users WHERE email=$1" : "SELECT * from users WHERE name=$1";
    (async () => {
        
        await client.connect();
        const result = await client.query(q, [req.body.user]);
        if (!result.rows.length) {
            //if username or email is not found
            const err = new Error('Username or Email doesn\'t exist');
            err.status = 422;
            err.type = 'Unprocessable Entity';
            return next(err);
        }
        let passwordsMatch = await comparePasswords(req.body.password, result.rows[0].password);
        if (passwordsMatch) {
            //sign jwt with retrieved user id
            const token = jwt.sign({id: result.rows[0].id}, jwtOptions.secretOrKey);
            return res.json({type: 'success', status: 200, message: 'You\'ve successfully logged in', data: {token: token}});
        } else {
            const err = new Error(`Username and Password don't match.`);
            err.status = 403;
            err.type = 'Authentication Error';
            return next(err);
        }
        
    })().catch(e => {
        console.log(e);
        const err = new Error('Error handling database request');
        err.status = 500;
        err.type = 'Database Error';
        return next(err);
        
    });
})

router.get('/status', passport.authenticate('jwt', {session: false}), (req, res, next) => {
    res.json("OK")
})

module.exports = router;