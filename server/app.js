const express = require("express"),
      app = express(),
      authRoutes = require("./routes/auth");
      

//===Authentication Routes===//
app.use("/", authRoutes);




app.listen(8080 || process.env.$PORT, () => {
    console.log("Server is up and running")
})