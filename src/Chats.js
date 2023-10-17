import React, { useEffect, useState, useRef } from "react"
import './css/Chats.css'
import './css/Messages.css'
import { useNavigate } from 'react-router-dom'

function ChatListItem (props){
    let source = `/chat/public/images/profil/${props.picture}`

    //format dateapi
    const date = new Date(props.lastmessagetime)
    const dateDay = date.getDate()
    const dateMonth = date.getMonth() + 1
    const dateYear = date.getFullYear()
    const todayDate = new Date()
    const todayDay = todayDate.getDate()
    const todayMonth = todayDate.getMonth() + 1
    const todayYear = todayDate.getFullYear()
    let time = ''

    //Date time ........
    if (dateDay === todayDay && dateMonth === todayMonth && dateYear === todayYear){
        //today
        time = ("0" + date.getHours()).slice(-2) + ':' + ("0" + date.getMinutes()).slice(-2)
    } else if (dateDay + 1 === todayDay){
        //yesterday
        time = ' Yesterday'
    } else {
        //other date
        time = dateDay + '/' + dateMonth + '/' + dateYear
    }

    //Unread msg counter.......
    let unreadMessages = []
    if (!props.unreadCounter == 0){
        unreadMessages = <div className="chatlist-unread">{props.unreadCounter}</div>
    } else {
        unreadMessages = <div></div>
    }

    //chat selected marker ...
    let selectedChat = []
    if (props.isSelected){
        selectedChat = <ChatSelectedTag/>
    }


    return (
        <div onClick={props.onSelected} className='chatlist-item'>
            <img src={source} className='chatlist-picture'></img>
            <div className="chatlist-info">
                <p className='chatlist-name'>{props.name}</p>
                <p className="chatlist-lastmessage">{props.lastmessage}</p>
            </div>
            <div className="chatlist-data">
                <div className="chatlist-time">{time}</div>
                {unreadMessages}
            </div>
            {selectedChat}
        </div>
    )
}

function ChatSelectedTag (){

    return(
        <div className="selected_chat"></div>
    )
}

function ChatList (props){
    const data = props.chats

    let listChats = []
    data.forEach((chat)=>{
        
        const chooseCurrentItem = ()=>{
            props.changeCurrentChat(chat)
        }

        let isSelectedValue = undefined
        if (props.currentChatID){
            if (props.currentChatID.id == chat.id){
                isSelectedValue = true
            }    
        }
        
        listChats.push(<ChatListItem 
                            key={chat.id}   
                            name={chat.name}
                            lastmessage={chat.lastmessage}
                            picture={chat.profile_picture}
                            onSelected={chooseCurrentItem}
                            lastmessagetime={chat.creation_time}
                            unreadCounter={chat.unread}
                            isSelected={isSelectedValue}
                        ></ChatListItem>)
    })
               
    return (
        <div id="chatlist-box">
            <ul>
                <li>{listChats}</li>
            </ul>
        </div>
    )
}

function CurrentChatMenu (props){
    let source = `/chat/public/images/profil/${props.currentChat.profile_picture}`
    return (  
        <div className='top-menu-current-chat'>
            <img src={source}></img>
            <p>{props.currentChat.name}</p>
        </div>
    )
}

function CurrentChatMessageItem(props){
    const classMsgContainer = `msg-item-container sender-${props.sender_id}-container`
    const classMsg = `single-msg-item sender-${props.sender_id}`
    const date = new Date(props.datetime)
    let h = date.getHours()
    h = ("0" + h).slice(-2);
    let m = date.getMinutes()
    m = ("0" + m).slice(-2);
    const time = h + ':' + m

    let label = []
    if (props.datelabel != 'no'){
        label = <div className="label-date-container">
                    <div className="label-date-chat">
                        {props.datelabel}
                    </div>
                </div>
    }

    let unreadMessagesLabel = []
    if (props.notread == 1){
        unreadMessagesLabel = 
            <div className="label-date-container">
                <div className="label-notread">
                    Unread messages
                </div>
            </div>
    }

    return (
        <li>
            {unreadMessagesLabel}
            {label}
            <div className={classMsgContainer}>
                <div className={classMsg}>
                    <p className="msg-text">{props.text}</p>
                    <div className="msg-time">
                        <p>{time}</p>
                    </div>
                </div>
            </div>
        </li>
    )
}

