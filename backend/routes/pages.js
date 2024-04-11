const express = require("express")
const router = express.Router()

router.get('/', (req, res) => {
    res.send("WELCOME")
})

router.get('/register', (req,res) => {

})

module.exports = router