require('dotenv').config()
const express = require("express");
const mysql = require("mysql2")
const cors = require('cors')
const app =  express();
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:false}))

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME

})

db.connect((error) => {
    if(error) console.log(error);
    else console.log("MYSQL Connected...")
})


app.use('/', require('./routes/pages'))
app.use('/auth', require('./routes/auth'))


const PORT = process.env.PORT | 5000;
app.listen(PORT, () => {
    console.log(`Server started on port: ${PORT}`);
})