function CurrentChatMessages (props){
    const data = props.msgs
    const monthNames = ["January", "February", "March", "April", "May", "June",
                                    "July", "August", "September", "October", "November", "December"]
    let listMessages = []
    let lastDay = undefined
    let notread = undefined

    data.forEach(function(msg, i){
        
        //sender id class
            let msgSender = 'other'
            if (msg.sender_id == props.currentUserId){msgSender = 'me'}

        //label days
            let datelabel = []
            let date = new Date(msg.creation_time)
            if (i == 0){lastDay = new Date(msg.creation_time)}
            
            //first msg
            if (i == 0){
                datelabel = date.getDate() + ' ' + monthNames[date.getMonth()] + ' ' + date.getFullYear()
            } else if (lastDay.getDate() != date.getDate()){
                datelabel = date.getDate() + ' ' + monthNames[date.getMonth()] + ' ' + date.getFullYear()
            } else {
                datelabel = 'no'
            }

            lastDay = new Date(msg.creation_time)

        //Not read label
            if (notread == 1){notread = 0}
            if (msg.read == 0 && notread == undefined && props.currentUserId != msg.sender_id){
                notread = 1
            }
           
        //PUSH
        listMessages.push(<CurrentChatMessageItem   text={msg.text} key={msg.id} notread={notread}
                                                    sender_id={msgSender} datelabel={datelabel} 
                                                    datetime={msg.creation_time}></CurrentChatMessageItem>)
    })

    return (
        <div className='current-chat-box'>
            <ul>
                {listMessages}
                <AlwaysScrollToBottom/>
            </ul>
        </div>
    )
}

function ChatMenu (props){

    const profilePicture = `/chat/public/images/profil/${props.picture}`
    return (
        <div className='menu-chats'>
            <div className="menu-chats-me">
                <img className="menu-chats-picture" src={profilePicture}></img>
                <p>{props.name}</p>
            </div>
            <div className="menu-chat-buttons">
                <div className="btn-newchat" onClick={props.btn_newchat}>
                    <p>+</p>
                </div>
                <div className="btn-settings" onClick={props.btn_settings}>
                    <p>&#65049;</p>
                </div>
            </div>
        </div>
    )
}

function SearchBox (){
    return(
        <div id="searchbox">
            <input type="text" placeholder="Find a friend..."></input>
        </div>
    )
}


function SendTextBox (props){
    const handlerEnterPress = (e)=>{
        if(e.key === 'Enter'){
            props.fSend()
        }
    }
    return(
        <div className="textbox-container">
            <input  type="text" 
                    placeholder="Write a message here..." 
                    value={props.value}
                    onKeyUp={handlerEnterPress}
                    onChange={(e)=>props.changeEvent(e.currentTarget.value)}></input>
            <button type="submit" onClick={props.fSend}>Send</button>
            
        </div>
    )
}

const SettingsMenu = (props) => {
    
    let menuSettings = {}
    if (props.show == true){
        menuSettings = 
            <div className="menu-settings-list">
                <div className="menu-settings-item" onClick={props.account}><b>Profile Settings</b></div>
                <div className="menu-settings-item" onClick={props.logoff}><b>Logout</b></div>
            </div>
    } else {
        menuSettings = <div></div>
    }
    
    return(
        <div id="menu-settings">
            {menuSettings}
        </div>
    )
}

const AlwaysScrollToBottom = () => {
    const elementRef = useRef();
    useEffect(() => elementRef.current.scrollIntoView());
    return <div ref={elementRef} />;
}


const NewChatList = (props)=>{
    if (props.show == false){
        return
    }
    
    let list = []
    let data = props.usersData
    let source = []
    data.forEach((user) =>{
        source = `/chat/public/images/profil/${user.profile_picture}`
        let onclick = ()=>{
            props.onNewChatClick(user)
        }
        list.push(
            <li key={user.id}>
                <div className='chatlist-item' onClick={onclick}>
                    <img src={source} className='chatlist-picture'></img>
                    <div className="chatlist-info">
                        <p className='chatlist-name'>{user.name}</p>
                        
                    </div>
                    
                </div>
            </li>
        )
    }) 
        
    return(
        <div className="newchat-box">
            <h1>New conversation...</h1>
            <ul>
                {list}
            </ul>
        </div>
    )
}


let scheduledUpdateId;

