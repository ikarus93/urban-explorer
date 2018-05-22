/* Entry File */

const express = require('express'),
      app = express(),
      authRoutes = require('./routes/auth'),
      bodyParser = require('body-parser');
      
//===**MIDDLEWARE**===//

//Parse request body for content-type : application/json
app.use(bodyParser.json())
//===**ROUTES**===//

//===Authentication Routes===//
app.use('/auth', authRoutes);

//===Error Handling===//
app.use((err, req, res, next) => {
    res.json({type: err.type, status: err.status, message: err.message});
})


app.listen(8080 || process.env.$PORT, () => {
    console.log('Server is up and running')
})