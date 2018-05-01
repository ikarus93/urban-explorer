const express = require('express'),
      app = express(),
      authRoutes = require('./routes/auth'),
      parser = require('body-parser');
      
//===**MIDDLEWARE**===//
//Parse request body
app.use(parser());


//===Authentication Routes===//
app.use('/auth', authRoutes);




app.listen(8080 || process.env.$PORT, () => {
    console.log('Server is up and running')
})