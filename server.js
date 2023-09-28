const express = require('express')
const app = express()
const port = 3000
const path = require('path')
const api = require('./api.js')
const connection = require('./db/db.js').connection


// .......... Session ........
const {checkUser, sessionHandler, cookieParser} = require('./session.js')
app.use(sessionHandler)
app.use(cookieParser())

//............. API ...........
app.use('/chat/api', api)

//............ react ...........
app.use('/chat/', express.static('build'))
app.use('/chat/public', express.static('public'))

app.get('/chat/*', (req,res)=>{
    res.sendFile(path.join(__dirname, "build", "index.html"))
})


app.listen(port)