// ............... Chats APP ...................
const Chats = ()=>{

    const [chats, setChats] = useState([])
    const [msgs, setMsgs] = useState([])
    const [currentChat, setCurrentChat] = useState(undefined)

    const currentChatRef = useRef(currentChat)
    currentChatRef.current = currentChat
    const [currentUser, setCurrentUser] = useState(undefined)
    const currentUserRef = useRef(currentUser)
    currentUserRef.current = currentUser

    const [newMessage, setNewMessage] = useState(undefined)
    const [settingsMenu, setSettingsMenu] = useState(false)
    const [showNewChats, setShowNewChats] = useState(false)
    const [usersList, setUsersList] = useState([])
    const navigate = useNavigate()


    const initialized = useRef(false)


    const loadMessagesForCurrentChat = (chat, user) => {
        return fetch(`/chat/api/chats/${chat.id}/messages`)
        .then(response => {
            return response.json()
        }).then(data =>{
            setMsgs(data)
        }).then(()=>{
            return fetch(`/chat/api/chats/${chat.id}/messages/${user.id}/read`, {
                method: 'PUT'    
            })
        })
    }

    useEffect(() => { 
        if(!initialized.current){
            initialized.current = true
            const updateChat = ()=>{

                fetch('/chat/api/sessions/me')
                .then(response=>{
                    if (response.ok){
                        console.log('autorizado')
                        return response.json()
                    } else {
                        throw new Error('Unauthorized')
                    }
                }).then((data)=>{
                    setCurrentUser(data.user)
                }).then(()=>{
                    return fetch('/chat/api/chats')
                }).then(res => {
                    return res.json()
                }).then(data => {
                    setChats(data)
                    if(currentChatRef.current){
                        loadMessagesForCurrentChat(currentChatRef.current, currentUserRef.current)
                    }
                }).then(() => {
                    scheduledUpdateId = setTimeout(() => {
                        clearTimeout(scheduledUpdateId)
                        updateChat()
                    }, 3000)
                }).catch(err =>{
                    if (err.message == 'Unauthorized'){
                        navigate('/chat/login')
                    }
                })
            }
            updateChat()
            
        }
        
    }, []);






    // useEffect(() => { 
    //     fetch('/chat/api/sessions/me')
    //     .then(response=>{
    //         if (response.ok){
    //             console.log('autorizado')
    //             return response.json()
    //         } else {
    //             throw new Error('Unauthorized')
    //         }
    //     }).then((data)=>{
    //         setCurrentUser(data.user)
    //     }).then(()=>{
    //         return fetch('/chat/api/chats')
    //     }).then(res => {
    //         return res.json()
    //     }).then(data => {
    //         setChats(data)
            
    //     }).catch(err =>{
    //         if (err.message == 'Unauthorized'){
    //             navigate('/chat/login')
    //         }
    //     })
    // }, []);

    if (!currentUser){
        return <div></div>
    }


    const addNewChat = (user)=>{
        
        let chat_data = {
            currentUserId: currentUser.id,
            otherUserId: user.id
        }

        //criar novos registros na DB
        fetch('/chat/api/chats/new', {
            headers: {
                Accept: 'application/json',
                "Content-Type": "application/json"
            },
            method: 'POST',
            body: JSON.stringify({chat_data})
        }).then(response => {
            if (response.ok){
                return response.json()
            } else {
                alert('Error new chat')
            }

        }).then((results)=>{

            const lastid = results.chat_id
            
            //alterar o chatlist
            let newChats = [...chats]
            let newChat = {}
                newChat.id = lastid
                newChat.name = user.name
                newChat.profile_picture = user.profile_picture 
                newChat.lastmessage = ''
                newChat.creation_time = new Date()
                newChat.unread = 0
            newChats.unshift(newChat)
            setChats(newChats)

            //remover do newUsersList
            let newUsersList = [...usersList]
            let usersIndex = newUsersList.findIndex(u => u.id == user.id)

            newUsersList.splice(usersIndex, 1)

            setUsersList(newUsersList)
            setShowNewChats(false)
            setCurrentChat(newChat)
            setNewMessage('')

        }).catch(err=>{
            throw err
            setShowNewChats(false)
        })
    }

    const changeCurrentChat = (chat)=>{
        setCurrentChat(chat)
        setNewMessage('')
        loadMessagesForCurrentChat(chat, currentUser).then((response)=>{
            if (response.ok){
                //update unread counter on chats state ..........
                let newChats = [...chats]
                let newChat = {...chat}
                      newChat.unread = 0
                let chatIndex = chats.findIndex(c => c.id == chat.id)
                newChats[chatIndex] = newChat
                setChats(newChats)
                
            }
        }).catch((err)=>{
            throw err
        })

    }

    const handleChangeNewMessage = (value)=>{
        setNewMessage(value)
    }

    const sendNewMessage = ()=>{
        
        if (!currentChat){
            return
        }

        if (newMessage === ''){
            return
        }

        const data = {
            'text': newMessage,
            'sender_id': currentUser.id,
            'chat_id': currentChat.id
        }

        fetch(`/chat/api/chats/${currentChat.id}/messages/new`, {
            headers: {
                Accept: 'application/json',
                "Content-Type": "application/json"
            },
            method: 'POST',
            body: JSON.stringify({data})
        }).then((response) =>{
            if (response.ok){

                const datetime = new Date().toJSON() 

                // alterar o chatlist
                let newChats = [...chats]
                let newChat = {...currentChat}
                      newChat.lastmessage = 'You: ' + newMessage
                      newChat.creation_time = datetime
                      newChat.unread = 0  
                let chatIndex = chats.findIndex(c => c.id == currentChat.id)

                    //alterar a ordem dos chats
                    if (chatIndex > 0) {
                        newChats.splice(chatIndex, 1);
                        newChats.unshift(newChat);
                    } else {
                        newChats[0] = newChat
                    }
                
                setChats(newChats)

                //alterar a messages
                if (msgs[msgs.length - 1]){
                    setMsgs([...msgs, {'id': msgs[msgs.length - 1].id + 1,'sender_id': currentUser.id,'text': newMessage, 'creation_time': datetime}])            
                } else {
                    setMsgs([...msgs, {'id': '0','sender_id': currentUser.id,'text': newMessage, 'creation_time': datetime}])     
                }
                setNewMessage('')
                
                
                
            } else {
                alert('send new message error')
            }
        }).catch(err=>{
            throw err
        })
        
    }

    const toggleMenuSettings = ()=>{
        if (settingsMenu == false){
            setSettingsMenu(true)
            setShowNewChats(false)
        } else {
            setSettingsMenu(false)
        }
    }

    const toggleNewChat = ()=>{
        if (showNewChats == false){

            fetch('/chat/api/users').then((res)=>{
                return res.json()
            }).then((data)=>{
                setUsersList(data)
            }).catch(err =>{
                alert(err)
            })

            setShowNewChats(true)
            setSettingsMenu(false)
        } else {
            setShowNewChats(false)
        }
    }

    const logoff = () => {
        fetch('/chat/api/sessions/me/destroy')
        .then((response)=>{
            if (response.ok){
                navigate('/chat/login')
            }
        }).catch(err =>{
            alert(err)
        })
    }

    const goToAccount = () => {
        navigate('/chat/account')
    }

    let showCurrentMenu = []
    let showCurrentChat = []
    if (currentChat){
        showCurrentMenu = 
            <CurrentChatMenu 
                currentChat={currentChat}
            ></CurrentChatMenu>
    } else {
        showCurrentMenu = <div className="fake-div-menu"></div>
    }
    
    if (msgs){
        showCurrentChat= 
            <CurrentChatMessages 
                msgs={msgs} 
                currentUserId={currentUser.id}
            ></CurrentChatMessages>
    }else {
        showCurrentChat= <div className="fake-div-messages"></div>
    }

    return (
        <div id='app-structure'>
            <div id='grid-out'>
                <div id='flexbox-chats'>
                    <ChatMenu 
                        name={currentUser.name} 
                        picture={currentUser.profile_picture} 
                        btn_newchat={toggleNewChat} 
                        btn_settings={toggleMenuSettings}
                    ></ChatMenu>
                    <SettingsMenu 
                        show={settingsMenu} 
                        logoff={logoff} 
                        account={goToAccount}
                    ></SettingsMenu>
                    <NewChatList
                        show={showNewChats} 
                        usersData={usersList}
                        onNewChatClick={addNewChat}   
                    ></NewChatList>
                    <SearchBox/>
                    <ChatList 
                        chats={chats} 
                        changeCurrentChat={changeCurrentChat}
                        currentChatID={currentChat}
                    ></ChatList>
                </div>
                <div id='flexbox-current-chat'>
                    {showCurrentMenu}
                    {showCurrentChat}
                    <SendTextBox 
                        value={newMessage} 
                        changeEvent={handleChangeNewMessage} 
                        fSend={sendNewMessage}
                    ></SendTextBox>
                </div>
            </div>
        </div>
    )
}

export default Chats