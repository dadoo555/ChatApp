const express = require('express')
const router = express.Router()
const connection = require('./db/db.js').connection
const multer = require('multer')
const upload = 
    multer({storage: multer.diskStorage({
            destination: function(req, file, callback){
                callback(null, __dirname + '/public/images/profil/')
            },
            filename: function(req, file, callback){
                callback(null, file.originalname)
            }
        }),
        limits: {
            files: 1,
            fieldNameSize: 300,
            fileSize: 1048576
        }
    })

const bodyParser = require('body-parser')
const urlEncodedParser = bodyParser.urlencoded({ extended: false })
router.use(urlEncodedParser)

// .......... Session ........
const {checkUser, sessionHandler, cookieParser} = require('./session.js')
router.use(sessionHandler)
router.use(cookieParser())


router.use(express.json())

router.get('/', (req,res)=>{
    res.send('api page')
})

router.get('/users', (req,res)=>{
    
    if (!req.session.user.id){
        res.status(401).json({status: 'unauthorized'})
    }
    const sqlQuery =   
        `SELECT id, name, profile_picture
        FROM users
        WHERE name NOT IN 
            (SELECT u2.name
                FROM chats c
                JOIN participations p1
                    ON p1.chat_id = c.id
                JOIN participations p2
                    ON p2.chat_id = c.id
                JOIN users u2
                    ON u2.id = p2.user_id
                WHERE p1.user_id = '${req.session.user.id}' 
                AND p2.user_id != '${req.session.user.id}'
        ORDER BY u2.name) AND id != '${req.session.user.id}'`
    connection.promise().query(sqlQuery).then((results)=>{
        const [data] = results
        res.status(200).json(data)
    }).catch(err=>{
        res.status(500).json({status: 'Error DB users list'})
    })
})

router.post('/users/new', upload.single('picture'), (req,res)=>{
console.log(req.files)
console.log(req.body)
    const sqlUsers = `SELECT nickname FROM users`
    const sqlQuery =    
        `INSERT INTO users (nickname, name, password, profile_picture, status)
        VALUES ('${req.body.nickname}','${req.body.name}','${req.body.password}','${req.body.picturename}','Free to chat')`
                 
    connection.promise().query(sqlUsers).then((results)=>{
        const [nicknames] = results
        const matchedNickname = nicknames.find(each=> each.nickname.toUpperCase() === req.body.nickname.toUpperCase())
        if(matchedNickname){
            throw new Error("EXISTING_NICKNAME")
        }
        return connection.promise().query(sqlQuery)
    }).then(()=>{
        res.status(200).json({status: 'User register ok'})
    }).catch((err)=>{
        if(err.message === "EXISTING_NICKNAME"){
            res.status(409).json({status: 'Nickname already used'})
        }else {
            res.status(500).json({status: 'Error register new user'})
        }
    })

})

router.get('/chats', checkUser,(req,res)=>{
    
    //Chats List
    const sqlChats =    `SELECT c.id, u2.name, u2.profile_picture, SUBSTRING(m.text, 1, 30) AS lastmessage, m.creation_time, m2.count AS unread
                        FROM chats c
                        JOIN participations p1
                            ON p1.chat_id = c.id
                        JOIN participations p2
                            ON p2.chat_id = c.id
                        JOIN users u2
                            ON u2.id = p2.user_id
                        LEFT JOIN (SELECT * FROM messages
                            WHERE id in (SELECT max(id) FROM messages GROUP BY chat_id)) m
                            ON p1.chat_id = m.chat_id
                        LEFT JOIN ( SELECT chat_id, COUNT(id) as count 
                                    FROM messages
                                    WHERE messages.read = '0'  AND sender_id != '${req.session.user.id}'
                                    GROUP BY 1) m2
                            ON c.id = m2.chat_id
                        WHERE p1.user_id = '${req.session.user.id}' AND p2.user_id != '${req.session.user.id}'
                        ORDER BY m.creation_time DESC`

    connection.promise().query(sqlChats).then((results)=>{
        const [data] = results
        res.status(200).json(data)
    }).catch(err=>{
        res.status(401).json({status: 'DB Error'})
    })

})

router.post('/chats/new',(req,res)=>{
    const sqlQueryInsert = `INSERT INTO chats VALUES ();`
    const sqlLastId = `SELECT last_insert_id() AS lastid;`
    let chat_id = []

    connection.promise().query(sqlQueryInsert).then(()=>{
        return connection.promise().query(sqlLastId)
    }).then((data)=>{
        chat_id = data[0][0].lastid

        return connection.promise().query(
           `INSERT INTO participations
                (chat_id, user_id)
            VALUES 
                ('${chat_id}', '${req.body.chat_data.currentUserId}'),('${chat_id}', '${req.body.chat_data.otherUserId}')`
        )        
    }).then(() =>{
        res.status(200).json({status: 'New chat added', chat_id: chat_id})
    }).catch(err =>{
        res.status(500).json({status: 'Error add new chat: ' + err})
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

router.put('/chats/:id/messages/:userid/read', (req,res)=>{
    const sqlQuery =   `UPDATE messages m
                        SET m.read = '1'
                        WHERE chat_id = '${req.params.id}' and sender_id != '${req.params.userid}'`
    connection.promise().query(sqlQuery).then((response)=>{
        res.status(200).json({status: 'Messages read'})
    }).catch(err =>{
        res.status(500).json({status: 'Error make message read'})
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

router.get('/sessions/me/destroy', (req,res)=>{
    if (req.session){
        req.session.destroy()
        res.status(200).json({status: 'Logoff ok'})
    } else {
        res.status(401).json({status: 'No user to logoff'})
    }
})

module.exports = router