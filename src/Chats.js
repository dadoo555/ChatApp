import React, { useEffect, useState } from "react"
import './css/Chats.css'
import { useNavigate } from 'react-router-dom'

function ChatListItem (props){
    return (
        <div onClick={props.onSelected} className='chatlist-box'>
            <p className='chatlist-picture'>{props.picture}</p>
            <p className='chatlist-name'>{props.name}</p>
            <p className='chatlist-lastmessage'>{props.lastmessage}</p>
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
                            picture={item.picture}
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
    return (  
        <div className='top-menu-current-chat'>
            <p>{props.currentChat.name}</p>
            <p>{props.currentChat.picture}</p>
        </div>
    )
}

function CurrentChatMessageItem(props){

    return(
        <p>{props.value}</p>
    )
}

function CurrentChatMessages (props){
    const data = props.msgs.messages
    console.log(data)
    const listMsgs = []
    
    data.forEach((msg)=>{
        listMsgs.push(<CurrentChatMessageItem value={msg}></CurrentChatMessageItem>)
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
    // const profilePicture = require(`../public/images/profil/${props.picture}`)
    const profilePicture = `/public/images/profil/${props.picture}`
    return  <div className='top-menu-chat'>
                <img className="myProfilePicture" src={profilePicture}></img>
                <p>{props.name}</p>
            </div>
}

// ............... Chats APP ...................
const Chats = ()=>{

    const [chats, setChats] = useState([])
    const [msgs, setMsgs] = useState(undefined)
    const [currentChat, setCurrentChat] = useState(undefined)
    const [currentUser, setCurrentUser] = useState(undefined)
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
        
        fetch(`/api/chats/${chat.id}/messages`)
        .then(response => {
            return response.json()
        }).then(data =>{
            setMsgs(data)
        }).catch((err)=>{
            throw err
        })
    }

    let showCurrentMenu = []
    let showCurrentChat = []
    if (currentChat){
        showCurrentMenu = <CurrentChatMenu currentChat={currentChat}></CurrentChatMenu>
    }
    
    if (msgs){
        showCurrentChat= <CurrentChatMessages msgs={msgs}></CurrentChatMessages>
    }

    return (
        <div id='app-structure'>
            <div id='grid-out'>
                <div id='flexbox-chats'>
                    <ChatMenu name={currentUser.name} picture={currentUser.profile_picture}></ChatMenu>
                    <div className='search-box'>
                        <p>caixa de pesquisa</p>
                    </div>
                    <ChatList chats={chats} changeCurrentChat={changeCurrentChat}></ChatList>
                </div>
                <div id='flexbox-current-chat'>
                    {showCurrentMenu}
                    {showCurrentChat}
                </div>
            </div>
        </div>
    )
}

export default Chats