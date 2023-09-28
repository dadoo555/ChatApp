import React, { useEffect, useState, useRef } from "react"
import { useNavigate } from 'react-router-dom'
import './css/Account.css'

const Picture = (props)=>{
    let source = `/chat/public/images/profil/${props.picture}`
    return(
        <div className="account-picture">
            <img src={source} alt="profile-picture" />
        </div>
    )
}

const AccountData = (props)=>{

    let password = []
    if (props.passwordState == true){
        password = props.user.password
    } else {
        password = '********'
    }

    return(
        <div className="account-userdata">
            <p className="account-name"><b>{props.user.name}</b></p>
            <p>Nickname: {props.user.nickname}</p>
            <p>Password: {password}</p>
            <label htmlFor="btn-showpassword">
                <input type="checkbox" id="btn-showpassword" onChange={props.togglePassword} name="btn-showpassword"/>
                Show/hide Password
            </label>
        
        </div>
    )
}

const Account = () => {
    const navigate = useNavigate()
    const [currentUser, setCurrentUser] = useState(undefined)
    const [showPassword, setShowPassword] = useState(false)

    useEffect(()=>{
        fetch('/chat/api/sessions/me').then((response)=>{
            if (response.ok){
                return response.json()
            } else {
                throw new Error('Unauthorized')
            } 
        }).then((data)=>{
            setCurrentUser(data.user)
        }).catch(err =>{
            if (err.message == 'Unauthorized'){
                navigate('/chat/login')
            }
        })

    },[])

    if (!currentUser){
        return <div></div>
    }

    const togglePassword = ()=>{
        if (showPassword == true){
            setShowPassword(false)
        } else {
            setShowPassword(true)
        }
    }

    return(
        <div id="structure-account">
            <div id="box-account">
                <div className="menubar-account">
                    <div className="btn-account-back" onClick={()=>{navigate('/chat/')}}>&#8592;</div>
                </div>
                <Picture picture={currentUser.profile_picture}/>
                <AccountData user={currentUser} passwordState={showPassword} togglePassword={togglePassword}/>
            </div>
        </div>
    )



};

export default Account