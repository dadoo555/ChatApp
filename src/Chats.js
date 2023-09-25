import React, { useEffect, useState, useRef } from "react"
import './css/Chats.css'
import './css/Messages.css'
import { useNavigate } from 'react-router-dom'

function ChatListItem (props){
    let source = `/public/images/profil/${props.picture}`

    //format date
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

    return (
        <div onClick={props.onSelected} className='chatlist-box'>
            <img src={source} className='chatlist-picture'></img>
            <div className="chatlist-info">
                <p className='chatlist-name'>{props.name}</p>
                <p className="chatlist-lastmessage">{props.lastmessage}</p>
            </div>
            <div className="chatlist-data">
                <div className="chatlist-time">{time}</div>
                {unreadMessages}
            </div>
        </div>
    )
}

function ChatList (props){
    const data = props.chats
    
    let listChats = []
    data.forEach((chat)=>{
        
        const chooseCurrentItem = ()=>{
            props.changeCurrentChat(chat)
        }

        listChats.push(<ChatListItem 
                            key={chat.id}   
                            name={chat.name} 
                            lastmessage={chat.lastmessage}
                            picture={chat.profile_picture}
                            onSelected={chooseCurrentItem}
                            lastmessagetime={chat.creation_time}
                            unreadCounter={chat.unread}
                        ></ChatListItem>)
    })
       
    return (
        <ul>
            <li>{listChats}</li>
        </ul>
    )
}

function CurrentChatMenu (props){
    let source = `/public/images/profil/${props.currentChat.profile_picture}`
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
            if (msg.read == 0 && notread == undefined ){
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

    const profilePicture = `/public/images/profil/${props.picture}`
    return (
        <div className='top-menu-chat'>
            <div className="myMenuData">
                <img className="myProfilePicture" src={profilePicture}></img>
                <p>{props.name}</p>
            </div>
            <div className="btn-newchat">
                <p>+</p>
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

const AlwaysScrollToBottom = () => {
    const elementRef = useRef();
    useEffect(() => elementRef.current.scrollIntoView());
    return <div ref={elementRef} />;
  };

// ............... Chats APP ...................
const Chats = ()=>{

    const [chats, setChats] = useState([])
    const [msgs, setMsgs] = useState([])
    const [currentChat, setCurrentChat] = useState(undefined)
    const [currentUser, setCurrentUser] = useState(undefined)
    const [newMessage, setNewMessage] = useState(undefined)
    const navigate = useNavigate()

    useEffect(() => { 
        fetch('/api/sessions/me')
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
            return fetch('/api/chats')
        }).then(res => {
            return res.json()
        }).then(data => {
            setChats(data)
            
        }).catch(err =>{
            if (err.message == 'Unauthorized'){
                navigate('/login')
            }
        })
    }, []);

    if (!currentUser){
        return <div></div>
    }

    const changeCurrentChat = (chat)=>{
        setCurrentChat(chat)
        setNewMessage('')
        
        fetch(`/api/chats/${chat.id}/messages`)
        .then(response => {
            return response.json()
        }).then(data =>{
            setMsgs(data)
        }).then(()=>{
            return fetch(`/api/chats/${chat.id}/messages/${currentUser.id}/makeread`, {
                method: 'PUT'    
            })
        }).then((response)=>{
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

        const data = {
            'text': newMessage,
            'sender_id': currentUser.id,
            'chat_id': currentChat.id
        }

        fetch(`/api/chats/${currentChat.id}/messages/new`, {
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
                      newChat.lastmessage = newMessage
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
                setMsgs([...msgs, {'id': msgs[msgs.length - 1].id + 1,'sender_id': currentUser.id,'text': newMessage, 'creation_time': datetime}])            
                setNewMessage('')
                
                
                
            } else {
                alert('send new message error')
            }
        }).catch(err=>{
            throw err
        })
        
    }

    let showCurrentMenu = []
    let showCurrentChat = []
    if (currentChat){
        showCurrentMenu = <CurrentChatMenu currentChat={currentChat}></CurrentChatMenu>
    } else {showCurrentMenu = <div className="fake-div-menu"></div>}
    
    if (msgs){
        showCurrentChat= <CurrentChatMessages msgs={msgs} currentUserId={currentUser.id}></CurrentChatMessages>
    }else {showCurrentChat= <div className="fake-div-messages"></div>}

    return (
        <div id='app-structure'>
            <div id='grid-out'>
                <div id='flexbox-chats'>
                    <ChatMenu name={currentUser.name} picture={currentUser.profile_picture}></ChatMenu>
                    <SearchBox/>
                    <ChatList chats={chats} changeCurrentChat={changeCurrentChat}></ChatList>
                </div>
                <div id='flexbox-current-chat'>
                    {showCurrentMenu}
                    {showCurrentChat}
                    <SendTextBox value={newMessage} changeEvent={handleChangeNewMessage} fSend={sendNewMessage}></SendTextBox>
                </div>
            </div>
        </div>
    )
}

export default Chats