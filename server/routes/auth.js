const express = require("express"),
      router = express.router();


router.post("/login", (req, res, next) => {
    res.send("OK")
})


module.exports = router;