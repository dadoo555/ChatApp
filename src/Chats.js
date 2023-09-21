import React, { useEffect, useState, useRef } from "react"
import './css/Chats.css'
import './css/Messages.css'
import { useNavigate } from 'react-router-dom'

function ChatListItem (props){
    let source = `/public/images/profil/${props.picture}`

    const date = new Date(props.lastmessagetime)
    let h = date.getHours()
    h = ("0" + h).slice(-2);
    let m = date.getMinutes()
    m = ("0" + m).slice(-2);
    const time = h + ':' + m

    return (
        <div onClick={props.onSelected} className='chatlist-box'>
            <img src={source} className='chatlist-picture'></img>
            <div>
                <p className='chatlist-name'>{props.name}</p>
                <p className="chatlist-lastmessage">{props.lastmessage}</p>
            </div>
            <div className="chatlist-time">{time}</div>
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
                            lastmessage={item.lastmessage}
                            picture={item.profile_picture}
                            onSelected={chooseCurrentItem}
                            lastmessagetime={item.creation_time}
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
    const date = new Date(props.datetime)
    let h = date.getHours()
    h = ("0" + h).slice(-2);
    let m = date.getMinutes()
    m = ("0" + m).slice(-2);
    const time = h + ':' + m

    return (
        <div className={classMsgContainer}>
            <div className={classMsg}>
                <p className="msg-text">{props.text}</p>
                <div className="msg-time">
                    <p>{time}</p>
                </div>
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
                {listMsgs}
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
                const newChats = [...chats]
                const newChat = {...currentChat}
                      newChat.lastmessage = newMessage
                      newChat.creation_time = datetime  
                const chatIndex = chats.findIndex(c => c.id == currentChat.id)
                newChats[chatIndex] = newChat
                setChats(newChats)

                //alterar a messages
                setMsgs([...msgs, {'sender_id': currentUser.id,'text': newMessage, 'creation_time': datetime}])            
                setNewMessage('')
                
                //scroll bottom
                
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