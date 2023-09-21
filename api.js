const express = require('express')
const router = express.Router()
const connection = require('./db/db.js').connection

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
    
    //Chats List
    const sqlChats =    `SELECT c.id, u2.name, u2.profile_picture, SUBSTRING(m.text, 1, 30) as lastmessage, m.creation_time
                        FROM chats c
                        JOIN participations p1
                            ON p1.chat_id = c.id
                        JOIN participations p2
                            ON p2.chat_id = c.id
                        JOIN users u2
                            ON u2.id = p2.user_id
                        JOIN (SELECT * FROM messages
                            WHERE id in (SELECT max(id) FROM messages group by chat_id)) m
                            ON p1.user_id = m.sender_id and p1.chat_id = m.chat_id
                        WHERE p1.user_id = '${req.session.user.id}' and p2.user_id != '${req.session.user.id}'
                        ORDER BY m.creation_time DESC`

    connection.promise().query(sqlChats).then((results)=>{
        const [data] = results
        res.status(200).json(data)
    }).catch(err=>{
        res.status(401).json({status: 'DB Error'})
    })

})

router.get('/chats/:id/messages',(req,res)=>{
    
    const sqlQuery =    `SELECT * FROM messages
                         WHERE chat_id = '${req.params.id}'`
    connection.promise().query(sqlQuery).then((results)=>{
        const [data] = results
        res.status(200).json(data)
    }).catch(err=>{
        res.status(500).json({status: 'Error DB messages'})
    })
})

router.post('/chats/:id/messages/new', (req,res)=>{

    sqlQuery = `INSERT INTO messages
                    (chat_id, sender_id, text)
                VALUES
                    ('${req.body.data.chat_id}', '${req.body.data.sender_id}', '${req.body.data.text}')`
    connection.promise().query(sqlQuery).then(()=>{
        res.status(200).json({status: 'New message sended'})
    }).catch(err=>{
        res.status(500).json({status: 'Error DB new message'})
    })
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
    }).catch(err =>{
        res.status(401).json({status: 'DB Error'})
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