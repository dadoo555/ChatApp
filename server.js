const express = require('express')
const app = express()
const port = 3000
const path = require('path')
const api = require('./api.js')
const connection = require('./db.js').connection


// .......... Session ........
const {checkUser, sessionHandler, cookieParser} = require('./session.js')
app.use(sessionHandler)
app.use(cookieParser())

//............. API ...........
app.use('/api', api)

//............ react ...........
app.use(express.static('build'))
app.use('/public', express.static('public'))

app.get('/*', (req,res)=>{
    res.sendFile(path.join(__dirname, "build", "index.html"))
})


app.listen(port)