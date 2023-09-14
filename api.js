const express = require('express')
const router = express.Router()
const connection = require('./db.js').connection

// .......... Session ........
const {checkUser, sessionHandler, cookieParser} = require('./session.js')
router.use(sessionHandler)
router.use(cookieParser())


router.use(express.json())

router.get('/', (req,res)=>{
    res.send('api page')
})

router.get('/account/name',(req,res)=>{
    res.status(200).json({name: 'Eduardo'})
})


router.get('/chats', checkUser,(req,res)=>{
    res.status(200).json(
    [{
        name: "Renan",
        lastmessage: "combinamos entao",
        picture: "x",
        id: "123"
    },
    {
        name: "Susi",
        lastmessage: "Bis gleich",
        picture: "x" ,
        id: "124"
    }])
})

router.get('/chats/:id/messages',(req,res)=>{
    if (req.params.id == 123){
        res.status(200).json({
            name: "Renan",
            picture: "x",
            messages: ["mensagens renan 1", 
                        "mensagens renan 2"]
            }
        )
    } else {
        res.status(200).json({
            name: "Susi",
            picture: "x",
            messages: ["mensagens susi 1", 
                        "mensagens susi 2"]
            }
        )
    }
})

router.post('/sessions',(req,res)=>{
    
    //.... new session .....
    const sqlQuery = `SELECT * FROM users WHERE nickname = '${req.body.data.username}'`
    connection.promise().query(sqlQuery).then((results)=>{
        const [dataDb] = results
        
        // User not registered
        if (!dataDb[0]){
            res.status(401).json({status: 'User not found'})
            return
        }

        if (dataDb[0].password == req.body.data.password){
            // Password right
            req.session.user = dataDb[0]
            res.status(200).json({status: 'ok'})
        } else {
            //Wrong password
            res.status(401).json({status: 'User found, wrong password'})
        }
    })
})

router.get('/sessions/me', (req,res)=>{
    if (req.session.user){
        res.status(200).json({user: req.session.user})
    } else {
        res.status(401).json({status: 'unauthorized'})
    }
})

module.exports = router