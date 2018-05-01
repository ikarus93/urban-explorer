/* Routes related to User Signup and Authentication */

const express = require('express'),
      router = express.Router(),
      { dbUserPassword } = require('../../config'),
      connection = require('../db/connection'),
      { isValidEmail, hashPassword, comparePasswords } = require('../helpers/helpers');

router.post('/signup', (req, res, next) => {
    //Creates User entry in user table
    const [name, email, password] = [req.body.name, req.body.email, req.body.password];
    console.log(req.body);
    const client = connection("ubuntu", dbUserPassword);
    
    (async () => {
        
        await client.connect();
        let hash = await hashPassword(password);
        const res = await client.query("INSERT INTO users(name, password, email) VALUES($1,$2,$3)", [name, hash, email]);
    
        res.json({type: "success", status: 200, message: "You've successfully signed up"});
    })().catch(e => {
        
        const err = new Error("Error handling database request");
        err.status = 500;
        err.type = "Database Error";
        return next(err);
        
    })
})


router.post('/login', (req, res, next) => {
    //Validates user is in database and creates session token
    
    const [user, password] = [req.body.user, req.body.password];
    const client = connection("ubuntu", dbUserPassword);
    let q = isValidEmail(user) ? "email" : "name";
    
    (async () => {
        
        await client.connect();
        const res = await client.query("SELECT * from users WHERE $1=$2", [q, req.body.user]);
        let passwordsMatch = await comparePasswords(req.body.password, res[0][password]);
        
        if (passwordsMatch) {
            res.json({type: "success", status: 200, message: "You've successfully logged in"});
        } else {
            const err = new Error(`${q.toUpperCase()} and Password don't match.`);
            err.status = 403;
            err.type = "Authentication Error";
            return next(err);
        }
        
    })().catch(e => {
        
        const err = new Error("Error handling database request");
        err.status = 500;
        err.type = "Database Error";
        return next(err);
        
    });
})

router.post("/signup", (req, res, next) => {
    
})


module.exports = router;