import React, { useEffect, useState } from "react"
import './css/Chats.css'
import { useNavigate } from 'react-router-dom'

function ChatListItem (props){
    let source = `/public/images/profil/${props.picture}`
    return (
        <div onClick={props.onSelected} className='chatlist-box'>
            <img src={source} className='chatlist-picture'></img>
            <p className='chatlist-name'>{props.name}</p>
            
        </div>
    )
}

function ChatList (props){
    const data = props.chats
    const listItems = []
    data.forEach((item)=>{
        const chooseCurrentItem = ()=>{
            props.changeCurrentChat(item)
        }

        listItems.push(<ChatListItem    
                            name={item.name} 
                            
                            picture={item.profile_picture}
                            onSelected={chooseCurrentItem}
                        ></ChatListItem>)
    })
    return (
        <ul>
            <li>{listItems}</li>
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
    return (
        <div className={classMsgContainer}>
            <div className={classMsg}>
                <p>{props.text}</p>
            </div>
        </div>
    )
}

function CurrentChatMessages (props){
    const data = props.msgs
    const listMsgs = []
    
    data.forEach((msg)=>{
        let msgSender = 'other'
        if (msg.sender_id == props.currentUserId){msgSender = 'me'}

        listMsgs.push(<CurrentChatMessageItem 
                            text={msg.text} 
                            sender_id={msgSender}
                            datetime={msg.creation_time}
                        ></CurrentChatMessageItem>)
    })

    return (
        <div className='current-chat-box'>
            <ul>
                <li>{listMsgs}</li>
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

    

    return(
        <div className="textbox-container">
            <input type="text" placeholder="Write a message here..." value={props.value} onChange={(e)=>props.changeEvent(e.currentTarget.value)}></input>
            <button type="submit" onClick={props.fSend}>Send</button>
        </div>
    )
}

// ............... Chats APP ...................
const Chats = ()=>{

    const [chats, setChats] = useState([])
    const [msgs, setMsgs] = useState(undefined)
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
        }).catch((err)=>{
            throw err
        })
    }

    const handleChangeNewMessage = (value)=>{
        setNewMessage(value)
    }

    const sendNewMessage = ()=>{
        
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